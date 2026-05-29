import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-white text-base font-bold tracking-tight">
          P
        </div>
        <span className="text-xl font-semibold text-white tracking-wide">PipeFlow</span>
      </div>
      {children}
    </div>
  )
}
