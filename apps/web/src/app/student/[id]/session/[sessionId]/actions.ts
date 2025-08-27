'use server'

import { redirect } from 'next/navigation'
import { getQuizQuestionsBySessionId, createQuizAttempt } from '@/lib/data'

export async function submitQuiz(studentId: string, sessionId: string, formData: FormData) {
  // Fetch the authoritative questions to check answers
  const questions = await getQuizQuestionsBySessionId(sessionId)
  let correct = 0

  questions.forEach((q, idx) => {
    const choiceStr = formData.get(`q_${idx}_choice`) as string | null
    const choice = choiceStr ? Number(choiceStr) : NaN
    if (!Number.isNaN(choice) && choice === q.correct_answer) correct += 1
  })

  const total = questions.length
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  await createQuizAttempt(sessionId, studentId, percentage, total)

  redirect(`/student/${studentId}/session/${sessionId}?attempted=1`)
}
