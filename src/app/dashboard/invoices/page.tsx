import { createClient } from '@/utils/supabase/server'

export const revalidate = 0; // Opt out of caching

export default async function InvoicesPage() {
  const supabase = await createClient()

  // O RLS do Supabase já garante que só as faturas dos imóveis deste usuário retornem
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      *,
      tenants ( nome ),
      properties ( endereco )
    `)
    .order('mes_referencia', { ascending: false })
    .order('data_vencimento', { ascending: false })

  if (error) {
    console.error('Error fetching invoices:', error)
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    
  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Gestão de Faturas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acompanhe as cobranças geradas para os inquilinos.</p>
        </div>
        <form action="/api/cron/daily" method="GET" target="_blank">
          <button 
            type="submit"
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-colors"
          >
            Executar Cron Manualmente (Teste)
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Imóvel / Inquilino</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mês Ref.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {invoices && invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={inv.properties?.endereco}>
                        {inv.properties?.endereco}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {inv.tenants?.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {inv.mes_referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(inv.data_vencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {formatCurrency(inv.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === 'pago' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        inv.status === 'atrasado' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {inv.payment_link ? (
                        <a href={inv.payment_link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300">
                          {inv.status === 'pago' ? 'Ver Recibo' : 'Pagar via Gateway'}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Sem link</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma fatura encontrada. Utilize o botão acima para simular o cron job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
