export type User = {
  id: string; 
  role: 'tutor' | 'student';
  display_name: string;
  email?: string;
  calendly_link?: string; // tutor-specific
}

export type Session = {
  id: string; 
  tutor_id: string; 
  student_id?: string; 
  title: string;
  subject: string;
  main_topic: string;
  date: string; 
  is_paid: boolean;
  status: 'scheduled' | 'processing' | 'completed' | 'published';

  // Content
  transcript_path?: string;
  video_path?: string;
  topics: string[]; // list of subtopics covered in session
  progress_feedback: string; 
  quiz: QuizQuestion[]; // each question linked to a subtopic

  // Links
  share_link?: string;
}

export type QuizQuestion = {
  id: string;
  session_id: string; // FK → Session.id
  subtopic: string;  // subtopic this question targets
  question: string;
  options: string[];
  correct_answer: number; 
  explanation: string;
}

export type QuizAttempt = {
  id: string;
  session_id: string; 
  student_id: string; 
  score_percentage: number; 
  total_questions: number;
  completed_at: string;
  is_attempted: boolean; 
}