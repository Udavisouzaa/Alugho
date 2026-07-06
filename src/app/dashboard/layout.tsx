import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const name = user.user_metadata?.full_name || 'Locador'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity">
              RentPay
            </Link>
            <nav className="hidden sm:flex gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Meus Imóveis
              </Link>
              <Link href="/dashboard/invoices" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Faturas
              </Link>
              <Link href="/dashboard/properties/new" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                + Novo Imóvel
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Olá, {name}</span>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  )
}
