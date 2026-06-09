import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACTIVE_WS_COOKIE = 'pf_active_ws'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAppRoute = request.nextUrl.pathname.match(
    /^\/(dashboard|leads|pipeline|settings)/
  )

  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Onboarding é acessível a usuários autenticados (sem workspace ainda)
  const isAuthRoute = request.nextUrl.pathname.match(
    /^\/(login|signup|forgot-password)/
  )

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verifica se o usuário ainda pertence ao workspace ativo a cada request
  if (isAppRoute && user) {
    const activeWsId = request.cookies.get(ACTIVE_WS_COOKIE)?.value

    if (activeWsId) {
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('workspace_id', activeWsId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!membership) {
        // Usuário foi removido — verifica se ainda tem outros workspaces
        const { data: otherWs } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle()

        const redirectUrl = otherWs
          ? new URL('/dashboard', request.url)
          : new URL('/no-workspace', request.url)

        const redirectResponse = NextResponse.redirect(redirectUrl)
        redirectResponse.cookies.delete(ACTIVE_WS_COOKIE)
        return redirectResponse
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
