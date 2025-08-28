'use server'

import { redirect } from 'next/navigation'
import { createSession } from '@/lib/data'

export async function createSessionAction(tutorId: string, formData: FormData) {
  const studentId = formData.get('student_id') as string
  const transcriptText = formData.get('transcript_text') as string

  if (!studentId || !transcriptText?.trim()) {
    throw new Error('Please fill in all fields')
  }

  let sessionId: string
  
  try {
    sessionId = await createSession({
      tutor_id: tutorId,
      student_id: studentId,
      transcript_text: transcriptText.trim()
    })
  } catch (error) {
    console.error('Failed to create session:', error)
    throw new Error('Failed to create session. Please try again.')
  }

  // Move redirect outside try-catch as it throws internally in Next.js
  redirect(`/tutor/${tutorId}/session/${sessionId}?created=success`)
}
