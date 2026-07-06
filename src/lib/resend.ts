import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || 'fake-key'
export const resend = new Resend(resendApiKey)
