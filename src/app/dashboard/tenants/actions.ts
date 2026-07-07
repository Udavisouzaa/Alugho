'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { resend } from '@/lib/resend'

export async function createTenant(formData: FormData) {
  // Precisamos do Service Role Key para criar usuários no Auth sem estar logado como eles
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const supabase = await createClient()

  const property_id = formData.get('property_id') as string
  const email = formData.get('email') as string
  const nome = formData.get('nome') as string

  // Verifica se a propriedade existe
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('status, endereco')
    .eq('id', property_id)
    .single()

  if (propError || !property) {
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=Imóvel não encontrado.`)
  }

  if (property.status === 'ocupado') {
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=Este imóvel já possui um inquilino ativo.`)
  }

  // 1. Gerar senha temporária
  const tempPassword = `Alugho@${Math.floor(1000 + Math.random() * 9000)}`

  // 2. Criar usuário no Supabase Auth usando Admin API
  let authUserId = null;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { role: 'tenant', nome: nome }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      redirect(`/dashboard/tenants/new?property_id=${property_id}&error=Falha ao criar credenciais de acesso.`)
    }
    authUserId = authData.user.id
  }

  // 3. Inserir Inquilino no banco de dados (pode ser amarrado ao authUserId futuramente)
  const tenantData = {
    property_id,
    nome: nome,
    cpf: (formData.get('cpf') as string).replace(/\D/g, ''),
    email: email,
    telefone: (formData.get('telefone') as string).replace(/\D/g, ''),
    data_inicio_contrato: formData.get('data_inicio_contrato') as string,
    // auth_id: authUserId // ideal se a tabela tivesse essa coluna, mas vamos manter simples pro MVP
  }

  const { error } = await supabase.from('tenants').insert(tenantData)

  if (error) {
    console.error('Error creating tenant:', error)
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=${encodeURIComponent(error.message)}`)
  }

  // Atualizar o status do imóvel para ocupado
  await supabase
    .from('properties')
    .update({ status: 'ocupado' })
    .eq('id', property_id)

  // 4. Enviar E-mail de Boas-vindas (Onboarding)
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Alugho <onboarding@resend.dev>',
        to: email,
        subject: 'Bem-vindo ao Portal do Inquilino - Alugho',
        html: `
          <h2>Olá, ${nome}!</h2>
          <p>Seu locador acabou de te adicionar ao imóvel <strong>${property.endereco}</strong> através do <strong>Alugho</strong>.</p>
          <p>No seu Portal do Inquilino você poderá acompanhar suas faturas, ver seu Score de Pontualidade e abrir chamados de manutenção.</p>
          <br/>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
            <p style="margin-top:0;"><strong>Acesso ao Portal:</strong> <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/login">Clique aqui</a></p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p style="margin-bottom:0;"><strong>Senha temporária:</strong> ${tempPassword}</p>
          </div>
          <br/>
          <p>Recomendamos que você anote esta senha.</p>
        `
      })
    } catch (e) {
      console.error('Erro ao enviar onboarding:', e)
    }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=true&message=Inquilino cadastrado com acesso enviado por e-mail!')
}

export async function updateTenant(id: string, formData: FormData) {
  const supabase = await createClient()

  const tenantData = {
    nome: formData.get('nome') as string,
    cpf: (formData.get('cpf') as string).replace(/\D/g, ''),
    email: formData.get('email') as string,
    telefone: (formData.get('telefone') as string).replace(/\D/g, ''),
    data_inicio_contrato: formData.get('data_inicio_contrato') as string,
  }

  const { error } = await supabase
    .from('tenants')
    .update(tenantData)
    .eq('id', id)

  if (error) {
    console.error('Error updating tenant:', error)
    redirect(`/dashboard/tenants/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=true&message=Inquilino atualizado com sucesso!')
}

export async function deleteTenant(id: string, property_id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tenant:', error)
    throw new Error(error.message)
  }

  // Atualizar o status do imóvel de volta para disponivel
  await supabase
    .from('properties')
    .update({ status: 'disponivel' })
    .eq('id', property_id)

  revalidatePath('/dashboard')
  redirect('/dashboard?success=true&message=Inquilino removido com sucesso!')
}
