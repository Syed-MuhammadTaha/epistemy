import postgres from 'postgres';
import { User, Session, QuizQuestion, QuizAttempt } from './definitions';
import { randomUUID } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
}) as any;

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Database fetch functions
export async function fetchUsers(): Promise<User[]> {
  try {
    console.log('Fetching users data...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    const data = await sql<User[]>`SELECT * FROM users`;
    console.log(`✅ Fetched ${data.length} users`);
    return data;
  } catch (error) {
    console.error('Database Error in fetchUsers:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ECONNRESET')) {
        throw new Error('Database connection was reset. Please try again.');
      } else if (error.message.includes('ENOTFOUND')) {
        throw new Error('Database server not found. Check your connection.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Database connection timed out. Please try again.');
      }
    }
    
    throw new Error(`Failed to fetch users data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


export async function fetchSessions(): Promise<Session[]> {
  try {
    console.log('Fetching sessions data...');
    const data = await sql<Session[]>`SELECT * FROM sessions`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sessions data.');
  }
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    console.log('Fetching quiz questions data...');
    const data = await sql<QuizQuestion[]>`SELECT * FROM quiz_questions`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quiz questions data.');
  }
}

export async function fetchQuizAttempts(): Promise<QuizAttempt[]> {
  try {
    console.log('Fetching quiz attempts data...');
    const data = await sql<QuizAttempt[]>`SELECT * FROM quiz_attempts`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quiz attempts data.');
  }
}

// Helper functions for data access
export async function getTutor(): Promise<User[]> {
  try {
    console.log('Fetching tutor data...');
    const data = await sql<User[]>`SELECT * FROM users WHERE role = 'tutor'`;
    
    // Convert postgres result to array
    const tutors = Array.from(data);
    
    if (!tutors || tutors.length === 0) {
      throw new Error('No tutor found');
    }
    
    return tutors as User[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tutor data.');
  }
}

export async function getStudent(): Promise<User[]> {
    try {
      console.log(`Fetching student data...`);
      const data = await sql<User[]>`
        SELECT * FROM users 
        WHERE role = 'student' 
      `;
      
      return data as User[];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch student data.');
    }
  }

export async function getTutorById(id: string): Promise<User | null> {
  try {
    console.log(`Fetching tutor data for ID: ${id}...`);
    const data = await sql<User[]>`
      SELECT * FROM users 
      WHERE role = 'tutor' AND id = ${id} 
      LIMIT 1
    `;
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tutor data.');
  }
}

export async function getStudentById(id: string): Promise<User | null> {
  try {
    console.log(`Fetching student data for ID: ${id}...`);
    const data = await sql<User[]>`
      SELECT * FROM users 
      WHERE role = 'student' AND id = ${id} 
      LIMIT 1
    `;
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch student data.');
  }
}

export async function getStudentBySessionId(sessionId: string): Promise<User | null> {
  try {
    console.log(`Fetching student by session ID: ${sessionId}...`);
    const data = await sql<User[]>`
      SELECT u.* FROM users u
      JOIN sessions s ON u.id = s.student_id
      WHERE s.id = ${sessionId} AND u.role = 'student'
      LIMIT 1
    `;
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch student by session ID.');
  }
}

export async function getSessionsForStudent(studentId: string): Promise<Session[]> {
  try {
    console.log(`Fetching enrolled sessions for student ID: ${studentId}...`);
    const data = await sql<Session[]>`
      SELECT * FROM sessions 
      WHERE student_id = ${studentId} AND is_enrolled = true
      ORDER BY date DESC
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sessions for student.');
  }
}

export async function getSessionsForTutor(tutorId: string): Promise<Session[]> {
  try {
    console.log(`Fetching sessions for tutor ID: ${tutorId}...`);
    const data = await sql<Session[]>`
      SELECT * FROM sessions 
      WHERE tutor_id = ${tutorId}
      ORDER BY date DESC
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sessions for tutor.');
  }
}

export async function getPublishedSessions(): Promise<Session[]> {
  try {
    console.log('Fetching published sessions...');
    const data = await sql<Session[]>`
      SELECT * FROM sessions 
      WHERE status = 'published'
      ORDER BY date DESC
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch published sessions.');
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    console.log(`Fetching session ID: ${sessionId}...`);
    const data = await sql<Session[]>`
      SELECT * FROM sessions 
      WHERE id = ${sessionId}
      LIMIT 1
    `;
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch session.');
  }
}

