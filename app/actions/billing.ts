'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthedUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

async function getWorkspaceForBilling(workspaceId: string, userId: string) {
  const admin = getSupabaseAdminClient()

  const { data: membership } = await admin
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!membership) throw new Error('Forbidden')

  const { data: workspace } = await admin
    .from('workspaces')
    .select('id, name, plan, stripe_customer_id')
    .eq('id', workspaceId)
    .single()

  if (!workspace) throw new Error('Workspace não encontrado')
  return workspace
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export async function createCheckoutSession(workspaceId: string): Promise<never> {
  const user = await getAuthedUser()
  const workspace = await getWorkspaceForBilling(workspaceId, user.id)

  if (workspace.plan === 'pro') redirect('/settings?tab=billing')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Reutiliza o customer existente ou cria um novo
  let customerId = workspace.stripe_customer_id ?? undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { workspace_id: workspaceId },
    })
    customerId = customer.id

    await getSupabaseAdminClient()
      .from('workspaces')
      .update({ stripe_customer_id: customerId })
      .eq('id', workspaceId)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      { price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 },
    ],
    success_url: `${appUrl}/settings?tab=billing&checkout=success`,
    cancel_url: `${appUrl}/settings?tab=billing`,
    metadata: { workspace_id: workspaceId },
    subscription_data: {
      metadata: { workspace_id: workspaceId },
    },
  })

  redirect(session.url!)
}

// ── Customer Portal ───────────────────────────────────────────────────────────

export async function createPortalSession(workspaceId: string): Promise<never> {
  const user = await getAuthedUser()
  const workspace = await getWorkspaceForBilling(workspaceId, user.id)

  if (!workspace.stripe_customer_id) redirect('/settings?tab=billing')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: workspace.stripe_customer_id,
    return_url: `${appUrl}/settings?tab=billing`,
  })

  redirect(session.url)
}
