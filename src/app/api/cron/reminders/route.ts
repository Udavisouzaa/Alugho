import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { resend } from '@/lib/resend'

// Usamos Service Role Key para ler todas as faturas do sistema bypassando RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const authHeader = request.headers.get('authorization')
    const isTest = url.searchParams.get('test') === 'true'
    
    if (process.env.NODE_ENV === 'production' && !isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        id, 
        valor, 
        data_vencimento, 
        status, 
        payment_link, 
        mes_referencia,
        tenants (nome, email)
      `)
      .in('status', ['pendente', 'atrasado'])

    if (error || !invoices) {
      throw new Error('Erro ao buscar faturas pendentes')
    }

    let emailsEnviados = 0

    // Data de hoje (ignorando horas)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const invoice of invoices) {
      const tenant = invoice.tenants
      if (!tenant || !tenant.email) continue

      const dueDate = new Date(invoice.data_vencimento + 'T00:00:00') // T00 para forçar fuso local/UTC seguro
      dueDate.setHours(0, 0, 0, 0)
      
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      let subject = ''
      let emailBody = ''
      let shouldSend = false

      if (invoice.status === 'pendente') {
        if (diffDays === 3) {
          // Vence em 3 dias
          shouldSend = true
          subject = 'Sua fatura do RentPay vence em 3 dias'
          emailBody = `
            <h3>Olá, ${tenant.nome}</h3>
            <p>Lembrete amigável: sua fatura de aluguel (${invoice.mes_referencia}) no valor de <strong>R$ ${invoice.valor}</strong> vence no dia <strong>${dueDate.toLocaleDateString('pt-BR')}</strong>.</p>
            <p>Mantenha seus pagamentos em dia para garantir um ótimo Score de Pontualidade!</p>
            <p><a href="${invoice.payment_link || '#'}">Clique aqui para pagar</a></p>
          `
        } else if (diffDays === 0) {
          // Vence Hoje
          shouldSend = true
          subject = 'Atenção: Sua fatura do RentPay vence HOJE'
          emailBody = `
            <h3>Olá, ${tenant.nome}</h3>
            <p>Sua fatura de aluguel (${invoice.mes_referencia}) no valor de <strong>R$ ${invoice.valor}</strong> vence <strong>HOJE</strong>!</p>
            <p>Evite multas e não deixe seu Score de Pontualidade cair.</p>
            <p><a href="${invoice.payment_link || '#'}">Clique aqui para pagar sua fatura agora</a></p>
          `
        }
      } else if (invoice.status === 'atrasado') {
        // Enviar alerta apenas no primeiro dia de atraso para não causar muito spam diário
        if (diffDays === -1) {
          shouldSend = true
          subject = 'URGENTE: Sua fatura do RentPay está atrasada'
          emailBody = `
            <h3 style="color: #d97706;">Olá, ${tenant.nome}</h3>
            <p>Não identificamos o pagamento da sua fatura (${invoice.mes_referencia}) que venceu ontem.</p>
            <p>Seu <strong>Score de Pontualidade já foi impactado</strong> negativamente. Regularize a situação o quanto antes para evitar maiores penalidades no seu histórico.</p>
            <p><a href="${invoice.payment_link || '#'}">Clique aqui para pagar a fatura atrasada</a></p>
            <p>Se já efetuou o pagamento nas últimas 24h, desconsidere este e-mail.</p>
          `
        }
      }

      if (shouldSend && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'RentPay <onboarding@resend.dev>',
            to: tenant.email,
            subject: subject,
            html: emailBody
          })
          emailsEnviados++
        } catch (e) {
          console.error(\`Erro ao enviar email para \${tenant.email}:\`, e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: \`Cron de lembretes finalizado. \${emailsEnviados} e-mails enviados.\`
    })

  } catch (error: any) {
    console.error('Cron Reminders Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
