import { createClient } from '@supabase/supabase-js'

// Cliente Supabase exclusivo para rotas de Admin.
// Ele usa a Service Role Key para ignorar as políticas de RLS e acessar todos os dados da plataforma.
// ATENÇÃO: NUNCA use este cliente em componentes Client-side ou exponha ao usuário comum.
export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('As variáveis de ambiente do Supabase (URL ou Service Role Key) estão faltando.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
