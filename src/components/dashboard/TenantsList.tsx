"use client"

import { motion } from 'motion/react'
import { Search, Filter, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface Tenant {
  id: string
  name: string
  propertyAddress: string
  paymentStatus: 'On Time' | 'Late'
  score: number
  avatar: string
}

export function TenantsList({ tenants }: { tenants: Tenant[] }) {
  return (
    <div className="space-y-8 flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inquilinos</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm font-medium">Acompanhe o status e histórico de pagamentos.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[1.75rem] shadow-[var(--shadow-sm)] border border-slate-200/80 dark:border-gray-700 overflow-hidden flex flex-col flex-1 min-h-0 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-slate-50 dark:bg-gray-900 rounded-2xl px-4 py-2.5 w-full sm:w-80 border border-slate-200/60 dark:border-gray-700">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar inquilino..." 
              className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <button className="flex items-center space-x-2 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-gray-600">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtrar</span>
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Inquilino</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Imóvel</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Score</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-slate-400">Nenhum inquilino encontrado.</td>
                </tr>
              )}
              {tenants.map((tenant, i) => (
                <motion.tr 
                  key={tenant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-gray-700/30 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-200 dark:bg-gray-600 flex items-center justify-center font-bold text-xs text-slate-500 dark:text-gray-300">
                        {tenant.avatar ? <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" /> : tenant.name[0]}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500 dark:text-gray-400">{tenant.propertyAddress}</td>
                  <td className="py-4 px-6">
                    <Badge tone={tenant.paymentStatus === 'On Time' ? 'emerald' : 'rose'}>
                      {tenant.paymentStatus === 'On Time' ? 'Em dia' : 'Atrasado'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-full max-w-[80px] bg-slate-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${tenant.score >= 90 ? 'bg-emerald-500' : tenant.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${tenant.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white w-8">{tenant.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
