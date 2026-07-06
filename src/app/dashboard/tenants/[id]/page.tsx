import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateTenant } from '../actions'
import DeleteButton from './DeleteButton'
import MaskedInput from '@/components/MaskedInput'
import { calculatePunctualityScore, Invoice } from '@/punctuality'

export default async function EditTenantPage(props: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const supabase = await createClient()

  // Buscar o inquilino
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*, properties(endereco)')
    .eq('id', params.id)
    .single()

  // Buscar faturas para calcular o score de pontualidade do Jules
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('tenant_id', params.id)

  const mappedInvoices: Invoice[] = (invoices || []).map(inv => ({
    status: inv.status,
    data_vencimento: new Date(inv.data_vencimento),
    data_pagamento: inv.data_pagamento ? new Date(inv.data_pagamento) : null,
    valor: inv.valor
  }))

  const punctualityScore = calculatePunctualityScore(mappedInvoices)

  if (tenantError || !tenant) {
    redirect('/dashboard')
  }

  // Bind the action to pass the ID
  const updateAction = updateTenant.bind(null, params.id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:text-teal-800 mb-4 inline-block transition-colors">
            &larr; Voltar para Dashboard
          </Link>
          <h2 className="text-2xl font-medium text-gray-900">Editar Inquilino</h2>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e atualize os dados do contrato.
          </p>
        </div>
        
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Score de Pontualidade</span>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-medium ${punctualityScore >= 80 ? 'text-emerald-600' : punctualityScore >= 50 ? 'text-amber-600' : 'text-orange-600'}`}>
                {punctualityScore.toFixed(0)}
              </span>
              <span className="text-sm font-medium text-gray-400">/100</span>
            </div>
          </div>
          <div className="ml-4 flex items-center">
            <DeleteButton id={params.id} propertyId={tenant.property_id} />
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {searchParams.error && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-md text-sm">
            {searchParams.error}
          </div>
        )}

        <form action={updateAction} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              defaultValue={tenant.nome}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <MaskedInput
                maskType="cpf"
                name="cpf"
                id="cpf"
                defaultValue={tenant.cpf}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <MaskedInput
                maskType="phone"
                name="telefone"
                id="telefone"
                defaultValue={tenant.telefone}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={tenant.email || ''}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="data_inicio_contrato" className="block text-sm font-medium text-gray-700 mb-1">
                Início do Contrato
              </label>
              <input
                type="date"
                name="data_inicio_contrato"
                id="data_inicio_contrato"
                defaultValue={tenant.data_inicio_contrato}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
