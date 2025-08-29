'use server'

import { redirect } from 'next/navigation'
import { createSession, updateSessionWithLangGraphResults, getStudentById } from '@/lib/data'
import { invokeLangGraphAgent } from '@/lib/langgraph'

export async function createSessionAction(tutorId: string, formData: FormData) {
  const studentId = formData.get('student_id') as string
  const transcriptText = formData.get('transcript_text') as string

  if (!studentId || !transcriptText?.trim()) {
    throw new Error('Please fill in all fields')
  }

  let sessionId: string
  
  try {
    // Get student name for LangGraph input
    const student = await getStudentById(studentId)
    if (!student) {
      throw new Error('Student not found')
    }

    // Create session with initial loading state (subject will be extracted by LangGraph)
    sessionId = await createSession({
      tutor_id: tutorId,
      student_id: studentId,
      transcript_text: transcriptText.trim()
    })

    // Start LangGraph processing in the background
    // We don't await this - let it run in the background
    processSessionWithLangGraph(sessionId, {
      transcript: transcriptText.trim(),
      studentId,
      tutorId,
      studentName: student.display_name
    }).catch((error: Error) => {
      console.error('Background LangGraph processing failed:', error)
      // In a production app, you might want to log this to a monitoring service
    })

  } catch (error) {
    console.error('Failed to create session:', error)
    throw new Error('Failed to create session. Please try again.')
  }

  // Redirect to the session page with success message
  redirect(`/tutor/${tutorId}/session/${sessionId}?created=success`)
}

/**
 * Process the session with LangGraph agent in the background
 * This function runs asynchronously and updates the session when complete
 */
async function processSessionWithLangGraph(sessionId: string, input: {
  transcript: string;
  studentId: string;
  tutorId: string;
  studentName: string;
}) {
  try {
    console.log(`Starting LangGraph processing for session ${sessionId}...`)
    
    // Invoke the LangGraph agent
    const results = await invokeLangGraphAgent(input)
    console.log(`LangGraph results received for session ${sessionId}:`, results)
    
    // Update the session with the results
    console.log(`Updating database for session ${sessionId}...`)
    await updateSessionWithLangGraphResults(sessionId, results)
    
    console.log(`✅ LangGraph processing completed for session ${sessionId}`)
  } catch (error) {
    console.error(`❌ LangGraph processing failed for session ${sessionId}:`, error)
    
    // Update the session to indicate failure
    // You might want to add a status field for this
    // For now, we'll just log the error
  }
}