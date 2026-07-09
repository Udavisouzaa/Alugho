import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, Users, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Defina aqui os emails que têm acesso de superadmin (MVP)
const ADMIN_EMAILS = [
  'admin@alugho.com',
  'davisouza.ofc2@gmail.com',
  'veridianofer@gmail.com'
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica se é admin (mock MVP baseado em e-mail)
  // Em produção real, você checaria uma flag is_superadmin na tabela users
  const isAdmin = ADMIN_EMAILS.includes(user.email || '')
  
  if (!isAdmin) {
    // Se não for admin, chuta de volta pro dashboard normal
    redirect('/dashboard?error=Acesso negado ao painel administrativo')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-emerald-400">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-black tracking-tight text-white">Alugho Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Locadores</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Sair do Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Painel de Controle Interno</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">{user.email}</span>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
