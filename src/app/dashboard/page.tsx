import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const revalidate = 0; // Opt out of caching for this page

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Buscar propriedades
  const { data: properties, error: propsError } = await supabase
    .from('properties')
    .select(`
      *,
      tenants (
        id,
        nome,
        telefone,
        punctuality_scores (
          score_atual,
          pagamentos_em_dia
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (propsError) {
    console.error('Error fetching properties:', propsError)
  }

  // 2. Buscar faturas para calcular KPIs (Recebido no mês e Em atraso)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('valor, status, data_pagamento')

  // 3. Buscar chamados de manutenção para o KPI
  const { data: maintenance } = await supabase
    .from('maintenance_requests')
    .select('status')
    .in('status', ['aberto', 'andamento'])

  // Calcular KPIs
  const totalImoveis = properties?.length || 0;
  
  let recebidoNoMes = 0;
  let emAtraso = 0;

  if (invoices) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    invoices.forEach(inv => {
      if (inv.status === 'atrasado') {
        emAtraso++;
      }
      if (inv.status === 'pago' && inv.data_pagamento) {
        const pagDate = new Date(inv.data_pagamento);
        // Considerando o mês de pagamento local do servidor/Next.js
        if (pagDate.getUTCMonth() === currentMonth && pagDate.getUTCFullYear() === currentYear) {
          recebidoNoMes += (Number(inv.valor) || 0);
        }
      }
    })
  }

  const chamadosAbertos = maintenance?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Imóveis</p>
          <p className="text-3xl font-medium text-gray-900">{totalImoveis}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Recebido no mês</p>
          <p className="text-3xl font-medium text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(recebidoNoMes)}
          </p>
        </div>

        <div className={`rounded-xl shadow-sm border p-5 flex flex-col justify-center ${
          emAtraso > 0 ? 'bg-orange-100 border-orange-200' : 'bg-white border-gray-100'
        }`}>
          <p className={`text-sm font-medium mb-1 ${emAtraso > 0 ? 'text-orange-800' : 'text-gray-500'}`}>Em atraso</p>
          <p className={`text-3xl font-medium ${emAtraso > 0 ? 'text-orange-900' : 'text-gray-900'}`}>{emAtraso}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Chamados abertos</p>
          <p className="text-3xl font-medium text-gray-900">{chamadosAbertos}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-end">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">Seus imóveis</h3>
      </div>

      {/* Lista Horizontal de Imóveis */}
      <div className="flex flex-col gap-3">
        {properties && properties.length > 0 ? (
          properties.map((property) => {
            const activeTenant = property.tenants && property.tenants.length > 0 
              ? property.tenants[property.tenants.length - 1] 
              : null;

            if (property.status !== 'ocupado' || !activeTenant) {
              // Card Vago
              return (
                <div key={property.id} className="bg-white rounded-xl border border-dashed border-gray-300 p-4 flex items-center justify-between transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm font-medium">{property.endereco} — Vago</span>
                  </div>
                  <Link
                    href={`/dashboard/tenants/new?property_id=${property.id}`}
                    className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cadastrar inquilino
                  </Link>
                </div>
              );
            }

            // Card Ocupado
            const score = activeTenant.punctuality_scores?.[0]?.score_atual || 0;
            // Simplificando o status para bater com o design (se tem faturas em atraso vs pago)
            // Em um app real, buscaríamos a fatura do mês deste imóvel específico.
            // Por enquanto, faremos o cálculo com base no score.
            const isLate = score < 80;

            return (
              <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-colors hover:shadow-md">
                <div className="flex flex-col">
                  <Link href={`/dashboard/properties/${property.id}`} className="text-base font-medium text-gray-900 hover:underline">
                    {property.endereco}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Inquilino: {activeTenant.nome} · Venc. dia {property.dia_vencimento}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    score >= 90 ? 'bg-emerald-100 text-emerald-800' :
                    score >= 60 ? 'bg-amber-100 text-amber-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    Score {Math.round(score)}
                  </span>
                  
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    !isLate ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {!isLate ? 'Pago' : 'Atrasado'}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-teal-50 p-4 rounded-full mb-4">
              <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Você ainda não tem imóveis cadastrados</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-md">O Alugho funciona muito melhor quando você adiciona seus imóveis e inquilinos. Comece agora mesmo a automatizar suas cobranças!</p>
            <Link
              href="/dashboard/properties/new"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cadastrar Primeiro Imóvel
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
