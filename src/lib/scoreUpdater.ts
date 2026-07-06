import { createClient } from '@supabase/supabase-js'
import { calculatePunctualityScore, Invoice as JulesInvoice } from '@/punctuality'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS to guarantee update
)

export async function updateTenantScore(tenantId: string) {
  try {
    // 1. Puxa todas as faturas do inquilino
    const { data: invoices, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', tenantId)

    if (fetchError) {
      console.error(`Erro ao buscar faturas do inquilino ${tenantId}:`, fetchError)
      return
    }

    if (!invoices || invoices.length === 0) return

    // 2. Mapeia para a interface exigida pelo Jules
    const mappedInvoices: JulesInvoice[] = invoices.map(inv => ({
      status: inv.status as JulesInvoice['status'],
      data_vencimento: new Date(inv.data_vencimento),
      data_pagamento: inv.data_pagamento ? new Date(inv.data_pagamento) : null,
      valor: inv.valor
    }))

    // 3. Chama a função matemática pura do Jules
    const scoreAtual = calculatePunctualityScore(mappedInvoices)

    // 4. Calcula métricas derivadas
    const totalPagamentos = mappedInvoices.length
    const pagamentosEmDia = mappedInvoices.filter(i => 
      i.status === 'pago' && i.data_pagamento && i.data_pagamento <= i.data_vencimento
    ).length
    
    const pagamentosAtrasados = mappedInvoices.filter(i => 
      i.status === 'atrasado' || 
      (i.status === 'pago' && i.data_pagamento && i.data_pagamento > i.data_vencimento)
    ).length

    // Média de atrasos (apenas das faturas com atraso real registrado ou atualmente atrasadas)
    let somaDiasAtraso = 0
    let countAtrasos = 0
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    
    for (const inv of mappedInvoices) {
      if (inv.status === 'pago' && inv.data_pagamento && inv.data_pagamento > inv.data_vencimento) {
        somaDiasAtraso += (inv.data_pagamento.getTime() - inv.data_vencimento.getTime()) / MS_PER_DAY
        countAtrasos++
      } else if (inv.status === 'atrasado') {
        somaDiasAtraso += (Date.now() - inv.data_vencimento.getTime()) / MS_PER_DAY
        countAtrasos++
      }
    }
    const mediaDiasAtraso = countAtrasos > 0 ? somaDiasAtraso / countAtrasos : 0

    // 5. Salva (upsert) na tabela
    const { error: upsertError } = await supabase
      .from('punctuality_scores')
      .upsert({
        tenant_id: tenantId,
        score_atual: scoreAtual,
        total_pagamentos: totalPagamentos,
        pagamentos_em_dia: pagamentosEmDia,
        pagamentos_atrasados: pagamentosAtrasados,
        media_dias_atraso: mediaDiasAtraso,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id' })

    if (upsertError) {
      console.error(`Erro ao salvar score para inquilino ${tenantId}:`, upsertError)
    } else {
      console.log(`Score de Pontualidade para ${tenantId} recalculado: ${scoreAtual.toFixed(2)}`)
    }
  } catch (err) {
    console.error('Falha inesperada no updateTenantScore:', err)
  }
}
