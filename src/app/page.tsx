import { Metadata } from 'next'
import { LandingLayout } from '@/components/landing/LandingLayout'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { PricingAndCompare } from '@/components/landing/PricingAndCompare'
import { LeadForm } from '@/components/landing/LeadForm'

export const metadata: Metadata = {
  title: 'Alugho — Gestão de Aluguel Simplificada',
}

export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <Features />
      <PricingAndCompare />
      <LeadForm />
    </LandingLayout>
  )
}
