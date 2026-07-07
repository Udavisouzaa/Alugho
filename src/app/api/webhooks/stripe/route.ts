import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { updateTenantScore } from '@/lib/scoreUpdater'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_to_bypass_build', {
  apiVersion: '2026-06-24.dahlia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  console.log('Webhook Stripe recebido. Iniciando processamento...')
  
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('Assinatura do Stripe ausente.')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  // 1. Verificação oficial da assinatura do Stripe
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
      console.log('Assinatura validada com sucesso. Evento:', event.type)
    } else {
      // Fallback local se não houver secret (NÃO RECOMENDADO EM PRODUÇÃO)
      console.warn('STRIPE_WEBHOOK_SECRET não definido, ignorando verificação (Apenas Dev).')
      event = JSON.parse(rawBody) as Stripe.Event
    }
  } catch (err: any) {
    console.error(`Falha na verificação da assinatura: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // 2. Tratar evento de pagamento confirmado
  // O checkout.session.completed ocorre quando a sessão gerada em /api/cron/daily é paga
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoice_id

    if (!invoiceId) {
      console.error(`Erro: Session ${session.id} não possui invoice_id na metadata.`)
      // Retornar 200 para o Stripe não ficar tentando reenviar um evento inválido nosso
      return NextResponse.json({ received: true })
    }

    console.log(`Processando pagamento para a fatura ID: ${invoiceId}`)

    // 3. Checar Idempotência (verificar se já foi pago)
    const { data: currentInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('status, tenant_id')
      .eq('id', invoiceId)
      .single()

    if (fetchError || !currentInvoice) {
      console.error(`Fatura não encontrada no Supabase: ${invoiceId}`)
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (currentInvoice.status === 'pago') {
      console.log(`Idempotência: Fatura ${invoiceId} já estava marcada como paga. Ignorando evento duplicado.`)
      return NextResponse.json({ received: true })
    }

    // 4. Atualizar o status para pago
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        status: 'pago',
        data_pagamento: new Date().toISOString().split('T')[0],
        metodo_pagamento: 'stripe'
      })
      .eq('id', invoiceId)

    if (updateError) {
      console.error(`Erro ao atualizar status da fatura ${invoiceId}:`, updateError)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    console.log(`Fatura ${invoiceId} marcada como PAGA com sucesso.`)

    // 5. Disparar recálculo do score
    updateTenantScore(currentInvoice.tenant_id).catch(err => {
      console.error(`Erro no background updateTenantScore para tenant ${currentInvoice.tenant_id}:`, err)
    })
  } else {
    console.log(`Evento ${event.type} ignorado (Não mapeado).`)
  }

  // 6. Responder rapidamente ao Stripe
  return NextResponse.json({ received: true })
}

