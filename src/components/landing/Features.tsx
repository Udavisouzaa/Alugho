"use client";
import { 
  MessageSquareWarning, 
  Clock, 
  Sparkles,
  Home,
  FileText,
  UserPlus,
  BadgeDollarSign,
  PieChart,
  CheckCircle2,
  XCircle
} from "lucide-react";

export function Features() {
  return (
    <>
      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Gerenciar aluguéis sozinho não precisa ser estressante
            </h2>
            <p className="text-lg text-slate-600">
              Muitos proprietários independentes perdem dinheiro com imobiliárias ou perdem a paz gerenciando tudo manualmente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center">
              <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquareWarning className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Cobrança manual desgastante</h3>
              <p className="text-slate-600 leading-relaxed">
                Lembrar inquilinos no WhatsApp, conferir Pix na conta física e cobrar atrasos gera desgaste na relação e estresse desnecessário.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center">
              <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">A gestão consome seu tempo</h3>
              <p className="text-slate-600 leading-relaxed">
                Controlar vencimentos em planilhas desatualizadas e organizar pedidos de manutenção pelo celular tira o seu foco.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(15,23,42,0.2)] border border-slate-800 text-white flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">O Alugho organiza tudo</h3>
                <p className="text-slate-300 leading-relaxed">
                  Automatize o processo chato. Tenha extratos claros, cobranças automáticas e histórico impecável pagando apenas uma mensalidade fixa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Como o Alugho funciona</h2>
            <p className="text-lg text-slate-600">Em 5 passos simples, você automatiza a gestão dos seus imóveis.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-600 font-black text-3xl mb-3">01</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-3">Cadastre Imóvel</div>
              <p className="text-sm text-slate-600">Adicione os dados básicos da propriedade.</p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-600 font-black text-3xl mb-3">02</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-3">Cadastre Contrato</div>
              <p className="text-sm text-slate-600">Defina valor e índice de reajuste.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-600 font-black text-3xl mb-3">03</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-3">Convide Inquilino</div>
              <p className="text-sm text-slate-600">O inquilino recebe acesso à área.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-600 font-black text-3xl mb-3">04</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-3">Cobrança Auto</div>
              <p className="text-sm text-slate-600">Lembretes via WhatsApp/E-mail.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-600 font-black text-3xl mb-3">05</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-3">Acompanhe Tudo</div>
              <p className="text-sm text-slate-600">Extratos, chamados e pontualidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scope Section (O que faz / não faz) */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              Transparência total sobre o nosso papel
            </h2>
            <p className="text-lg text-slate-600">
              O Alugho é a ferramenta definitiva para quem já tem o inquilino e quer profissionalizar a gestão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                O que o Alugho faz
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Cobrança automática de aluguel e encargos
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Lembretes amigáveis via WhatsApp e E-mail
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Extratos financeiros organizados e fáceis de ler
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Central de chamados para manutenção
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Alugho Score de Pontualidade do inquilino
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Área exclusiva para o inquilino acessar faturas
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-slate-500" />
                </div>
                O que NÃO fazemos
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-bold">✕</div>
                  Captação ou anúncio de imóveis
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-bold">✕</div>
                  Análise de crédito para novos inquilinos
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-bold">✕</div>
                  Elaboração jurídica de contratos de locação
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-bold">✕</div>
                  Vistorias presenciais de entrada ou saída
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-bold">✕</div>
                  Intermediação de despejo ou cobrança judicial
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
