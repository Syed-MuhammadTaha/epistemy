// import postgres from 'postgres';
// import { users, sessions, quizQuestions, quizAttempts } from '@/lib/placeholder-data';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }) as any;

// async function clearDatabase() {
//   // Drop tables in reverse order of dependencies
//   await sql`DROP TABLE IF EXISTS customers CASCADE`;
//   await sql`DROP TABLE IF EXISTS invoices CASCADE`;
//   await sql`DROP TABLE IF EXISTS revenue CASCADE`;
//   await sql`DROP TABLE IF EXISTS users CASCADE`;
  
//   console.log('✅ Database cleared');
// }

// async function seedUsers() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
//   await sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID PRIMARY KEY,
//       role VARCHAR(20) NOT NULL CHECK (role IN ('tutor', 'student')),
//       display_name VARCHAR(255) NOT NULL,
//       email VARCHAR(255),
//       calendly_link TEXT,
//       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
//     );
//   `;

//   const insertedUsers = await Promise.all(
//     users.map((user) => {
//       return sql`
//         INSERT INTO users (id, role, display_name, email, calendly_link)
//         VALUES (${user.id}, ${user.role}, ${user.displayName}, ${user.email || null}, ${user.calendlyLink || null})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   console.log(`✅ Seeded ${insertedUsers.length} users`);
//   return insertedUsers;
// }

// async function seedSessions() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS sessions (
//       id UUID PRIMARY KEY,
//       tutor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//       student_id UUID REFERENCES users(id) ON DELETE SET NULL,
//       title VARCHAR(255) NOT NULL,
//       subject VARCHAR(100) NOT NULL,
//       main_topic VARCHAR(100) NOT NULL,
//       date TIMESTAMP WITH TIME ZONE NOT NULL,
//       is_paid BOOLEAN NOT NULL DEFAULT FALSE,
//       status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'processing', 'completed', 'published')),
//       transcript_path TEXT,
//       video_path TEXT,
//       topics TEXT[] NOT NULL DEFAULT '{}',
//       progress_feedback TEXT NOT NULL DEFAULT '',
//       share_link TEXT,
//       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
//     );
//   `;

//   const insertedSessions = await Promise.all(
//     sessions.map((session) => {
//       return sql`
//         INSERT INTO sessions (
//           id, tutor_id, student_id, title, subject, main_topic, 
//           date, is_paid, status, transcript_path, video_path, 
//           topics, progress_feedback, share_link
//         )
//         VALUES (
//           ${session.id}, 
//           ${session.tutorId}, 
//           ${session.studentId || null}, 
//           ${session.title}, 
//           ${session.subject}, 
//           ${session.mainTopic},
//           ${session.date}, 
//           ${session.isPaid}, 
//           ${session.status}, 
//           ${session.transcriptPath || null}, 
//           ${session.videoPath || null},
//           ${session.topics}, 
//           ${session.progressFeedback}, 
//           ${session.shareLink || null}
//         )
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   console.log(`✅ Seeded ${insertedSessions.length} sessions`);
//   return insertedSessions;
// }

// async function seedQuizQuestions() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS quiz_questions (
//       id UUID PRIMARY KEY,
//       session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
//       subtopic VARCHAR(255) NOT NULL,
//       question TEXT NOT NULL,
//       options TEXT[] NOT NULL,
//       correct_answer INTEGER NOT NULL,
//       explanation TEXT NOT NULL,
//       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
//     );
//   `;

//   const insertedQuestions = await Promise.all(
//     quizQuestions.map((question) => {
//       return sql`
//         INSERT INTO quiz_questions (
//           id, session_id, subtopic, question, options, correct_answer, explanation
//         )
//         VALUES (
//           ${question.id}, 
//           ${question.sessionId}, 
//           ${question.subtopic}, 
//           ${question.question}, 
//           ${question.options}, 
//           ${question.correctAnswer}, 
//           ${question.explanation}
//         )
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   console.log(`✅ Seeded ${insertedQuestions.length} quiz questions`);
//   return insertedQuestions;
// }

// async function seedQuizAttempts() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS quiz_attempts (
//       id UUID PRIMARY KEY,
//       session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
//       student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//       score_percentage INTEGER NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
//       total_questions INTEGER NOT NULL CHECK (total_questions > 0),
//       completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
//       is_attempted BOOLEAN NOT NULL DEFAULT TRUE,
//       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//       UNIQUE(session_id, student_id)
//     );
//   `;

//   const insertedAttempts = await Promise.all(
//     quizAttempts.map((attempt) => {
//       return sql`
//         INSERT INTO quiz_attempts (
//           id, session_id, student_id, score_percentage, 
//           total_questions, completed_at, is_attempted
//         )
//         VALUES (
//           ${attempt.id}, 
//           ${attempt.sessionId}, 
//           ${attempt.studentId}, 
//           ${attempt.scorePercentage}, 
//           ${attempt.totalQuestions}, 
//           ${attempt.completedAt}, 
//           ${attempt.isAttempted}
//         )
//         ON CONFLICT (session_id, student_id) DO NOTHING;
//       `;
//     }),
//   );

//   console.log(`✅ Seeded ${insertedAttempts.length} quiz attempts`);
//   return insertedAttempts;
// }

// async function createIndexes() {
//   // Performance indexes for common queries
//   await sql`CREATE INDEX IF NOT EXISTS idx_sessions_tutor_id ON sessions(tutor_id);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_quiz_questions_session_id ON quiz_questions(session_id);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_session_id ON quiz_attempts(session_id);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON quiz_attempts(student_id);`;
//   await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`;
  
//   console.log('✅ Created database indexes');
// }

// export async function GET() {
//   try {
//     console.log('🌱 Starting database seed...');
    
//     // Clear existing data and recreate schema
//     await clearDatabase();
    
//     // Seed data in dependency order
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     await sql.begin(async (sql: any) => {
//       await seedUsers();
//       await seedSessions();
//       await seedQuizQuestions();
//       await seedQuizAttempts();
//       await createIndexes();
//     });

//     console.log('🎉 Database seeded successfully!');
    
//     return Response.json({ 
//       message: 'Database seeded successfully',
//       seeded: {
//         users: users.length,
//         sessions: sessions.length,
//         quizQuestions: quizQuestions.length,
//         quizAttempts: quizAttempts.length
//       }
//     });
//   } catch (error) {
//     console.error('❌ Database seed failed:', error);
//     return Response.json({ 
//       error: 'Database seed failed', 
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { 
//       status: 500 
//     });
//   }
// }
