'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: formData.get('name') as string,
        whatsapp: formData.get('whatsapp') as string,
      },
    },
  }

  // Cria a conta
  const { error: signUpError } = await supabase.auth.signUp(data)

  if (signUpError) {
    console.error('Signup error:', signUpError.message)
    redirect(`/signup?message=${encodeURIComponent(signUpError.message)}`)
  }

  // Tenta logar automaticamente (Fricção Zero)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // Se falhar o auto-login (provavelmente porque requer confirmação de e-mail no painel do Supabase)
    redirect(`/signup?message=${encodeURIComponent('Conta criada! Por favor, verifique seu e-mail para confirmar.')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
