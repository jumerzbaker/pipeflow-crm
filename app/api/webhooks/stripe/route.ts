import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = getSupabaseAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const workspaceId = session.metadata?.workspace_id
      if (!workspaceId) break

      await admin
        .from('workspaces')
        .update({
          plan: 'pro',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', workspaceId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspace_id

      if (workspaceId) {
        await admin
          .from('workspaces')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('id', workspaceId)
      } else {
        await admin
          .from('workspaces')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_subscription_id', subscription.id)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subDetails = invoice.parent?.subscription_details
      const workspaceId = subDetails?.metadata?.workspace_id
        ?? (subDetails?.subscription
          ? await admin
              .from('workspaces')
              .select('id')
              .eq('stripe_subscription_id', subDetails.subscription as string)
              .maybeSingle()
              .then(({ data }) => data?.id)
          : undefined)

      if (!workspaceId) break

      // Registra a falha — o plano só é rebaixado em subscription.deleted
      // para dar tempo ao Stripe de tentar novamente (Smart Retries)
      await admin
        .from('workspaces')
        .update({ payment_failed: true })
        .eq('id', workspaceId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