export async function getQuizQuestionsBySessionId(sessionId: string): Promise<QuizQuestion[]> {
  try {
    console.log(`Fetching quiz questions for session ID: ${sessionId}...`);
    const data = await sql<QuizQuestion[]>`
      SELECT * FROM quiz_questions 
      WHERE session_id = ${sessionId}
      ORDER BY id
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quiz questions.');
  }
}

export async function getQuizAttempt(sessionId: string, studentId: string): Promise<QuizAttempt | null> {
  try {
    console.log(`Fetching quiz attempt for session ${sessionId} and student ${studentId}...`);
    const data = await sql<QuizAttempt[]>`
      SELECT * FROM quiz_attempts 
      WHERE session_id = ${sessionId} AND student_id = ${studentId}
      LIMIT 1
    `;
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quiz attempt.');
  }
}

export async function hasAttemptedQuiz(sessionId: string, studentId: string): Promise<boolean> {
  const attempt = await getQuizAttempt(sessionId, studentId);
  return attempt ? attempt.is_attempted : false;
}

// Mutation functions
export async function updateTutorCalendlyLink(newLink: string, tutorId?: string): Promise<void> {
  try {
    console.log('Updating tutor Calendly link...');
    
    if (tutorId) {
      // Update specific tutor
      await sql`
        UPDATE users 
        SET calendly_link = ${newLink}
        WHERE role = 'tutor' AND id = ${tutorId}
      `;
    } else {
      // Update first tutor (legacy behavior)
      await sql`
        UPDATE users 
        SET calendly_link = ${newLink}
        WHERE role = 'tutor'
      `;
    }
    
    console.log('Tutor Calendly link updated successfully');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update tutor Calendly link.');
  }
}

export async function updateSessionPaymentStatus(sessionId: string, isPaid: boolean): Promise<void> {
  try {
    console.log(`Updating payment status for session ${sessionId} to ${isPaid}...`);
    await sql`
      UPDATE sessions 
      SET is_paid = ${isPaid}
      WHERE id = ${sessionId}
    `;
    
    console.log('Session payment status updated successfully');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update session payment status.');
  }
}

export async function createQuizAttempt(sessionId: string, studentId: string, score: number, totalQuestions: number): Promise<QuizAttempt> {
  try {
    console.log(`Creating quiz attempt for session ${sessionId} and student ${studentId}...`);
    
    // First, check if an attempt already exists and update it
    const existingAttempt = await getQuizAttempt(sessionId, studentId);
    
    if (existingAttempt) {
      // Update existing attempt
      const data = await sql<QuizAttempt[]>`
        UPDATE quiz_attempts 
        SET 
          score_percentage = ${score},
          total_questions = ${totalQuestions},
          completed_at = NOW(),
          is_attempted = true
        WHERE session_id = ${sessionId} AND student_id = ${studentId}
        RETURNING *
      `;
      
      return data[0];
    } else {
      // Create new attempt with generated UUID
      const id = randomUUID();
      const data = await sql<QuizAttempt[]>`
        INSERT INTO quiz_attempts (id, session_id, student_id, score_percentage, total_questions, completed_at, is_attempted)
        VALUES (${id}, ${sessionId}, ${studentId}, ${score}, ${totalQuestions}, NOW(), true)
        RETURNING *
      `;
      
      return data[0];
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create quiz attempt.');
  }
}

export async function updateSessionBasics(sessionId: string, topics: string[], progressFeedback: string): Promise<void> {
  try {
    console.log(`Updating session basics for session ${sessionId}...`);
    await sql`
      UPDATE sessions
      SET topics = ${topics},
          progress_feedback = ${progressFeedback}
      WHERE id = ${sessionId}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update session basics.');
  }
}

export async function updateSessionTopics(sessionId: string, topics: string[]): Promise<void> {
  try {
    console.log(`Updating session topics for session ${sessionId}...`);
    await sql`
      UPDATE sessions
      SET topics = ${topics}
      WHERE id = ${sessionId}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update session topics.');
  }
}

export async function updateSessionProgress(sessionId: string, progressFeedback: string): Promise<void> {
  try {
    console.log(`Updating session progress for session ${sessionId}...`);
    await sql`
      UPDATE sessions
      SET progress_feedback = ${progressFeedback}
      WHERE id = ${sessionId}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update session progress.');
  }
}

