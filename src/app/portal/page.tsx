import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const revalidate = 0; // Opt out of caching

export default async function TenantPortalPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  // Buscar os dados do inquilino baseados na RLS (auth_id)
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id, nome, property_id')
    .single()

  if (tenantError || !tenant) {
    // Se não encontrou o tenant, o trigger falhou ou o email não bate
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Acesso Negado</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Seu e-mail não está vinculado a nenhum contrato de aluguel ativo.
          Contate seu locador.
        </p>
      </div>
    )
  }

  // Buscar as faturas do inquilino
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  const currentInvoice = invoices?.find(inv => inv.status === 'pendente' || inv.status === 'atrasado')
  const pastInvoices = invoices?.filter(inv => inv.status === 'pago') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Olá, {tenant.nome}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui você gerencia seus pagamentos de aluguel.</p>
      </div>

      {/* Fatura Atual em Destaque */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sua Fatura Atual</h2>
        {currentInvoice ? (
          <div className={`p-6 rounded-xl shadow-sm border ${
            currentInvoice.status === 'atrasado' 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mês de Referência
                </p>
                <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">
                  {currentInvoice.mes_referencia}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                currentInvoice.status === 'atrasado' 
                  ? 'bg-orange-200 text-orange-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentInvoice.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor do Aluguel</p>
              <p className="text-3xl font-medium text-gray-900 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentInvoice.valor)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Vencimento: <strong>{new Date(currentInvoice.data_vencimento).toLocaleDateString('pt-BR')}</strong>
              </p>
            </div>

            <a 
              href={currentInvoice.payment_link || '#'}
              target="_blank"
              className={`block w-full py-3 px-4 rounded-md text-center font-medium text-white transition-colors ${
                currentInvoice.status === 'atrasado'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              Pagar Fatura
            </a>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-gray-900 dark:text-white font-medium">Tudo em dia!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Você não possui faturas pendentes no momento.</p>
          </div>
        )}
      </section>

      {/* Histórico de Faturas */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Histórico de Pagamentos</h2>
        {pastInvoices.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            {pastInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{inv.mes_referencia}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pago em {new Date(inv.data_pagamento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.valor)}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase bg-emerald-50 text-emerald-700">
                    Pago
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum pagamento registrado ainda.</p>
        )}
      </section>
    </div>
  )
}
