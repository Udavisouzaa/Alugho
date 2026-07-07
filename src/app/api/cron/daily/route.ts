import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPayment } from '@/lib/stripe'
import { resend } from '@/lib/resend'
import { updateTenantScore } from '@/lib/scoreUpdater'

// Usamos a Service Role Key para o Cron, pois ele roda no backend sem usuário logado
// e precisa bypassar o RLS para ler propriedades de todos os usuários.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    // PROTEÇÃO: Em produção, você verificaria um header de autorização (ex: Bearer token do Vercel Cron)
    const url = new URL(request.url)
    const authHeader = request.headers.get('authorization')
    const isTest = url.searchParams.get('test') === 'true'
    
    if (process.env.NODE_ENV === 'production' && !isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const today = new Date()
    const mesReferencia = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    // 1. Marcar faturas atrasadas
    const { data: updatedInvoices, error: overdueError } = await supabase
      .from('invoices')
      .update({ status: 'atrasado' })
      .eq('status', 'pendente')
      .lt('data_vencimento', today.toISOString().split('T')[0])
      .select('tenant_id')
    
    if (overdueError) console.error('Erro ao atualizar atrasados:', overdueError)

    // Recalcular score para os inquilinos que tiveram faturas atrasadas hoje
    if (updatedInvoices && updatedInvoices.length > 0) {
      const affectedTenantIds = Array.from(new Set(updatedInvoices.map(i => i.tenant_id)))
      for (const tenantId of affectedTenantIds) {
        // Disparando em background (assíncrono sem await para não travar o cron)
        updateTenantScore(tenantId).catch(console.error)
      }
    }

    // 2. Buscar imóveis ocupados
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*, tenants(*)')
      .eq('status', 'ocupado')

    if (propsError || !properties) throw new Error('Erro ao buscar imóveis')

    let faturasGeradas = 0

    // 3. Para cada imóvel, checar se a fatura do mês já existe
    for (const property of properties) {
      if (!property.tenants || property.tenants.length === 0) continue
      
      const activeTenant = property.tenants[property.tenants.length - 1]

      // Checar se já existe fatura
      const { data: existingInvoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('property_id', property.id)
        .eq('tenant_id', activeTenant.id)
        .eq('mes_referencia', mesReferencia)
        .single()

      if (!existingInvoice) {
        // Criar Fatura
        const dueDate = new Date(today.getFullYear(), today.getMonth(), property.dia_vencimento)
        
        // Se a data de vencimento for menor que hoje + 2 dias, ajustamos para dar tempo de pagar
        if (dueDate <= new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)) {
          dueDate.setDate(today.getDate() + 3)
        }

        const dueDateString = dueDate.toISOString().split('T')[0]

        // a) Gerar no Stripe
        let paymentLink = ''
        let paymentId = ''
        try {
          if (process.env.STRIPE_SECRET_KEY) {
            const payment = await createPayment(
              activeTenant.email || 'contato@rentpay.com', 
              property.valor_aluguel, 
              `Aluguel - ${property.endereco} (${mesReferencia})`
            )
            paymentId = payment.id
            paymentLink = payment.invoiceUrl
          }
        } catch (e) {
          console.error(`Erro na integração Stripe para imóvel ${property.id}:`, e)
          // Continua para criar no nosso banco mesmo sem gateway
        }

        // b) Salvar no Supabase
        const { error: insertError } = await supabase
          .from('invoices')
          .insert({
            tenant_id: activeTenant.id,
            property_id: property.id,
            mes_referencia: mesReferencia,
            valor: property.valor_aluguel,
            status: 'pendente',
            data_vencimento: dueDateString,
            gateway_id: paymentId,
            payment_link: paymentLink
          })

        if (!insertError) {
          faturasGeradas++
          
          // c) Enviar E-mail via Resend (Simulação)
          if (process.env.RESEND_API_KEY && activeTenant.email) {
            await resend.emails.send({
              from: 'RentPay <onboarding@resend.dev>', // Domínio de teste do Resend
              to: activeTenant.email,
              subject: `Sua fatura de aluguel (${mesReferencia}) está disponível`,
              html: `
                <h2>Olá, ${activeTenant.nome}</h2>
                <p>A fatura do seu aluguel no valor de <strong>R$ ${property.valor_aluguel}</strong> já foi gerada.</p>
                <p>Vencimento: ${dueDate.toLocaleDateString('pt-BR')}</p>
                <p><a href="${paymentLink || '#'}">Clique aqui para ver a sua fatura</a></p>
              `
            })
          }
        } else {
          console.error('Erro ao inserir fatura no banco:', insertError)
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron executado com sucesso. ${faturasGeradas} faturas geradas.`
    })
  } catch (error: any) {
    console.error('CRON Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
