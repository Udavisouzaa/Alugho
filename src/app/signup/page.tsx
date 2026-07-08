import { SignupForm } from '@/components/auth/SignupForm'

export const revalidate = 0

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return <SignupForm searchParams={searchParams} />
}
