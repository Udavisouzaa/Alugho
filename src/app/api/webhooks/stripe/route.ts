import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, parseWebhookPayload, WebhookValidationError } from '@/webhook'
import { updateTenantScore } from '@/lib/scoreUpdater'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  // 1. Verificação de Assinatura usando o módulo do Jules
  // OBS: Como solicitado, estamos integrando a função exata sem alterar a lógica.
  if (endpointSecret) {
    const isValid = verifyWebhookSignature(rawBody, signature, endpointSecret)
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 401 })
    }
  }

  try {
    // 2. Parser Seguro usando o módulo do Jules
    const payload = parseWebhookPayload(rawBody)

    // 3. Mitigação de Replay Attacks (Idempotência básica sugerida pelo Jules)
    // Opcionalmente, poderíamos checar se a fatura já está paga antes de atualizar.
    
    if (payload.status === 'pago' || payload.status === 'paid') {
      const paymentId = payload.id_cobranca
      
      const { data: updatedData, error } = await supabase
        .from('invoices')
        .update({
          status: 'pago',
          data_pagamento: payload.data_pagamento || new Date().toISOString().split('T')[0],
          metodo_pagamento: 'webhook_gateway'
        })
        .eq('gateway_id', paymentId)
        .select('tenant_id')

      if (error) {
        console.error('Webhook DB Update Error:', error)
      } else if (updatedData && updatedData.length > 0) {
        console.log(`Fatura ${paymentId} atualizada via Webhook Seguro do Jules.`)
        // Recalcular score (assíncrono)
        updateTenantScore(updatedData[0].tenant_id).catch(console.error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook Error:', err.message)
    if (err instanceof WebhookValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

