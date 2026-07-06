import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateProperty } from '../actions'
import DeleteButton from './DeleteButton'

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  const supabase = await createClient()

  // Fetch the property
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    redirect('/dashboard')
  }

  // Bind the action to pass the ID
  const updateAction = updateProperty.bind(null, params.id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 inline-block">
            &larr; Voltar para Dashboard
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">Editar Imóvel</h2>
          <p className="text-sm text-gray-500 mt-1">Atualize os dados da propriedade.</p>
        </div>
        <DeleteButton id={params.id} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {searchParams.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {searchParams.error}
          </div>
        )}

        <form action={updateAction} className="space-y-6">
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              name="endereco"
              id="endereco"
              defaultValue={property.endereco}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="valor_aluguel" className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Aluguel (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="valor_aluguel"
                id="valor_aluguel"
                defaultValue={property.valor_aluguel}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="dia_vencimento" className="block text-sm font-medium text-gray-700 mb-1">
                Dia de Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                name="dia_vencimento"
                id="dia_vencimento"
                defaultValue={property.dia_vencimento}
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
