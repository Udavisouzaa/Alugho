const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const { data: properties } = await supabase.from('properties').select('*, tenants(*)')
  console.log("Properties:", JSON.stringify(properties, null, 2))
  
  const { data: invoices } = await supabase.from('invoices').select('*')
  console.log("Invoices:", invoices)
}

check()
