import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { Users, Search, MoreVertical } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const adminDb = createAdminClient()
  
  // Buscar os usuários reais do Auth (só funciona com a Service Role Key)
  const { data: authData } = await adminDb.auth.admin.listUsers()
  const users = authData?.users || []
  
  // Buscar todas as propriedades para contar quantos imóveis cada usuário tem
  const { data: properties } = await adminDb
    .from('properties')
    .select('owner_id')
    
  // Contar imóveis por owner_id
  const ownerCounts: Record<string, number> = {}
  if (properties) {
    properties.forEach(p => {
      ownerCounts[p.owner_id] = (ownerCounts[p.owner_id] || 0) + 1
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Locadores</h1>
          <p className="text-slate-500 mt-1">Gerencie os proprietários cadastrados na plataforma.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Buscar por e-mail ou nome..."
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-700">Todos os Locadores ({users.length} detectados)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Locador (E-mail)</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Imóveis</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Plano</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contato (WhatsApp)</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                // Tenta pegar o whatsapp do user_metadata se estiver salvo no signup
                const whatsapp = user.user_metadata?.whatsapp || '5548992084726'
                
                return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {user.email?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{user.email}</div>
                        <div className="text-xs text-slate-500 truncate">Membro desde: {new Date(user.created_at).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                      {ownerCounts[user.id] || 0}
                    </span>
                  </td>
                  <td className="p-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Controle
                    </span>
                  </td>
                  <td className="p-4 px-6">
                    <a 
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20boas-vindas%20%C3%A0%20Alugho!`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors border border-emerald-200 hover:border-emerald-600"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Mensagem
                    </a>
                  </td>
                  <td className="p-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Ativo
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )})}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    Nenhum locador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
