// Hardcoded data for the Epistemy prototype - aligned with database schema

export interface User {
  id: string; // uuid
  role: 'tutor' | 'student';
  displayName: string;
  email?: string;
  calendlyLink?: string; // tutor-specific
}

export interface Session {
  id: string; // uuid
  tutorId: string; // FK → User.id
  studentId?: string; // FK → User.id, nullable for group sessions or unassigned
  title: string;
  subject: string;
  date: string; // timestamp or ISO string
  isPaid: boolean;
  status: 'scheduled' | 'processing' | 'completed' | 'published';

  // Content
  transcriptPath?: string;
  videoPath?: string;
  topics: string[];
  progressFeedback: string; // markdown/text
  quiz: QuizQuestion[];

  // Links
  shareLink?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index in options
  explanation: string;
}

export interface QuizAttempt {
  id: string; // uuid
  sessionId: string; // FK → Session.id
  studentId: string; // FK → User.id
  scorePercentage: number; // e.g. 85 for 85%
  totalQuestions: number; // easier to track
  completedAt: string; // timestamp
  isAttempted: boolean; // whether the quiz has been attempted
  topicScores?: { [topic: string]: number }; 
}

export interface StudentProgress {
    studentId: string;   // FK → User.id
    teacherId: string;   // FK → User.id
    subject: string;
  
    sessions: string[];  // ordered list of Session.id
  
    topicCoverage: { [topic: string]: number };
    lastQuizScores: { [topic: string]: number };
  
