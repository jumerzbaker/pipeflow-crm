import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const safeNext = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  if (code) {
    const supabase = await getSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(safeNext, origin))
}
