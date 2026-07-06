'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const propertyData = {
    user_id: user.id,
    endereco: formData.get('endereco') as string,
    valor_aluguel: parseFloat(formData.get('valor_aluguel') as string),
    dia_vencimento: parseInt(formData.get('dia_vencimento') as string, 10),
    status: 'disponivel',
  }

  const { error } = await supabase.from('properties').insert(propertyData)

  if (error) {
    console.error('Error creating property:', error)
    redirect(`/dashboard/properties/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()

  const propertyData = {
    endereco: formData.get('endereco') as string,
    valor_aluguel: parseFloat(formData.get('valor_aluguel') as string),
    dia_vencimento: parseInt(formData.get('dia_vencimento') as string, 10),
  }

  const { error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    // RLS ensures they can only update their own property

  if (error) {
    console.error('Error updating property:', error)
    redirect(`/dashboard/properties/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting property:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
