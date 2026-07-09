'use server'

import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_to_bypass_build', {
  apiVersion: '2026-06-24.dahlia',
})

// O ID do Preço da Assinatura no Stripe Dashboard (Ex: price_12345)
// Coloque o seu Price ID real no .env futuramente.
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_fake_123'

export async function createSubscriptionCheckout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  // Verifica se o usuário já tem um customer ID na tabela subscriptions
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = subData?.stripe_customer_id

  if (!customerId) {
    // Se não tiver, cria um Customer no Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id
      }
    })
    customerId = customer.id

    // Pode inserir provisoriamente na tabela
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: 'none'
    })
  }

  // Cria a Sessão de Checkout (Modo Assinatura)
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    // Trial de 14 dias aprovado para o soft launch
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        supabase_user_id: user.id
      }
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/billing?canceled=true`,
  })

  return { url: session.url }
}
