"use client";

import React, { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { submitLead } from "@/app/actions/lead";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      properties: formData.get("properties") as string,
      city: formData.get("city") as string,
      currentMethod: formData.get("currentMethod") as string,
    };

    const result = await submitLead(data);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("idle");
      alert("Ocorreu um erro: " + result.error);
    }
  };

  return (
    <section id="teste-agora" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-5 h-full">
            <div className="md:col-span-2 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 tracking-tight">Pronto para simplificar?</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-10">
                  Deixe a cobrança e a burocracia com a gente e volte a focar no que realmente importa.
                </p>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-400 text-xs font-bold">✓</div>
                    Setup em menos de 5 minutos
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-400 text-xs font-bold">✓</div>
                    Suporte especializado
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-400 text-xs font-bold">✓</div>
                    Sem fidelidade
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-3 p-10">
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                    <Send className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Solicitação enviada!</h4>
                  <p className="text-slate-600 max-w-sm">
                    Nossa equipe entrará em contato via WhatsApp nas próximas horas para liberar o seu acesso.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-emerald-600 font-bold hover:text-emerald-700 hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome completo</label>
                      <input required type="text" id="name" name="name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" placeholder="Seu nome" />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                      <input required type="tel" id="whatsapp" name="whatsapp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" placeholder="(00) 00000-0000" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
                    <input required type="email" id="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" placeholder="seu@email.com" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="properties" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qtd. imóveis</label>
                      <select required id="properties" name="properties" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium appearance-none">
                        <option value="">Selecione...</option>
                        <option value="1-3">1 a 3 imóveis</option>
                        <option value="4-10">4 a 10 imóveis</option>
                        <option value="11+">Mais de 10 imóveis</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cidade / Estado</label>
                      <input required type="text" id="city" name="city" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" placeholder="Ex: São Paulo, SP" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="currentMethod" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Como administra hoje?</label>
                    <select required id="currentMethod" name="currentMethod" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium appearance-none">
                      <option value="">Selecione...</option>
                      <option value="manual">Manual (Planilha / Caderno)</option>
                      <option value="imobiliaria">Imobiliária tradicional</option>
                      <option value="outro">Outro sistema / app</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 mt-6 disabled:opacity-70 text-lg"
                  >
                    {status === "submitting" ? "Enviando..." : "Quero testar o Alugho"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
