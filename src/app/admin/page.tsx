import { Users, Home, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const adminDb = createAdminClient()

  // Buscar Total de Locadores (Usuários Autenticados)
  const { data: authData } = await adminDb.auth.admin.listUsers()
  const totalProprietarios = authData?.users?.length || 0

  // Buscar Total de Imóveis Ativos na Plataforma
  const { count: imoveisAtivos } = await adminDb
    .from('properties')
    .select('*', { count: 'exact', head: true })

  // Buscar Receita Recorrente (MRR) baseada nos Contratos Ativos
  const { data: contractsData } = await adminDb
    .from('contracts')
    .select('rent_amount')
    .eq('status', 'ativo')

  const mrr = contractsData?.reduce((acc, curr) => acc + Number(curr.rent_amount), 0) || 0

  // Inadimplência mockada por enquanto até termos o módulo de cobranças processando webhooks reais de atraso
  const inadimplencia = 0.0

  const metrics = {
    totalProprietarios,
    imoveisAtivos: imoveisAtivos || 0,
    mrr,
    inadimplencia
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral da Operação</h1>
        <p className="text-slate-500 mt-1">Acompanhe as métricas globais da Alugho.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Locadores</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.totalProprietarios}</div>
          <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12 este mês
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Imóveis Ativos</h3>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.imoveisAtivos}</div>
          <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +45 este mês
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">MRR (Receita)</h3>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +R$ 850 este mês
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Inadimplência</h3>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.inadimplencia}%</div>
          <div className="mt-2 text-sm text-rose-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +0.5% este mês
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Últimos Cadastros</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs">
                    US
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Locador {i}</p>
                    <p className="text-xs text-slate-500">locador{i}@email.com</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">PLANO CONTROLE</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Volume de Cobranças (Mês)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Mock Chart */}
            {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
              <div key={i} className="w-full bg-emerald-100 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
