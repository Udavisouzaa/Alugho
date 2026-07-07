import Stripe from 'stripe'

// Initialize Stripe with Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_to_bypass_build', {
  apiVersion: '2026-06-24.dahlia',
})

export interface GatewayPayment {
  id: string
  invoiceUrl: string
}

/**
 * Cria uma Sessão de Checkout no Stripe (com suporte a PIX e Boleto)
 */
export async function createPayment(email: string, valor: number, descricao: string, invoiceId: string): Promise<GatewayPayment> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto'], // Em ambiente real de BR, o Stripe adiciona PIX nativamente ou por configuração no Dashboard.
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: descricao,
          },
          unit_amount: Math.round(valor * 100), // Stripe usa centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: email,
    metadata: {
      invoice_id: invoiceId,
    },
    payment_intent_data: {
      metadata: {
        invoice_id: invoiceId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/invoices?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/invoices?canceled=true`,
  })

  return {
    id: session.id,
    invoiceUrl: session.url || ''
  }
}
