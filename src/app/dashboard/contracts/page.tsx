import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, Search, Calendar, DollarSign, Home, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contracts: any[] = []
  
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        properties ( endereco ),
        tenants ( nome )
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (data && !error) {
      contracts = data
    }
  } catch (err) {
    console.error("Erro ao buscar contratos (talvez a tabela ainda não exista):", err)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Contratos de Locação</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Gerencie os prazos e reajustes dos seus imóveis alugados.</p>
        </div>
        
        <Link
          href="/dashboard/contracts/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/20"
        >
          <Plus className="w-5 h-5" />
          Novo Contrato
        </Link>
      </div>

      {/* Renderização para Mobile (Cards) */}
      <div className="block md:hidden space-y-4">
        {contracts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-gray-700 mb-4">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Nenhum contrato ativo</h3>
            <p className="text-slate-500 dark:text-gray-400 text-xs mb-6">
              Comece a organizar os prazos e reajustes vinculando um inquilino.
            </p>
            <Link
              href="/dashboard/contracts/new"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-sm hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              Cadastrar primeiro
            </Link>
          </div>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 pr-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{contract.properties?.endereco}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{contract.tenants?.nome}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  contract.status === 'ativo' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                    : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {contract.status === 'ativo' ? 'Ativo' : 'Fim'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-gray-900/50 rounded-xl">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Valor do Aluguel</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    R$ {Number(contract.rent_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Vencimento</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-gray-300">
                    Dia {contract.due_day}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-slate-500 dark:text-gray-400">
                  <span className="font-semibold text-slate-700 dark:text-gray-300">Índice:</span> {contract.readjustment_index}
                </div>
                <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Renderização para Desktop (Tabela) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-3xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                <th className="p-4 px-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Imóvel & Inquilino</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Valor e Reajuste</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Prazo</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-700 mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Nenhum contrato ativo</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                      Comece a organizar os prazos e reajustes dos seus aluguéis vinculando um inquilino a um imóvel.
                    </p>
                    <Link
                      href="/dashboard/contracts/new"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Cadastrar primeiro contrato
                    </Link>
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                          <Home className="w-4 h-4 text-slate-400" />
                          <span className="truncate max-w-[200px]">{contract.properties?.endereco}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                          <User className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{contract.tenants?.nome}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          R$ {Number(contract.rent_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          Dia {contract.due_day} • Reajuste: {contract.readjustment_index}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-gray-300">
                          {contract.start_date ? new Date(contract.start_date).toLocaleDateString('pt-BR') : 'N/A'} 
                          <span className="mx-1 text-slate-400">até</span> 
                          {contract.end_date ? new Date(contract.end_date).toLocaleDateString('pt-BR') : 'Indeterminado'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        contract.status === 'ativo' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {contract.status === 'ativo' ? 'Ativo' : 'Encerrado'}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right">
                      <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
