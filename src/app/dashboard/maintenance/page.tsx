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

  const abertos = requests?.filter(r => r.status === 'aberto') || []
  const andamento = requests?.filter(r => r.status === 'andamento') || []
  const resolvidos = requests?.filter(r => r.status === 'resolvido') || []

  // Componente interno para renderizar a coluna
  const KanbanColumn = ({ title, items, emptyText, nextStatusAction }: { title: string, items: any[], emptyText: string, nextStatusAction: (currentStatus: string) => string }) => (
    <div className="flex flex-col bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {items.length > 0 ? (
          items.map(req => (
            <div key={req.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                  {getStatusText(req.status)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {new Date(req.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                {req.tenants?.nome || 'Desconhecido'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
                {req.properties?.endereco || 'Desconhecido'}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded text-xs">
                {req.descricao}
              </p>

              {req.foto_url && (
                <a href={req.foto_url} target="_blank" rel="noreferrer" className="block mb-3">
                  <div className="h-24 w-full rounded border border-gray-200 dark:border-gray-600 overflow-hidden relative group-hover:border-teal-500 transition-colors">
                    <img src={req.foto_url} alt="Foto" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-medium">Ver Foto</span>
                    </div>
                  </div>
                </a>
              )}

              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <form action={async () => {
                  'use server'
                  const nextStatus = nextStatusAction(req.status)
                  const { updateRequestStatus } = await import('./actions')
                  await updateRequestStatus(req.id, nextStatus)
                }}>
                  <button 
                    type="submit"
                    className="w-full py-1.5 px-3 rounded text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 transition-colors flex justify-center items-center gap-1"
                  >
                    {req.status === 'aberto' ? 'Mover p/ Andamento →' : req.status === 'andamento' ? 'Resolver Chamado ✓' : '← Reabrir'}
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center p-6 text-center text-sm text-gray-400 dark:text-gray-500 bg-transparent">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Chamados de Manutenção</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as solicitações de reparo dos seus inquilinos no formato Kanban.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
        <KanbanColumn 
          title="Abertos" 
          items={abertos} 
          emptyText="Nenhum chamado aberto. Tudo tranquilo!" 
          nextStatusAction={() => 'andamento'} 
        />
        <KanbanColumn 
          title="Em Andamento" 
          items={andamento} 
          emptyText="Nenhum reparo em andamento no momento." 
          nextStatusAction={() => 'resolvido'} 
        />
        <KanbanColumn 
          title="Resolvidos" 
          items={resolvidos} 
          emptyText="Sem histórico de chamados resolvidos." 
          nextStatusAction={() => 'aberto'} 
        />
      </div>
    </div>
  )
}
