'use server'

import { redirect } from 'next/navigation'
import { updateSessionPaymentStatus } from '@/lib/data'
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

  // Check existing assignment
  const rows = await db`SELECT id, student_id FROM sessions WHERE id = ${sessionId} LIMIT 1`
  if (!rows || rows.length === 0) {
    redirect(`/student/${studentId}?error=not_found`)
  }
  const current = rows[0]
  if (current.student_id && current.student_id !== studentId) {
    // Already registered to another student
    redirect(`/student/${studentId}?error=already_registered`)
  }
  if (current.student_id === studentId) {
    redirect(`/student/${studentId}?attached=already`)
  }

  await db`
    UPDATE sessions
    SET student_id = ${studentId}
    WHERE id = ${sessionId}
  `

  redirect(`/student/${studentId}?attached=success`)
}

export async function markSessionPaid(studentId: string, _formData: FormData) {
  const sessionId = (_formData.get('session_id') as string | null) || ''
  if (sessionId) {
    await updateSessionPaymentStatus(sessionId, true)
    redirect(`/student/${studentId}?paid=1`)
  }
  redirect(`/student/${studentId}`)
}
