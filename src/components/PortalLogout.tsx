'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function PortalLogout() {
  const router = useRouter()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
    >
      Sair
    </button>
  )
}
