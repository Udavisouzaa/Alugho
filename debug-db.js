import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const probe = async (table, col) => {
    const { error } = await supabase.from(table).select('id').eq(col, '00000000-0000-0000-0000-000000000000').limit(1)
    if (error) return `Error: ${error.message}`
    return 'Exists!'
  }

  console.log("tenants.property_id:", await probe('tenants', 'property_id'))
  console.log("tenants.locador_id:", await probe('tenants', 'locador_id'))
  console.log("invoices.property_id:", await probe('invoices', 'property_id'))
  console.log("invoices.tenant_id:", await probe('invoices', 'tenant_id'))
  console.log("invoices.locador_id:", await probe('invoices', 'locador_id'))
}

check()
