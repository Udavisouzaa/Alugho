import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    // Troca o código da URL por uma sessão de usuário válida no Supabase
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Após autenticar, redireciona o inquilino para a Home do Portal
  return NextResponse.redirect(new URL('/portal', request.url))
}
