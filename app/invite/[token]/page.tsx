import { notFound } from 'next/navigation'
import { Building2, ShieldCheck, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { getInviteDetails, acceptInvite } from '@/app/actions/invites'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// ── Helpers ────────────────────────────────────────────────────────────────────

function roleLabel(role: string) {
  return role === 'admin' ? 'Administrador' : 'Membro'
}

function RoleIcon({ role }: { role: string }) {
  return role === 'admin' ? (
    <ShieldCheck className="h-5 w-5 text-violet-400" />
  ) : (
    <UserCheck className="h-5 w-5 text-violet-400" />
  )
}

// ── Accept form (Client wrapper not needed — Server Action via form) ───────────

async function AcceptForm({ token }: { token: string }) {
  async function accept() {
    'use server'
    await acceptInvite(token)
  }
  return (
    <form action={accept}>
      <button
        type="submit"
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 active:scale-[0.98]"
      >
        Aceitar convite
      </button>
    </form>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const details = await getInviteDetails(token)

  if (!details) notFound()

  // Check if user is logged in (to show contextual message)
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-base font-bold text-white">
          P
        </div>
        <span className="text-xl font-semibold tracking-wide text-white">PipeFlow</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111113] p-8 shadow-xl">

        {details.accepted ? (
          // ── Already accepted ────────────────────────────────────────────────
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Convite já aceito</h1>
              <p className="mt-1.5 text-sm text-zinc-400">
                Você já faz parte do workspace{' '}
                <span className="font-medium text-zinc-200">{details.workspaceName}</span>.
              </p>
            </div>
            <a
              href="/dashboard"
              className="mt-2 w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Ir para o dashboard
            </a>
          </div>
        ) : details.expired ? (
          // ── Expired ─────────────────────────────────────────────────────────
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15">
              <AlertTriangle className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Convite expirado</h1>
              <p className="mt-1.5 text-sm text-zinc-400">
                Este convite para{' '}
                <span className="font-medium text-zinc-200">{details.workspaceName}</span>{' '}
                expirou. Peça ao administrador do workspace para enviar um novo convite.
              </p>
            </div>
          </div>
        ) : (
          // ── Valid invite ─────────────────────────────────────────────────────
          <div className="flex flex-col gap-6">
            {/* Workspace info */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
                <Building2 className="h-7 w-7 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Convite para
                </p>
                <h1 className="mt-1 text-xl font-bold text-white">{details.workspaceName}</h1>
              </div>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
              <RoleIcon role={details.role} />
              <div>
                <p className="text-xs text-zinc-500">Você será adicionado como</p>
                <p className="text-sm font-semibold text-white">{roleLabel(details.role)}</p>
              </div>
            </div>

            {/* CTA */}
            {user ? (
              <AcceptForm token={token} />
            ) : (
              <div className="flex flex-col gap-2">
                <a
                  href={`/login?next=/invite/${token}`}
                  className="w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Fazer login para aceitar
                </a>
                <a
                  href={`/signup?next=/invite/${token}`}
                  className="w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/5"
                >
                  Criar conta
                </a>
              </div>
            )}

            <p className="text-center text-xs text-zinc-600">
              Ao aceitar, você concorda em fazer parte deste workspace e com os
              termos de uso do PipeFlow.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
