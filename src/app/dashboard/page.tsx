import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const revalidate = 0; // Opt out of caching for this page

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Buscar propriedades e inquilinos associados (buscando o tenant atual)
  const { data: properties, error } = await supabase
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

  if (error) {
    console.error('Error fetching properties:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Meus Imóveis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie suas propriedades e inquilinos.</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Adicionar Imóvel
        </Link>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            // Se o status for ocupado, pegamos o inquilino mais recente
            const activeTenant = property.tenants && property.tenants.length > 0 
              ? property.tenants[property.tenants.length - 1] 
              : null;

            return (
              <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900 text-lg truncate pr-2" title={property.endereco}>
                      {property.endereco}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      property.status === 'ocupado' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {property.status === 'ocupado' ? 'Ocupado' : 'Vago'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Aluguel:</span>
                      <span className="font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor_aluguel)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vencimento:</span>
                      <span className="font-medium text-gray-900">Dia {property.dia_vencimento}</span>
                    </div>

                    {property.status === 'ocupado' && activeTenant && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Inquilino Atual</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={activeTenant.nome}>
                              {activeTenant.nome}
                            </p>
                            <p className="text-xs text-gray-500">{activeTenant.telefone}</p>
                            {activeTenant.punctuality_scores && activeTenant.punctuality_scores[0] && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  activeTenant.punctuality_scores[0].score_atual >= 80 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : activeTenant.punctuality_scores[0].score_atual >= 50 
                                      ? 'bg-amber-50 text-amber-700' 
                                      : 'bg-orange-50 text-orange-700'
                                }`}>
                                  Score: {Math.round(activeTenant.punctuality_scores[0].score_atual)}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  ({activeTenant.punctuality_scores[0].pagamentos_em_dia} em dia)
                                </span>
                              </div>
                            )}
                          </div>
                          <Link 
                            href={`/dashboard/tenants/${activeTenant.id}`}
                            className="text-xs text-teal-600 hover:text-teal-800 font-medium border border-gray-200 px-2 py-1 rounded"
                          >
                            Ver Perfil
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
                  <Link
                    href={`/dashboard/properties/${property.id}`}
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Editar Imóvel
                  </Link>
                  {property.status !== 'ocupado' && (
                    <Link
                      href={`/dashboard/tenants/new?property_id=${property.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      + Inquilino
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum imóvel</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece adicionando seu primeiro imóvel para gerenciar.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors bg-teal-600 hover:bg-teal-700 text-white"
            >
              Adicionar Imóvel
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
