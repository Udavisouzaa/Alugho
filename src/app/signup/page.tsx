import Link from 'next/link'
import { signup } from './actions'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center group text-sm font-medium transition-colors"
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
          <h1 className="text-3xl font-medium text-teal-600 dark:text-teal-400">
            Alugho
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Crie sua conta para começar a gerenciar aluguéis com facilidade.
          </p>
        </div>

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
          Nome Completo
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors shadow-sm sm:text-sm"
          name="name"
          placeholder="Seu nome"
          required
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors shadow-sm sm:text-sm"
          name="email"
          placeholder="voce@exemplo.com"
          required
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors shadow-sm sm:text-sm"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <button className="bg-teal-600 text-white rounded-md px-4 py-2.5 font-medium hover:bg-teal-700 transition-colors shadow-sm text-sm">
          Criar Conta
        </button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-orange-50 text-orange-700 text-center text-sm rounded-md border border-orange-200">
            {searchParams.message}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors">
            Faça login
          </Link>
        </div>
      </form>
    </div>
  )
}
