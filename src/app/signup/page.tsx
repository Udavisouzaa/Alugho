import Link from 'next/link'
import { signup } from './actions'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen bg-gray-50">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Voltar
      </Link>

      <div className="absolute right-8 top-8">
        <ThemeToggle />
      </div>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signup}
      >
        <div className="flex flex-col mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            RentPay
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Crie sua conta para começar a gerenciar aluguéis com facilidade.
          </p>
        </div>

        <label className="text-md font-medium text-gray-700" htmlFor="name">
          Nome Completo
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          name="name"
          placeholder="Seu nome"
          required
        />

        <label className="text-md font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          name="email"
          placeholder="voce@exemplo.com"
          required
        />

        <label className="text-md font-medium text-gray-700" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md px-4 py-3 text-foreground font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
          Criar Conta
        </button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-50 text-red-600 text-center text-sm rounded-md border border-red-200">
            {searchParams.message}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Faça login
          </Link>
        </div>
      </form>
    </div>
  )
}
