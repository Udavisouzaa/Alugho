'use client'

import { Home, HomeIcon, Users, Wrench, LogOut, Building2, CreditCard, FileText, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Visão Geral' },
    { href: '/dashboard/properties', icon: HomeIcon, label: 'Imóveis' },
    { href: '/dashboard/contracts', icon: FileText, label: 'Contratos' },
    { href: '/dashboard/tenants', icon: Users, label: 'Inquilinos' },
    { href: '/dashboard/maintenance', icon: Wrench, label: 'Manutenção' },
    { href: '/dashboard/billing', icon: CreditCard, label: 'Assinatura' },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const copyTenantPortalLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portal`)
    alert('Link do portal copiado!')
  }

  return (
    <>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-slate-200/80 dark:border-gray-700 flex-col z-20 shrink-0 hidden md:flex h-full shadow-[var(--shadow-xs)]">
        <div className="p-8">
          <div className="flex items-center justify-center py-6">
          <img src="/logo.png" alt="Alugho" className="h-12 w-auto object-contain rounded-xl" />
        </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative cursor-pointer ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 relative z-10 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-5 border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100 relative overflow-hidden hidden md:block group">
            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Precisa de Ajuda?</p>
              </div>
              <p className="text-xs leading-relaxed opacity-80 mb-3">Fale com nosso time de especialistas no WhatsApp.</p>
              <a 
                href="https://wa.me/5548992084726?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20meu%20painel%20Alugho!" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                Chamar Suporte
              </a>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-500 dark:text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all cursor-pointer font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 flex items-center justify-around p-2 z-50 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
