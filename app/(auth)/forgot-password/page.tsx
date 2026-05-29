'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { forgotPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/auth/FieldError'
import { CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  if (state?.message) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl shadow-black/60">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle className="size-6 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">E-mail enviado</h2>
          <p className="mt-2 text-sm text-gray-400">{state.message}</p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            ← Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl shadow-black/60">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Recuperar senha</h1>
          <p className="mt-1 text-sm text-gray-500">
            Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
              aria-invalid={!!state?.errors?.email}
              aria-describedby={state?.errors?.email ? 'email-error' : undefined}
            />
            <FieldError id="email-error" errors={state?.errors?.email} />
          </div>

          <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="mt-2 w-full bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-500/50 disabled:opacity-60"
          >
            {pending ? 'Enviando…' : 'Enviar instruções'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
