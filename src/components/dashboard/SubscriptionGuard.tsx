'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Lock } from 'lucide-react'

export function SubscriptionGuard({ status, children }: { status: string, children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Se está na tela de cobrança, sempre libera a renderização
  if (pathname === '/dashboard/billing') {
    return <>{children}</>
  }

  // Define os status que bloqueiam a plataforma
  const isBlocked = status === 'past_due' || status === 'canceled' || status === 'none'

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Acesso Restrito</h2>
          <p className="text-slate-500 dark:text-gray-400">
            Sua assinatura do Alugho encontra-se inativa ou pendente. Para continuar gerenciando seus imóveis, regularize seu plano.
          </p>
        </div>
        <Link 
          href="/dashboard/billing" 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          Regularizar Assinatura
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
