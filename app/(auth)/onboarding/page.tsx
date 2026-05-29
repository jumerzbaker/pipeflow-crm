'use client'

import { useActionState } from 'react'
import { createWorkspace } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/auth/FieldError'
import { Building2 } from 'lucide-react'

const WORKSPACE_EXAMPLES = ['Acme Corp', 'Minha Empresa', 'Vendas 2025']

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(createWorkspace, undefined)

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <Building2 className="size-6 text-violet-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">Crie seu workspace</h1>
          <p className="mt-2 text-sm text-gray-500">
            O workspace é o espaço do seu time. Você pode convidar colaboradores depois.
          </p>
        </div>

        <form action={action} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-300">
              Nome do workspace
            </label>
            <input
              id="workspaceName"
              name="workspaceName"
              type="text"
              autoComplete="organization"
              autoFocus
              placeholder="Ex: Acme Corp"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
              aria-invalid={!!state?.errors?.workspaceName}
              aria-describedby={state?.errors?.workspaceName ? 'workspace-error' : undefined}
            />
            <FieldError id="workspace-error" errors={state?.errors?.workspaceName} />
            <p className="text-xs text-gray-600">
              Sugestões:{' '}
              {WORKSPACE_EXAMPLES.map((ex, i) => (
                <span key={ex}>
                  <span className="text-gray-500">{ex}</span>
                  {i < WORKSPACE_EXAMPLES.length - 1 && (
                    <span className="mx-1 text-gray-700">·</span>
                  )}
                </span>
              ))}
            </p>
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
            className="w-full bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-500/50 disabled:opacity-60"
          >
            {pending ? 'Criando workspace…' : 'Criar workspace e entrar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Você pode alterar o nome do workspace depois em Configurações.
        </p>
      </div>
    </div>
  )
}