    // NEW: historical quiz link
    quizHistory?: { 
      attemptId: string; 
      sessionId: string; 
      topics: string[];
      score: number;
    }[];
  
  }
  
  
  // Mock Users
  export const mockUsers: User[] = [
    {
      id: "tutor-1",
      role: "tutor",
      displayName: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@epistemy.com",
      calendlyLink: "https://calendly.com/sarah-mitchell/tutoring-session"
    },
    {
      id: "student-1",
      role: "student", 
      displayName: "Emma Thompson",
      email: "emma.t@email.com"
    },
    {
      id: "student-2",
      role: "student",
      displayName: "Marcus Johnson", 
      email: "marcus.j@email.com"
    },
    {
      id: "student-3",
      role: "student",
      displayName: "Sofia Chen",
      email: "sofia.c@email.com"
    },
    {
      id: "student-4", 
      role: "student",
      displayName: "Alex Rivera",
      email: "alex.r@email.com"
    }
  ];

  export const mockSessions: Session[] = [
    {
      id: "session-1",
      tutorId: "tutor-1",
      studentId: "student-1",
      title: "Algebra Fundamentals Review",
      date: "2024-01-15T14:00:00Z",
      isPaid: true,
      status: "published",
      subject: "Mathematics",
      topics: [
        "Linear equations and inequalities",
        "Quadratic functions and graphing",
        "Systems of equations",
        "Polynomial operations"
      ],
      progressFeedback: "Emma has shown significant improvement in solving linear equations. She now demonstrates a solid understanding of the elimination method for systems of equations. Areas for continued focus include factoring complex polynomials and interpreting quadratic function graphs. Her problem-solving approach has become more systematic, and she's beginning to recognize patterns in algebraic expressions. I recommend more practice with word problems to strengthen application skills.",
      quiz: [
        {
          id: "q1",
          question: "Solve for x: 3x + 7 = 22",
          options: ["x = 5", "x = 7", "x = 15", "x = 29"],
          correctAnswer: 0,
          explanation: "Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5"
        },
        {
          id: "q2",
          question: "Which of the following represents the vertex form of a quadratic function?",
          options: ["y = ax² + bx + c", "y = a(x - h)² + k", "y = mx + b", "y = a(x + h)² - k"],
          correctAnswer: 1,
          explanation: "Vertex form is y = a(x - h)² + k, where (h, k) is the vertex"
        },
        {
          id: "q3",
          question: "Factor: x² - 9",
          options: ["(x - 3)²", "(x + 3)²", "(x - 3)(x + 3)", "(x - 9)(x + 1)"],
          correctAnswer: 2,
          explanation: "This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3)"
        }
      ],
      shareLink: "/student/session-1"
    },
    {
      id: "session-2", 
      tutorId: "tutor-1",
      studentId: "student-2",
      title: "Biology Cell Structure Deep Dive",
      date: "2024-01-18T15:30:00Z",
      isPaid: false,
      status: "published",
      subject: "Biology",
      topics: [
        "Cell membrane structure and function",
        "Organelles and their roles",
        "Prokaryotic vs eukaryotic cells",
        "Cell transport mechanisms"
      ],
      progressFeedback: "Marcus has developed a strong conceptual understanding of cell structure. He excels at identifying organelles and can clearly explain their functions. His grasp of passive transport mechanisms is particularly strong. However, he would benefit from more practice with active transport processes and understanding the energy requirements involved. His ability to compare prokaryotic and eukaryotic cells has improved dramatically since our last session.",
      quiz: [
        {
          id: "q1",
          question: "Which organelle is responsible for protein synthesis?",
          options: ["Mitochondria", "Ribosomes", "Golgi apparatus", "Nucleus"],
          correctAnswer: 1,
          explanation: "Ribosomes are the cellular structures where proteins are synthesized using mRNA as a template"
        },
        {
          id: "q2",
          question: "What type of transport requires energy to move substances across the cell membrane?",
          options: ["Simple diffusion", "Facilitated diffusion", "Osmosis", "Active transport"],
          correctAnswer: 3,
          explanation: "Active transport requires energy (usually ATP) to move substances against their concentration gradient"
        },
        {
          id: "q3",
          question: "Which structure is found in plant cells but not in animal cells?",
          options: ["Nucleus", "Mitochondria", "Cell wall", "Ribosomes"],
          correctAnswer: 2,
          explanation: "Plant cells have a rigid cell wall made of cellulose, while animal cells only have a flexible cell membrane"
        }
      ],
      shareLink: "/student/session-2"
    },
    {
      id: "session-3",
      tutorId: "tutor-1", 
      studentId: "student-3",
      title: "Physics Kinematics Workshop",
      date: "2024-01-20T16:00:00Z",
      isPaid: true,
      status: "processing",
      subject: "Physics",
      topics: [
        "Velocity and acceleration",
        "Kinematic equations",
        "Motion graphs interpretation",
        "Free fall problems"
      ],
      progressFeedback: "Sofia demonstrates excellent analytical skills when approaching kinematics problems. She has mastered the concept of acceleration and can effectively use kinematic equations. Her interpretation of position-time and velocity-time graphs has improved significantly. The main area for development is building confidence in problem-solving strategy selection. She tends to second-guess her initial approach, even when it's correct.",
      quiz: [
        {
          id: "q1",
          question: "If an object starts from rest and accelerates at 2 m/s² for 5 seconds, what is its final velocity?",
          options: ["5 m/s", "10 m/s", "7 m/s", "2.5 m/s"],
          correctAnswer: 1,
          explanation: "Using v = u + at: v = 0 + (2)(5) = 10 m/s"
        },
        {
          id: "q2",
          question: "What does the slope of a position-time graph represent?",
          options: ["Acceleration", "Velocity", "Displacement", "Force"],
          correctAnswer: 1,
          explanation: "The slope of a position-time graph gives the velocity at any point in time"
        }
      ]
    },
    {
      id: "session-4",
      tutorId: "tutor-1",
      studentId: "student-4", 
      title: "English Literature Analysis Session",
      date: "2024-01-22T14:30:00Z",
      isPaid: true,
      status: "scheduled",
      subject: "English Literature",
      topics: [
        "Character development in modern fiction",
        "Thematic analysis techniques",
        "Symbolism and metaphor identification",
        "Essay structure and argumentation"
      ],
      progressFeedback: "Alex shows strong analytical thinking and can identify literary devices effectively. Their essay writing has improved considerably, with better thesis statements and supporting evidence. They need to work on connecting textual evidence more clearly to their arguments. Their understanding of character motivation and development is particularly insightful.",
      quiz: [
        {
          id: "q1",
          question: "What is a metaphor?",
          options: [
            "A comparison using 'like' or 'as'",
            "A direct comparison without using 'like' or 'as'",
            "A sound device",
            "A type of rhyme scheme"
          ],
          correctAnswer: 1,
          explanation: "A metaphor is a direct comparison between two unlike things without using 'like' or 'as'"
        }
      ]
    }
  ];

  // Mock quiz attempts for demonstration
  export const mockQuizAttempts: QuizAttempt[] = [
    {
      id: "attempt-1",
      sessionId: "session-1",
      studentId: "student-1", 
      scorePercentage: 85,
      totalQuestions: 3,
      completedAt: "2024-01-16T10:30:00Z",
      isAttempted: true
    }
  ];

  // Helper functions to get users by role or ID
  export const getTutor = (): User => {
    return mockUsers.find(user => user.role === 'tutor') || mockUsers[0];
  };

  export const getStudent = (studentId: string): User | undefined => {
    return mockUsers.find(user => user.id === studentId && user.role === 'student');
  };

  export const getStudentBySessionId = (sessionId: string): User | undefined => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session?.studentId) return undefined;
    return getStudent(session.studentId);
  };

  // In a real application, this would be stored in a database
  // and updated through an API endpoint
  export const updateTutorCalendlyLink = (newLink: string) => {
    const tutor = getTutor();
    if (tutor) {
      tutor.calendlyLink = newLink;
      // This would typically make an API call to update the database
      console.log('Tutor Calendly link updated to:', newLink);
    }
  };

  // Function to update session payment status
  export const updateSessionPaymentStatus = (sessionId: string, isPaid: boolean) => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) {
      session.isPaid = isPaid;
      // This would typically make an API call to update the database
      console.log(`Session ${sessionId} payment status updated to:`, isPaid);
    }
  };

  // Helper function to get sessions for a specific student
  export const getSessionsForStudent = (studentId: string): Session[] => {
    return mockSessions.filter(session => 
      session.studentId === studentId && session.shareLink
    );
  };

  // Helper function to get published sessions (what students can see)
  export const getPublishedSessions = (): Session[] => {
    return mockSessions.filter(session => 
      session.status === 'published' && session.shareLink
    );
  };

  // Helper functions for quiz attempts
  export const getQuizAttempt = (sessionId: string, studentId: string): QuizAttempt | undefined => {
    return mockQuizAttempts.find(attempt => 
      attempt.sessionId === sessionId && attempt.studentId === studentId
    );
  };

  export const hasAttemptedQuiz = (sessionId: string, studentId: string): boolean => {
    const attempt = getQuizAttempt(sessionId, studentId);
    return attempt?.isAttempted || false;
  };

  export const createQuizAttempt = (sessionId: string, studentId: string, score: number, totalQuestions: number): QuizAttempt => {
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`, // Simple ID generation for demo
      sessionId,
      studentId,
      scorePercentage: Math.round((score / totalQuestions) * 100),
      totalQuestions,
      completedAt: new Date().toISOString(),
      isAttempted: true
    };
    
    mockQuizAttempts.push(attempt);
    return attempt;
  };
  