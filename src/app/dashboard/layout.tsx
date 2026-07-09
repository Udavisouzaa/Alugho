import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { SubscriptionGuard } from '@/components/dashboard/SubscriptionGuard'

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

  // Busca o status atual da assinatura
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const subscriptionStatus = sub?.status || 'none'

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 font-sans overflow-hidden transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-16 md:pb-0">
        <Topbar name={name} initials={initials} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-10">
          <div className="mx-auto flex flex-col gap-8 min-h-full md:h-full max-w-7xl">
            <SubscriptionGuard status={subscriptionStatus}>
              {children}
            </SubscriptionGuard>
          </div>
        </main>
      </div>
    </div>
  )
}
