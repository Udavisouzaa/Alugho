'use client'

export function QuickLoginLocador() {
  const handleQuickLogin = (email: string, pass: string, e: React.MouseEvent) => {
    const form = (e.target as HTMLElement).closest('form')
    if (form) {
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      const passInput = form.elements.namedItem('password') as HTMLInputElement
      if (emailInput && passInput) {
        emailInput.value = email
        passInput.value = pass
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
      <p className="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wider">Acesso Rápido de Teste</p>
      <div className="grid grid-cols-2 gap-2">
        <button 
          type="button"
          onClick={(e) => handleQuickLogin('admin1@rentpay.com', 'Senha454*', e)}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-2 rounded transition-colors cursor-pointer"
        >
          Locador 1 (Davi)
        </button>
        <button 
          type="button"
          onClick={(e) => handleQuickLogin('admin2@rentpay.com', 'admin2', e)}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-2 rounded transition-colors cursor-pointer"
        >
          Locador 2 (Sócio)
        </button>
      </div>
    </div>
  )
}
