"use client"

import { motion } from 'motion/react'
import { LogOut, Home, Copy, Wrench, Download, CreditCard, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface TenantData {
  name: string
  propertyAddress: string
  ownerName: string
}

interface CurrentInvoice {
  amount: number
  dueDate: string
  status: 'Late' | 'Pending'
  paymentLink?: string
}

interface TenantPortalProps {
  tenant: TenantData
  currentInvoice: CurrentInvoice | null
}

export function TenantPortalOverview({ tenant, currentInvoice }: TenantPortalProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  const copyPix = () => {
    // Simulando cópia de código PIX
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540510.005802BR5913Alugho Pagamentos6009Sao Paulo62070503***63041234")
    alert('Código PIX Copia e Cola gerado e copiado para a área de transferência!')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-slate-800 dark:text-gray-100 flex flex-col overflow-hidden transition-colors">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">Portal do Inquilino</span>
        </div>
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{tenant.name}</p>
               <p className="text-[10px] text-slate-400 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">Inquilino</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm shrink-0">
               {tenant.name.split(' ').map(n => n[0]).join('').substring(0,2)}
             </div>
           </div>
           <div className="w-px h-8 bg-slate-200 dark:bg-gray-700 hidden sm:block"></div>
           <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 transition-colors p-2.5 cursor-pointer bg-slate-50 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl border border-slate-200 dark:border-gray-700">
             <LogOut className="w-4 h-4" />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 space-y-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Main Invoice Card */}
          <div className="flex-1 bg-emerald-700 rounded-[1.75rem] p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${currentInvoice?.status === 'Late' ? 'bg-rose-500/30 text-rose-100 border border-rose-400/50' : 'bg-emerald-950/30 text-emerald-100 border border-emerald-400/20'}`}>
                  {currentInvoice ? (currentInvoice.status === 'Late' ? 'Fatura Atrasada' : 'Fatura Atual') : 'Tudo em Dia'}
                </span>
                
                <div className="mt-8 mb-10">
                  {currentInvoice ? (
                    <>
                      <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-wider mb-2">Vencimento em {currentInvoice.dueDate}</p>
                      <h2 className="text-5xl font-black tracking-tight">
                        R$ {Math.floor(currentInvoice.amount)}
                        <span className="text-2xl text-emerald-300">
                          ,{((currentInvoice.amount % 1) * 100).toFixed(0).padStart(2, '0')}
                        </span>
                      </h2>
                    </>
                  ) : (
                    <>
                       <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-wider mb-2">Nenhuma cobrança pendente</p>
                       <h2 className="text-3xl font-black tracking-tight">Obrigado pela pontualidade!</h2>
                    </>
                  )}
                </div>
              </div>

              {currentInvoice && (
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <a 
                    href={currentInvoice.paymentLink || '#'} 
                    target="_blank"
                    className="flex-1 bg-white text-emerald-900 hover:bg-slate-50 font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center transition-all shadow-xl cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                    Pagar Agora
                  </a>
                  <button onClick={copyPix} className="flex-1 bg-emerald-800/40 hover:bg-emerald-800/60 backdrop-blur-md text-white font-bold text-sm py-4 px-6 rounded-2xl flex items-center justify-center transition-all cursor-pointer">
                    <Copy className="w-4 h-4 mr-2 opacity-70" />
                    Copiar Pix
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            <Link href="/portal/maintenance" className="h-full">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white dark:bg-gray-800 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 dark:border-gray-700 flex items-center justify-between group cursor-pointer h-full transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Manutenção</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mt-1">Abrir chamado</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-gray-600 group-hover:text-amber-500 transition-colors" />
              </motion.div>
            </Link>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('Download do contrato em breve!')}
              className="w-full bg-white dark:bg-gray-800 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 dark:border-gray-700 flex items-center justify-between group cursor-pointer h-full transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 rounded-2xl flex items-center justify-center shadow-inner">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Contrato</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mt-1">Baixar PDF</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 dark:text-gray-600 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* Property Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-[1.75rem] p-6 md:p-8 shadow-sm border border-slate-200 dark:border-gray-700 transition-colors"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Meu Imóvel</h3>
          <div className="flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-72 h-48 rounded-3xl overflow-hidden shrink-0 border border-slate-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" alt="Apartment" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 flex flex-col justify-center">
                <div className="mb-6">
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mb-1.5">Endereço</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{tenant.propertyAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-gray-700">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mb-1.5">Vigência (Aprox)</p>
                    <p className="font-bold text-slate-800 dark:text-gray-300 text-sm">12 meses</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mb-1.5">Locador</p>
                    <p className="font-bold text-slate-800 dark:text-gray-300 text-sm">{tenant.ownerName}</p>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
