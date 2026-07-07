import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserDropdown } from '@/components/UserDropdown'

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
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
                A
              </div>
              <span className="text-xl font-medium text-gray-900 dark:text-white hidden sm:block">Alugho</span>
            </Link>
            
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                Meus Imóveis
              </Link>
              <Link href="/dashboard/invoices" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                Faturas
              </Link>
              <Link href="/dashboard/properties/new" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1">
                + Novo
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <UserDropdown name={name} initials={initials} />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  )
}
