import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm text-center">
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl shadow-black/60">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
          <Mail className="size-6 text-violet-400" />
        </div>
        <h1 className="text-xl font-semibold text-white">Verifique seu e-mail</h1>
        <p className="mt-3 text-sm text-gray-400">
          Enviamos um link de confirmação para o seu e-mail. Clique no link para ativar sua conta e
          continuar.
        </p>
        <p className="mt-4 text-xs text-gray-600">
          Não recebeu?{' '}
          <Link href="/signup" className="text-violet-400 transition-colors hover:text-violet-300">
            Tente cadastrar novamente
          </Link>{' '}
          ou verifique a pasta de spam.
        </p>
      </div>
    </div>
  )
}
