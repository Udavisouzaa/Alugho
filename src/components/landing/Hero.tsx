"use client";
import { CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-slate-50 pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-slate-50 to-slate-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Column: Copy */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-8 shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              O 1º ASSISTENTE DE GESTÃO PARA PROPRIETÁRIOS
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Administre seus aluguéis <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">sem pagar 10%</span> todo mês.
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              O Alugho envia cobranças, lembretes, confirma pagamentos, organiza extratos e centraliza chamados de manutenção entre proprietário e inquilino.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <a href="/signup" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-[0_8px_30px_rgb(15,23,42,0.2)] hover:shadow-[0_8px_30px_rgb(15,23,42,0.3)] hover:-translate-y-1 flex items-center justify-center">
                Comece grátis agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <div className="text-xs font-semibold text-slate-500 flex flex-col items-start gap-2 uppercase tracking-wider">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Mensalidade fixa</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Sem percentual</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 1º mês grátis</span>
              </div>
            </div>
          </div>

          {/* Right Column: iPhone Mockup */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-[320px]">
            {/* Background blob for iPhone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-400/20 blur-3xl rounded-full"></div>
            
            {/* iPhone Mockup Frame */}
            <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl border border-slate-800/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Screen */}
              <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden relative h-[620px] flex flex-col border border-slate-200">
                {/* Notch / Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-full z-20 flex justify-end items-center pr-2">
                   <div className="w-2 h-2 bg-emerald-500/50 rounded-full mr-1"></div>
                </div>
                
                {/* WhatsApp Header Mockup */}
                <div className="bg-[#075e54] text-white px-4 pt-12 pb-3 flex items-center gap-3 shrink-0 relative z-10 shadow-sm">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">A</div>
                  <div>
                    <div className="font-bold text-base leading-tight">Alugho Assistente</div>
                    <div className="text-[11px] text-white/80">Conta comercial</div>
                  </div>
                </div>

                {/* Chat Background */}
                <div className="flex-1 bg-[#e5ddd5] p-4 flex flex-col gap-3 overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
                  
                  {/* Date badge */}
                  <div className="flex justify-center mb-2">
                    <span className="bg-white/80 backdrop-blur-sm text-slate-500 text-[10px] px-2 py-1 rounded-md shadow-sm">Hoje</span>
                  </div>

                  {/* Messages */}
                  <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm self-start relative">
                    <div className="text-xs text-slate-800 leading-relaxed">
                      🏠 Olá! O aluguel do inquilino <strong>João Silva</strong> (Apto 302) vence amanhã, dia 10.
                      <br/><br/>
                      A cobrança com o QR Code Pix já foi enviada para o WhatsApp dele! 🚀
                    </div>
                    <div className="text-[10px] text-slate-400 text-right mt-1">10:30</div>
                  </div>

                  <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none p-3 max-w-[85%] shadow-sm self-end relative">
                    <div className="text-xs text-slate-800 leading-relaxed">
                      Maravilha, obrigado!
                    </div>
                    <div className="text-[10px] text-emerald-600 text-right mt-1 flex justify-end gap-1 items-center">
                      10:32 <span className="text-blue-500 tracking-tighter">✓✓</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm self-start relative mt-2">
                    <div className="text-xs text-slate-800 leading-relaxed">
                      ✅ <strong>Pagamento Confirmado!</strong>
                      <br/>Valor: R$ 2.500,00
                      <br/>Imóvel: Apto 302
                      <br/><br/>O repasse já está na sua conta! O extrato mensal foi atualizado.
                    </div>
                    <div className="text-[10px] text-slate-400 text-right mt-1">14:15</div>
                  </div>
                  
                  <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm self-start relative mt-2">
                    <div className="text-xs text-slate-800 leading-relaxed">
                      ⚠️ <strong>Novo Chamado de Manutenção</strong>
                      <br/>O inquilino do Apto 302 relatou um vazamento na pia da cozinha.
                      <br/><br/>Acesse o painel para ver as fotos e aprovar o orçamento.
                    </div>
                    <div className="text-[10px] text-slate-400 text-right mt-1">16:45</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MacBook Mockup */}
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative rounded-t-3xl border-[12px] border-b-0 border-slate-800 bg-slate-800 aspect-[16/10] overflow-hidden shadow-2xl">
            {/* Screen Content - Dashboard Mockup */}
            <div className="absolute inset-0 bg-slate-50 flex flex-col">
              {/* Top Bar */}
              <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
                <div className="w-32 h-5 bg-slate-200 rounded-lg"></div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                  <div className="w-5 h-5 bg-emerald-100 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-slate-200 bg-white p-5 space-y-6 shrink-0 hidden sm:block">
                  <div className="h-2 w-full bg-emerald-100 rounded-full mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-4/6 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                
                {/* Main Area */}
                <div className="flex-1 p-8 flex flex-col gap-6 bg-slate-50/50">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Visão Geral</div>
                      <div className="h-3 w-48 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="h-10 w-32 bg-emerald-500 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="h-2 w-24 bg-slate-200 rounded-full mb-4"></div>
                      <div className="h-8 w-32 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="h-2 w-24 bg-slate-200 rounded-full mb-4"></div>
                      <div className="h-8 w-24 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="h-2 w-24 bg-slate-200 rounded-full mb-4"></div>
                      <div className="h-8 w-16 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-white flex-1 rounded-2xl border border-slate-200/60 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="h-3 w-40 bg-slate-200 rounded-full mb-8"></div>
                    <div className="space-y-5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center pb-5 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
                            <div>
                              <div className="h-2 w-32 bg-slate-300 rounded-full mb-3"></div>
                              <div className="h-2 w-48 bg-slate-200 rounded-full"></div>
                            </div>
                          </div>
                          <div className="h-3 w-20 bg-emerald-100 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* MacBook Base */}
          <div className="relative h-6 bg-slate-300 rounded-b-[2rem] mx-auto w-[105%] flex justify-center -translate-x-[2.5%] shadow-xl border-t border-slate-400">
             <div className="w-1/4 h-2 mt-1 bg-slate-400 rounded-b-xl opacity-50"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
