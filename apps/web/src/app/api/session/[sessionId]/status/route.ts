import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const session = await getSession(sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: session.status,
      title: session.title,
      subject: session.subject,
      topics: session.topics,
      progress_feedback: session.progress_feedback
    })
  } catch (error) {
    console.error('Error checking session status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
