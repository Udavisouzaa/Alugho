import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createContract } from '../actions'

export default async function NewContractPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar propriedades do usuário
  const { data: properties } = await supabase
    .from('properties')
    .select('id, endereco')
    .eq('user_id', user.id)

  const propertyIds = properties?.map(p => p.id) || []

  // Buscar inquilinos do usuário baseando-se nas propriedades
  let tenants: any[] = []
  if (propertyIds.length > 0) {
    const { data: t } = await supabase
      .from('tenants')
      .select('id, nome')
      .in('property_id', propertyIds)
    tenants = t || []
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/contracts"
          className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Novo Contrato</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Vincule um imóvel a um inquilino e defina as regras.</p>
        </div>
      </div>

      <form action={createContract} className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-200 dark:border-gray-700 p-8 shadow-sm">
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Imóvel Vinculado *</label>
              <select 
                name="property_id" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              >
                <option value="">Selecione um imóvel...</option>
                {properties?.map(p => (
                  <option key={p.id} value={p.id}>{p.endereco}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Inquilino *</label>
              <select 
                name="tenant_id" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              >
                <option value="">Selecione um inquilino...</option>
                {tenants?.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Data de Início *</label>
              <input 
                type="date" 
                name="start_date" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Data de Fim (Opcional)</label>
              <input 
                type="date" 
                name="end_date" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white text-slate-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Valor do Aluguel (R$) *</label>
              <input 
                type="number" 
                name="rent_amount"
                step="0.01" 
                placeholder="Ex: 2500.00"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Dia do Vencimento *</label>
              <input 
                type="number" 
                name="due_day"
                min="1"
                max="31"
                placeholder="Ex: 10"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Índice de Reajuste</label>
              <select 
                name="readjustment_index" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              >
                <option value="IGP-M">IGP-M</option>
                <option value="IPCA">IPCA</option>
                <option value="INPC">INPC</option>
                <option value="Fixo">Fixo / Sem Reajuste</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Garantia Locatícia</label>
              <select 
                name="guarantee_type" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              >
                <option value="Nenhuma">Sem Garantia</option>
                <option value="Caução">Caução (Depósito)</option>
                <option value="Fiador">Fiador</option>
                <option value="Seguro Fiança">Seguro Fiança</option>
                <option value="Título de Capitalização">Título de Capitalização</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-gray-700 flex justify-end gap-3">
          <Link
            href="/dashboard/contracts"
            className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-600/20"
          >
            <Save className="w-4 h-4" />
            Salvar Contrato
          </button>
        </div>
      </form>
    </div>
  )
}
