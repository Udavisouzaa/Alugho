"use client";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";

export function LandingLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 selection:bg-emerald-200 selection:text-slate-900 flex flex-col relative">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">a</div>
              <span className="text-xl font-bold tracking-tight text-slate-900">alugho</span>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Como funciona</a>
              <a href="#comparativo" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Comparativo</a>
              <a href="#planos" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Planos</a>
              <a href="#teste-agora" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
                Quero testar o Alugho
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">Como funciona</a>
            <a href="#comparativo" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">Comparativo</a>
            <a href="#planos" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">Planos</a>
            <a href="#teste-agora" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 bg-emerald-600 text-white text-center text-sm font-bold rounded-full shadow-lg shadow-emerald-600/20">
              Quero testar o Alugho
            </a>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <a
        href="https://wa.me/5511999999999?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Alugho"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center animate-pulse"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 fill-current"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.062-.301-.15-1.265-.464-2.409-1.484-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.098-.202.049-.384-.025-.536-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.273-.21-.57-.36zM12.002 22b-1.71 0-3.374-.46-4.839-1.32l-5.36 1.41 1.44-5.23A9.957 9.957 0 012 12c0-5.52 4.48-10 10.002-10 5.52 0 10.001 4.48 10.001 10s-4.481 10-10.001 10z"></path></svg>
      </a>

      <footer className="bg-white border-t border-slate-200 py-6 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Notificações via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Score de Pontualidade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Gestão 100% Online</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium text-center md:text-right">
              © {new Date().getFullYear()} Alugho Tecnologias LTDA. Sem fidelidade. Cancele quando quiser.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
