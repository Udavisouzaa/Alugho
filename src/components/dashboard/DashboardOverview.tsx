"use client"

import { motion } from 'motion/react'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'

interface Stat {
  title: string
  value: string
  trend: string
  isPositive: boolean
}

interface Invoice {
  id: string
  tenantName: string
  dueDate: string
  amount: number
  status: 'Late' | 'Pending' | 'Paid'
}

interface DashboardOverviewProps {
  stats: Stat[]
  invoices: Invoice[]
}

export function DashboardOverview({ stats, invoices }: DashboardOverviewProps) {
  return (
    <div className="space-y-8 flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Visão Geral</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm font-medium">Acompanhe o desempenho do seu portfólio.</p>
        </div>
        <Link 
          href="/dashboard/properties/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
        >
          + Novo Imóvel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} isPositive={stat.isPositive} delay={i * 0.1}>
            {i === 0 && (
              <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-600 rounded-full"></div>
              </div>
            )}
            {i === 1 && (
              <div className="mt-4 flex gap-1 h-1.5">
                <div className="flex-1 bg-emerald-500 rounded-full"></div>
                <div className="flex-1 bg-emerald-500 rounded-full"></div>
                <div className="flex-1 bg-emerald-500 rounded-full"></div>
                <div className="flex-1 bg-slate-100 dark:bg-gray-700 rounded-full"></div>
              </div>
            )}
            {i === 3 && (
               <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                 <div className="w-[8%] h-full bg-rose-500 rounded-full"></div>
               </div>
            )}
          </StatCard>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[500px] lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:w-[60%] flex flex-col min-h-[400px] lg:min-h-0"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Próximos Vencimentos
              <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-gray-700 text-slate-500 dark:text-gray-300 rounded text-[10px] font-black uppercase tracking-wider">{invoices.length} faturas</span>
            </h2>
            <Link href="/dashboard/invoices" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-all cursor-pointer uppercase tracking-wider">Ver todos</Link>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-[1.75rem] border border-slate-200/80 dark:border-gray-700 overflow-hidden flex flex-col shadow-[var(--shadow-sm)] transition-colors">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Inquilino</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Vencimento</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-700/50">
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">Nenhuma fatura pendente.</td>
                    </tr>
                  )}
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50/80 dark:hover:bg-gray-700/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-gray-600 border border-slate-200/50 dark:border-gray-600 transition-colors">
                            {invoice.tenantName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-white">{invoice.tenantName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-gray-400">{invoice.dueDate}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">R$ {invoice.amount.toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge tone={invoice.status === 'Late' ? 'rose' : 'amber'}>
                          {invoice.status === 'Late' ? 'Atrasado' : 'Pendente'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:w-[40%] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-bold text-slate-900 dark:text-white">Receita Anual</h2>
            <DollarSign className="w-4 h-4 text-slate-300 dark:text-gray-600" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-[1.75rem] p-6 border border-slate-200/80 dark:border-gray-700 flex-1 flex flex-col shadow-[var(--shadow-sm)] transition-colors">
             <div className="flex-1 w-full flex items-end justify-between gap-2 pb-4">
               {[40, 60, 45, 80, 55, 90, 75, 100, 85, 95, 70, 110].map((h, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: 0.5 + (i * 0.05), duration: 0.8 }}
                   className="w-full bg-emerald-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                 />
               ))}
             </div>
             <div className="w-full flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-500 mt-2 border-t border-slate-100 dark:border-gray-700 pt-4">
               <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
