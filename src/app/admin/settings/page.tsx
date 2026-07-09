import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Save } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-slate-500 mt-1">Preferências do sistema e integrações.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-8 text-center text-slate-500">
        <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-700 mb-2">Configurações do Painel</h3>
        <p>Ajustes globais em breve.</p>
      </div>
    </div>
  )
}
