'use server'

import { redirect } from 'next/navigation'
import { updateSessionPaymentStatus, checkSessionEnrollment, enrollStudentInSession } from '@/lib/data'
// Removed incorrect sql import; using a local postgres client instead.
import postgres from 'postgres'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function attachSessionToStudent(studentId: string, _formData: FormData) {
  const raw = (_formData.get('session_link') as string | null)?.trim() || ''
  // Accept formats like "session/UUID" or full URLs ending with /session/UUID or just UUID
  let sessionId = raw
  try {
    const parts = raw.split('/').filter(Boolean)
    sessionId = parts[parts.length - 1] || raw
  } catch {}

  if (!sessionId) {
    redirect(`/student/${studentId}?error=invalid`)
  }

  // Step 1: Check if session exists and get enrollment status
  let isOwner = false
  let isEnrolled = false
  
  try {
    const result = await checkSessionEnrollment(sessionId, studentId)
    isOwner = result.isOwner
    isEnrolled = result.isEnrolled
  } catch (error) {
    console.error('Error checking session enrollment:', error)
    redirect(`/student/${studentId}?error=not_found`)
  }
  
  // Step 2: Check if this session belongs to the current student
  if (!isOwner) {
    redirect(`/student/${studentId}?error=not_yours`)
  }
  
  // Step 3: Check if already enrolled
  if (isEnrolled) {
    redirect(`/student/${studentId}?error=already_enrolled`)
  }
  
  // Step 4: Enroll the student in the session
  try {
    await enrollStudentInSession(sessionId, studentId)
    redirect(`/student/${studentId}?attached=success`)
  } catch (error) {
    console.error('Error enrolling student:', error)
    redirect(`/student/${studentId}?error=enrollment_failed`)
  }
}

export async function markSessionPaid(studentId: string, _formData: FormData) {
  const sessionId = (_formData.get('session_id') as string | null) || ''
  if (sessionId) {
    await updateSessionPaymentStatus(sessionId, true)
    redirect(`/student/${studentId}?paid=1`)
  }
  redirect(`/student/${studentId}`)
}
