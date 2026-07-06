'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTenant(formData: FormData) {
  const supabase = await createClient()

  const property_id = formData.get('property_id') as string

  // Verifica se a propriedade existe e se o locador tem acesso a ela (RLS faz isso, mas validamos o status)
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('status')
    .eq('id', property_id)
    .single()

  if (propError || !property) {
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=Imóvel não encontrado.`)
  }

  if (property.status === 'ocupado') {
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=Este imóvel já possui um inquilino ativo.`)
  }

  const tenantData = {
    property_id,
    nome: formData.get('nome') as string,
    cpf: (formData.get('cpf') as string).replace(/\D/g, ''), // Salvar apenas números
    email: formData.get('email') as string,
    telefone: (formData.get('telefone') as string).replace(/\D/g, ''),
    data_inicio_contrato: formData.get('data_inicio_contrato') as string,
  }

  const { error } = await supabase.from('tenants').insert(tenantData)

  if (error) {
    console.error('Error creating tenant:', error)
    redirect(`/dashboard/tenants/new?property_id=${property_id}&error=${encodeURIComponent(error.message)}`)
  }

  // Atualizar o status do imóvel para ocupado
  await supabase
    .from('properties')
    .update({ status: 'ocupado' })
    .eq('id', property_id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateTenant(id: string, formData: FormData) {
  const supabase = await createClient()

  const tenantData = {
    nome: formData.get('nome') as string,
    cpf: (formData.get('cpf') as string).replace(/\D/g, ''),
    email: formData.get('email') as string,
    telefone: (formData.get('telefone') as string).replace(/\D/g, ''),
    data_inicio_contrato: formData.get('data_inicio_contrato') as string,
  }

  const { error } = await supabase
    .from('tenants')
    .update(tenantData)
    .eq('id', id)

  if (error) {
    console.error('Error updating tenant:', error)
    redirect(`/dashboard/tenants/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteTenant(id: string, property_id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tenant:', error)
    throw new Error(error.message)
  }

  // Atualizar o status do imóvel de volta para disponivel
  await supabase
    .from('properties')
    .update({ status: 'disponivel' })
    .eq('id', property_id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
