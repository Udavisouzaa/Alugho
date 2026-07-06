import { createClient } from '@/utils/supabase/server'
import { updateRequestStatus } from './actions'

export const revalidate = 0;

export default async function DashboardMaintenancePage() {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      properties (endereco),
      tenants (nome)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar chamados:', error)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'aberto': return 'bg-orange-50 text-orange-700'
      case 'andamento': return 'bg-amber-50 text-amber-700'
      case 'resolvido': return 'bg-emerald-50 text-emerald-700'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'aberto': return 'Aberto'
      case 'andamento': return 'Em Andamento'
      case 'resolvido': return 'Resolvido'
      default: return status
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Chamados de Manutenção</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as solicitações de reparo dos seus inquilinos.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {requests && requests.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map(req => (
              <li key={req.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {req.foto_url && (
                    <div className="flex-shrink-0">
                      <a href={req.foto_url} target="_blank" rel="noreferrer">
                        <img 
                          src={req.foto_url} 
                          alt="Foto do reparo" 
                          className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Inquilino: {req.tenants?.nome || 'Desconhecido'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Imóvel: {req.properties?.endereco || 'Desconhecido'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${getStatusColor(req.status)}`}>
                          {getStatusText(req.status)}
                        </span>
                        
                        <form action={async () => {
                          'use server'
                          const nextStatus = req.status === 'aberto' ? 'andamento' : req.status === 'andamento' ? 'resolvido' : 'aberto'
                          const { updateRequestStatus } = await import('./actions')
                          await updateRequestStatus(req.id, nextStatus)
                        }}>
                          <button 
                            type="submit"
                            className="text-xs font-medium text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                          >
                            {req.status === 'aberto' ? 'Mover para Andamento' : req.status === 'andamento' ? 'Marcar como Resolvido' : 'Reabrir Chamado'}
                          </button>
                        </form>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {req.descricao}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Aberto em: {new Date(req.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum chamado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Seus inquilinos ainda não relataram problemas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
