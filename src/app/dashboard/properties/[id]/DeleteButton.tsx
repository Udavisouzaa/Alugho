'use client'

import { deleteProperty } from '../actions'

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel? Todos os inquilinos, faturas e manutenções vinculados também serão excluídos permanentemente.')) {
      deleteProperty(id)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
    >
      Excluir Imóvel
    </button>
  )
}
