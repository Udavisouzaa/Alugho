"use client"

import { motion } from 'motion/react'
import { Building2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signup } from '@/app/signup/actions'

export function SignupForm({ searchParams }: { searchParams?: { message?: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 relative z-10 my-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Crie sua Conta</h1>
          <p className="text-slate-500 text-sm font-medium mt-2 text-center">Comece a gerenciar seus imóveis de forma inteligente.</p>
        </div>

        <form className="space-y-5" action={signup} onSubmit={() => setLoading(true)}>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nome Completo</label>
            <input 
              type="text"
              name="name"
              placeholder="Ex: Carlos Eduardo"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-slate-50 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">WhatsApp</label>
            <input 
              type="tel"
              name="whatsapp"
              placeholder="(11) 99999-9999"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-slate-50 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">E-mail</label>
            <input 
              type="email"
              name="email"
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-slate-50 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Senha</label>
            <input 
              type="password"
              name="password"
              placeholder="No mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-slate-50 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          
          {searchParams?.message && (
            <div className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
              {searchParams.message}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center group cursor-pointer mt-8"
          >
            {loading ? 'Criando Conta...' : 'Criar Minha Conta'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Já tem uma conta?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all cursor-pointer"
            >
              Entrar aqui
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
