'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/auth/FieldError'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl shadow-black/60">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Entrar na sua conta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link
              href="/signup"
              className="text-violet-400 transition-colors hover:text-violet-300"
            >
              Criar grátis
            </Link>
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                Esqueci a senha
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
              aria-invalid={!!state?.errors?.password}
              aria-describedby={state?.errors?.password ? 'password-error' : undefined}
            />
            <FieldError id="password-error" errors={state?.errors?.password} />
          </div>

          {state?.message && (
            <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="mt-2 w-full bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-500/50 disabled:opacity-60"
          >
            {pending ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
