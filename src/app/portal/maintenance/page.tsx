import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createMaintenanceRequest } from './actions'

export const revalidate = 0;

export default async function TenantMaintenancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: tenant } = await supabase.from('tenants').select('id, property_id').single()
  
  if (!tenant) redirect('/portal/login')

  const { data: requests } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Manutenção</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Solicite reparos e acompanhe seus chamados.
          </p>
        </div>
        <Link href="/portal" className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
          Voltar à Home
        </Link>
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Abrir Novo Chamado</h2>
        <form action={createMaintenanceRequest} className="space-y-4">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descreva o problema
            </label>
            <textarea
              id="descricao"
              name="descricao"
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm text-gray-900 dark:text-white transition-colors"
              placeholder="Ex: O cano da pia da cozinha quebrou e está vazando muita água..."
            />
          </div>
          
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Anexar Foto (Opcional)
            </label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-teal-50 file:text-teal-700
                hover:file:bg-teal-100 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Enviar Solicitação
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Meus Chamados</h2>
        
        {requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                {req.foto_url && (
                  <div className="flex-shrink-0">
                    <img src={req.foto_url} alt="Foto do problema" className="h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${getStatusColor(req.status)}`}>
                      {getStatusText(req.status)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">{req.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum chamado aberto.</p>
        )}
      </section>
    </div>
  )
}
