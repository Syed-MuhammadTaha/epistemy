'use server'

import { redirect } from 'next/navigation'
import { updateSessionBasics, replaceQuizQuestions, type EditableQuizQuestion, updateSessionTopics, updateSessionProgress } from '@/lib/data'

export async function saveSessionBasics(tutorId: string, sessionId: string, formData: FormData) {
  const topics: string[] = []
  const progress = (formData.get('progress_feedback') as string) ?? ''

  const entries = Array.from(formData.entries())
  const topicEntries = entries.filter(([key]) => key.startsWith('topic_'))
  topicEntries.sort((a, b) => {
    const ai = parseInt(a[0].split('_')[1] ?? '0', 10)
    const bi = parseInt(b[0].split('_')[1] ?? '0', 10)
    return ai - bi
  })
  for (const [, value] of topicEntries) {
    const v = (value as string)?.trim()
    if (v) topics.push(v)
  }

  await updateSessionBasics(sessionId, topics, progress)
  redirect(`/tutor/${tutorId}/session/${sessionId}`)
}

export async function saveSessionTopics(tutorId: string, sessionId: string, formData: FormData) {
  const topics: string[] = []
  const entries = Array.from(formData.entries())
  const topicEntries = entries.filter(([key]) => key.startsWith('topic_'))
  topicEntries.sort((a, b) => {
    const ai = parseInt(a[0].split('_')[1] ?? '0', 10)
    const bi = parseInt(b[0].split('_')[1] ?? '0', 10)
    return ai - bi
  })
  for (const [, value] of topicEntries) {
    const v = (value as string)?.trim()
    if (v) topics.push(v)
  }

  await updateSessionTopics(sessionId, topics)
  redirect(`/tutor/${tutorId}/session/${sessionId}`)
}

export async function saveSessionProgress(tutorId: string, sessionId: string, formData: FormData) {
  const progress = (formData.get('progress_feedback') as string) ?? ''
  await updateSessionProgress(sessionId, progress)
  redirect(`/tutor/${tutorId}/session/${sessionId}`)
}

export async function saveQuizQuestions(tutorId: string, sessionId: string, formData: FormData) {
  const entries = Array.from(formData.entries())
  const questionIds = new Set<number>()
  for (const [key] of entries) {
    const m = key.match(/^q_(\d+)_/)
    if (m) questionIds.add(parseInt(m[1], 10))
  }

  const questions: EditableQuizQuestion[] = []
  for (const qIndex of Array.from(questionIds).sort((a,b)=>a-b)) {
    const get = (name: string) => formData.get(name) as string | null
    const id = get(`q_${qIndex}_id`) ?? undefined
    const subtopic = get(`q_${qIndex}_subtopic`) ?? ''
    const question = get(`q_${qIndex}_question`) ?? ''
    const explanation = get(`q_${qIndex}_explanation`) ?? ''

    const options: string[] = []
    for (let i = 0; i < 4; i++) {
      const opt = get(`q_${qIndex}_opt_${i}`) ?? ''
      options.push(opt)
    }
    const correctStr = get(`q_${qIndex}_correct`) ?? '0'
    const correct_answer = Number(correctStr)

    questions.push({ id: id ?? undefined, subtopic, question, options, correct_answer, explanation })
  }

  await replaceQuizQuestions(sessionId, questions)
  redirect(`/tutor/${tutorId}/session/${sessionId}`)
}
