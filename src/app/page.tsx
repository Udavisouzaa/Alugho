import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alugho — Gestão de Aluguel Simplificada',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="px-6 py-6 flex items-center">
        <span className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-500">
          Alugho
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-50">
            Cobrança de aluguel automática, sem taxa de imobiliária.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
            Assinatura fixa mensal, R$39,90 a R$59,90 por imóvel.
          </p>
          <a
            href="https://wa.me/5548992084726?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20o%20Alugho"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            Falar no WhatsApp
          </a>
        </div>
      </main>
    </div>
  )
}
