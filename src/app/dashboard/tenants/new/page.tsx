import Link from 'next/link'
import { createTenant } from '../actions'
import MaskedInput from '@/components/MaskedInput'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewTenantPage(props: {
  searchParams: Promise<{ property_id?: string; error?: string }>
}) {
  const searchParams = await props.searchParams

  if (!searchParams.property_id) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Buscar detalhes do imóvel para mostrar no cabeçalho
  const { data: property } = await supabase
    .from('properties')
    .select('endereco')
    .eq('id', searchParams.property_id)
    .single()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 inline-block">
          &larr; Voltar para Dashboard
        </Link>
        <h2 className="text-2xl font-semibold text-gray-900">Novo Inquilino</h2>
        <p className="text-sm text-gray-500 mt-1">
          Vinculando inquilino ao imóvel: <span className="font-medium text-gray-700">{property?.endereco || 'Desconhecido'}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {searchParams.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {searchParams.error}
          </div>
        )}

        <form action={createTenant} className="space-y-6">
          <input type="hidden" name="property_id" value={searchParams.property_id} />
          
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              required
              placeholder="João da Silva"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                required
                placeholder="000.000.000-00"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                required
                placeholder="(00) 00000-0000"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                placeholder="joao@email.com"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Salvar Inquilino
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
