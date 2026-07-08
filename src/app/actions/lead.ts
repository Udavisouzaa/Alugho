'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Or Anon key since RLS is public insert, but Service Role bypasses just in case
)

export async function submitLead(formData: {
  name: string
  whatsapp: string
  email: string
  properties: string
  city: string
  currentMethod: string
}) {
  try {
    const { error } = await supabase.from('leads').insert([
      {
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        properties: formData.properties,
        city: formData.city,
        current_method: formData.currentMethod,
      }
    ])

    if (error) {
      console.error('Error inserting lead:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Unexpected error inserting lead:', error)
    return { success: false, error: error.message }
  }
}
