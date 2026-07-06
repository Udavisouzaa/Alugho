'use client'

import { deleteTenant } from '../actions'

export default function DeleteButton({ id, propertyId }: { id: string, propertyId: string }) {
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este inquilino? Ele será removido permanentemente e o imóvel voltará a ficar "Vago".')) {
      deleteTenant(id, propertyId)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
    >
      Remover Inquilino
    </button>
  )
}
