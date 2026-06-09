import Link from 'next/link'
import { UserX, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NoWorkspacePage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl shadow-black/60">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-red-600/20 ring-1 ring-red-500/30">
            <UserX className="size-6 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">
            Você não está em nenhum workspace
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sua conta foi removida do workspace ou você ainda não faz parte de nenhum.
            Crie um novo workspace para continuar usando o PipeFlow.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/onboarding"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-500/50',
            )}
          >
            <Plus className="mr-2 size-4" />
            Criar novo workspace
          </Link>

          <p className="text-center text-xs text-gray-600">
            Recebeu um convite?{' '}
            <span className="text-gray-500">
              Verifique seu e-mail e clique no link do convite.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
