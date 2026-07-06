'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { resend } from '@/lib/resend'

export async function createMaintenanceRequest(formData: FormData) {
  const supabase = await createClient()

  // Buscar usuário logado e garantir que é um inquilino
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/portal/login')
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, property_id, nome')
    .single()

  if (!tenant) {
    throw new Error('Acesso negado: Inquilino não encontrado.')
  }

  const descricao = formData.get('descricao') as string
  const fotoFile = formData.get('foto') as File

  let fotoUrl = null

  // 1. Fazer upload da foto se existir
  if (fotoFile && fotoFile.size > 0) {
    const fileExt = fotoFile.name.split('.').pop()
    const fileName = `${tenant.id}-${Date.now()}.${fileExt}`
    
    // Convertemos para ArrayBuffer para envio
    const arrayBuffer = await fotoFile.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('maintenance_photos')
      .upload(fileName, buffer, {
        contentType: fotoFile.type,
      })

    if (uploadError) {
      console.error('Erro no upload da foto:', uploadError)
      throw new Error('Não foi possível enviar a foto. Tente novamente.')
    }

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from('maintenance_photos')
      .getPublicUrl(fileName)

    fotoUrl = publicUrlData.publicUrl
  }

  // 2. Salvar o chamado no banco
  const { error: insertError } = await supabase
    .from('maintenance_requests')
    .insert({
      tenant_id: tenant.id,
      property_id: tenant.property_id,
      descricao: descricao,
      status: 'aberto',
      foto_url: fotoUrl
    })

  if (insertError) {
    console.error('Erro ao salvar chamado:', insertError)
    throw new Error('Erro interno ao abrir o chamado.')
  }

  // 3. Notificar Locador (Simulação de Envio de E-mail)
  try {
    // Buscamos o locador pela propriedade
    const { data: property } = await supabase
      .from('properties')
      .select('users(email)')
      .eq('id', tenant.property_id)
      .single()

    const landlordEmail = (property?.users as any)?.email

    if (process.env.RESEND_API_KEY && landlordEmail) {
      await resend.emails.send({
        from: 'RentPay <onboarding@resend.dev>',
        to: landlordEmail,
        subject: `Novo Chamado de Manutenção de ${tenant.nome}`,
        html: `
          <h3>Novo Chamado Recebido</h3>
          <p>O inquilino <strong>${tenant.nome}</strong> abriu um chamado de manutenção.</p>
          <p><strong>Descrição:</strong> ${descricao}</p>
          <p>Acesse seu painel para mais detalhes e ver fotos (se aplicável).</p>
        `
      })
    }
  } catch (emailErr) {
    console.log('Aviso: falha ao enviar notificação de e-mail ao locador', emailErr)
  }

  revalidatePath('/portal/maintenance')
  redirect('/portal/maintenance')
}
