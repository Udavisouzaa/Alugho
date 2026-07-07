'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { resend } from '@/lib/resend'

export async function updateRequestStatus(id: string, newStatus: string) {
  const supabase = await createClient()

  const { data: request, error: fetchError } = await supabase
    .from('maintenance_requests')
    .select('*, tenants(email, nome)')
    .eq('id', id)
    .single()

  if (fetchError || !request) {
    throw new Error('Chamado não encontrado ou sem permissão.')
  }

  const { error: updateError } = await supabase
    .from('maintenance_requests')
    .update({ status: newStatus })
    .eq('id', id)

  if (updateError) {
    throw new Error('Erro ao atualizar chamado.')
  }

  // Se o status mudou para resolvido, notificamos o inquilino
  if (newStatus === 'resolvido') {
    const tenantEmail = request.tenants?.email
    const tenantNome = request.tenants?.nome

    if (process.env.RESEND_API_KEY && tenantEmail) {
      try {
        await resend.emails.send({
          from: 'Alugho <onboarding@resend.dev>',
          to: tenantEmail,
          subject: `Seu chamado de manutenção foi resolvido!`,
          html: `
            <h3>Olá, ${tenantNome}</h3>
            <p>Seu locador acaba de marcar o chamado de manutenção como <strong>Resolvido</strong>.</p>
            <p><strong>Descrição original:</strong> ${request.descricao}</p>
            <p>Obrigado por utilizar o Portal do Inquilino Alugho.</p>
          `
        })
      } catch (err) {
        console.log('Falha ao notificar inquilino sobre resolução:', err)
      }
    }
  }

  revalidatePath('/dashboard/maintenance')
}
