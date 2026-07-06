import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { updateTenantScore } from '../src/lib/scoreUpdater'
import { calculatePunctualityScore, Invoice as JulesInvoice } from '../src/punctuality'

// Inicializa o cliente do Supabase apontando para o ambiente local/testes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('Integração do Score de Pontualidade', () => {
  let testTenantId: string

  beforeAll(async () => {
    // Para um teste E2E real, deveríamos criar um inquilino e faturas dummy.
    // Aqui assumimos que vamos pegar o primeiro inquilino disponível no banco de testes.
    const { data } = await supabase.from('tenants').select('id').limit(1)
    if (data && data.length > 0) {
      testTenantId = data[0].id
    }
  })

  it('deve recalcular o score corretamente quando uma fatura vira atrasada', async () => {
    if (!testTenantId) {
      console.warn('Teste pulado: Nenhum inquilino encontrado no banco.')
      return
    }

    // 1. Inserir uma fatura pendente e vencida ontem (simulando estado antes do cron)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { data: newInvoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        tenant_id: testTenantId,
        mes_referencia: 'TESTE-001',
        valor: 1000,
        status: 'pendente',
        data_vencimento: yesterday.toISOString().split('T')[0]
      })
      .select()
      .single()

    expect(insertError).toBeNull()

    // 2. Simular a ação do Cron (marcar como atrasado)
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ status: 'atrasado' })
      .eq('id', newInvoice.id)
    
    expect(updateError).toBeNull()

    // 3. Chamar o nosso serviço de integração (o mesmo que roda no Cron/Webhook)
    await updateTenantScore(testTenantId)

    // 4. Buscar o score salvo no banco
    const { data: scoreRecord } = await supabase
      .from('punctuality_scores')
      .select('*')
      .eq('tenant_id', testTenantId)
      .single()

    expect(scoreRecord).not.toBeNull()

    // 5. Validar contra a função pura
    // Buscar faturas para calcular a prova real
    const { data: allInvoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', testTenantId)

    const mappedInvoices: JulesInvoice[] = allInvoices!.map(inv => ({
      status: inv.status as JulesInvoice['status'],
      data_vencimento: new Date(inv.data_vencimento),
      data_pagamento: inv.data_pagamento ? new Date(inv.data_pagamento) : null,
      valor: inv.valor
    }))

    const expectedScore = calculatePunctualityScore(mappedInvoices)

    // O valor no banco deve ser exatamente o valor calculado pela função pura do Jules
    expect(scoreRecord!.score_atual).toBeCloseTo(expectedScore, 5)

    // Limpeza do teste
    await supabase.from('invoices').delete().eq('id', newInvoice.id)
  })
})