export type EditableQuizQuestion = {
  id?: string;
  subtopic: string;
    question: string;
    options: string[];
  correct_answer: number;
    explanation: string;
};

export async function replaceQuizQuestions(sessionId: string, questions: EditableQuizQuestion[]): Promise<void> {
  try {
    console.log(`Replacing quiz questions for session ${sessionId} with ${questions.length} questions...`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sql as any).begin(async (trx: any) => {
      await trx`DELETE FROM quiz_questions WHERE session_id = ${sessionId}`;

      for (const q of questions) {
        await trx`
          INSERT INTO quiz_questions (id, session_id, subtopic, question, options, correct_answer, explanation)
          VALUES (
            ${q.id ?? null},
            ${sessionId},
            ${q.subtopic},
            ${q.question},
            ${q.options},
            ${q.correct_answer},
            ${q.explanation}
          )
        `;
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to replace quiz questions.');
  }
}

// New functions for student management and session creation
export async function fetchStudents(): Promise<User[]> {
  try {
    console.log('Fetching students data...');
    const data = await sql<User[]>`SELECT * FROM users WHERE role = 'student'`;
    console.log(`✅ Fetched ${data.length} students`);
    return data;
  } catch (error) {
    console.error('Database Error in fetchStudents:', error);
    throw new Error('Failed to fetch students data.');
  }
}

export async function createSession(sessionData: {
  tutor_id: string;
  student_id: string;
  transcript_text: string;
}): Promise<string> {
  try {
    console.log('Creating new session...');
    const sessionId = randomUUID();
    const currentDate = new Date().toISOString();
    
    await sql`
      INSERT INTO sessions (
        id, 
        tutor_id, 
        student_id, 
        subject, 
        title, 
        main_topic, 
        date, 
        is_paid, 
        is_enrolled, 
        status, 
        transcript_text, 
        topics, 
        progress_feedback,
        share_link
      ) VALUES (
        ${sessionId},
        ${sessionData.tutor_id},
        ${sessionData.student_id},
        ${''},
        ${''},
        ${''},
        ${currentDate},
        false,
        false,
        'processing',
        ${sessionData.transcript_text || ''},
        ${[]},
        ${''},
        ${`session/${sessionId}`}
      )
    `;
    
    console.log(`✅ Created session with ID: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('Database Error in createSession:', error);
    throw new Error('Failed to create session.');
  }
}

export async function checkSessionEnrollment(sessionId: string, studentId: string): Promise<{ isOwner: boolean; isEnrolled: boolean }> {
  try {
    const session = await sql<Session[]>`
      SELECT student_id, is_enrolled FROM sessions WHERE id = ${sessionId}
    `;
    
    if (session.length === 0) {
      throw new Error('Session not found');
    }
    
    const sessionData = session[0];
    const isOwner = sessionData.student_id === studentId;
    const isEnrolled = sessionData.is_enrolled;
    
    return { isOwner, isEnrolled };
  } catch (error) {
    console.error('Database Error in checkSessionEnrollment:', error);
    throw new Error('Failed to check session enrollment.');
  }
}

export async function enrollStudentInSession(sessionId: string, studentId: string): Promise<void> {
  try {
    await sql`
      UPDATE sessions 
      SET is_enrolled = true 
      WHERE id = ${sessionId} AND student_id = ${studentId}
    `;
    console.log(`✅ Student ${studentId} enrolled in session ${sessionId}`);
  } catch (error) {
    console.error('Database Error in enrollStudentInSession:', error);
    throw new Error('Failed to enroll student in session.');
  }
}

// Legacy exports for backward compatibility (these will fetch from DB)
export async function mockSessions(): Promise<Session[]> {
  return await fetchSessions();
}

export async function mockUsers(): Promise<User[]> {
  return await fetchUsers();
}

export async function mockQuizQuestions(): Promise<QuizQuestion[]> {
  return await fetchQuizQuestions();
}

export async function mockQuizAttempts(): Promise<QuizAttempt[]> {
  return await fetchQuizAttempts();
}
  