'use server'

import { redirect } from 'next/navigation'
import { updateTutorCalendlyLink } from '@/lib/data'

export async function updateCalendlyLink(tutorId: string, formData: FormData) {
  const calendlyLink = formData.get('calendlyLink') as string
  
  if (!calendlyLink) {
    throw new Error('Calendly link is required')
  }
  
  // Validate URL format
  try {
    new URL(calendlyLink)
  } catch {
    throw new Error('Please enter a valid URL')
  }
  
  await updateTutorCalendlyLink(calendlyLink, tutorId)
  
  // Redirect back to the specific tutor page
  redirect(`/tutor/${tutorId}`)
}
