// import { User, Session, QuizQuestion, QuizAttempt } from './definitions';

// // Mock Users
// export const users: User[] = [
//   {
//     id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     role: 'tutor',
//     display_name: 'Dr. Sarah Mitchell',
//     email: 'sarah.mitchell@epistemy.com',
//     calendlyLink: 'https://calendly.com/sarah-mitchell/tutoring-session'
//   },
//   {
//     id: '550e8400-e29b-41d4-a716-446655440001',
//     role: 'student',
//     display_name: 'Emma Thompson',
//     email: 'emma.t@email.com'
//   },
//   {
//     id: '550e8400-e29b-41d4-a716-446655440002',
//     role: 'student',
//     display_name: 'Marcus Johnson',
//     email: 'marcus.j@email.com'
//   },
//   {
//     id: '550e8400-e29b-41d4-a716-446655440003',
//     role: 'student',
//     display_name: 'Sofia Chen',
//     email: 'sofia.c@email.com'
//   },
//   {
//     id: '550e8400-e29b-41d4-a716-446655440004',
//     role: 'student',
//     display_name: 'Alex Rivera',
//     email: 'alex.r@email.com'
//   }
// ];

// // Mock Quiz Questions
// export const quizQuestions: QuizQuestion[] = [
//   // Session 1 - Algebra Questions
//   {
//     id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Linear equations',
//     question: 'Solve for x: 3x + 7 = 22',
//     options: ['x = 5', 'x = 7', 'x = 15', 'x = 29'],
//     correctAnswer: 0,
//     explanation: 'Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5'
//   },
//   {
//     id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Quadratic functions',
//     question: 'Which of the following represents the vertex form of a quadratic function?',
//     options: ['y = ax² + bx + c', 'y = a(x - h)² + k', 'y = mx + b', 'y = a(x + h)² - k'],
//     correctAnswer: 1,
//     explanation: 'Vertex form is y = a(x - h)² + k, where (h, k) is the vertex'
//   },
//   {
//     id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Polynomial operations',
//     question: 'Factor: x² - 9',
//     options: ['(x - 3)²', '(x + 3)²', '(x - 3)(x + 3)', '(x - 9)(x + 1)'],
//     correctAnswer: 2,
//     explanation: 'This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3)'
//   },
  
//   // Session 2 - Biology Questions
//   {
//     id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Organelles and their roles',
//     question: 'Which organelle is responsible for protein synthesis?',
//     options: ['Mitochondria', 'Ribosomes', 'Golgi apparatus', 'Nucleus'],
//     correctAnswer: 1,
//     explanation: 'Ribosomes are the cellular structures where proteins are synthesized using mRNA as a template'
//   },
//   {
//     id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Cell transport mechanisms',
//     question: 'What type of transport requires energy to move substances across the cell membrane?',
//     options: ['Simple diffusion', 'Facilitated diffusion', 'Osmosis', 'Active transport'],
//     correctAnswer: 3,
//     explanation: 'Active transport requires energy (usually ATP) to move substances against their concentration gradient'
//   },
//   {
//     id: '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Prokaryotic vs eukaryotic cells',
//     question: 'Which structure is found in plant cells but not in animal cells?',
//     options: ['Nucleus', 'Mitochondria', 'Cell wall', 'Ribosomes'],
//     correctAnswer: 2,
//     explanation: 'Plant cells have a rigid cell wall made of cellulose, while animal cells only have a flexible cell membrane'
//   },

//   // Session 3 - Physics Questions
//   {
//     id: '6ba7b81a-9dad-11d1-80b4-00c04fd430c8',
//       session_id: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Kinematic equations',
//     question: 'If an object starts from rest and accelerates at 2 m/s² for 5 seconds, what is its final velocity?',
//     options: ['5 m/s', '10 m/s', '7 m/s', '2.5 m/s'],
//     correctAnswer: 1,
//     explanation: 'Using v = u + at: v = 0 + (2)(5) = 10 m/s'
//   },
//   {
//     id: '6ba7b81c-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Motion graphs interpretation',
//     question: 'What does the slope of a position-time graph represent?',
//     options: ['Acceleration', 'Velocity', 'Displacement', 'Force'],
//     correctAnswer: 1,
//     explanation: 'The slope of a position-time graph gives the velocity at any point in time'
//   },

//   // Session 4 - Literature Questions
//   {
//     id: '6ba7b81d-9dad-11d1-80b4-00c04fd430c8',
//     session_id: '6ba7b81e-9dad-11d1-80b4-00c04fd430c8',
//     subtopic: 'Symbolism and metaphor identification',
//     question: 'What is a metaphor?',
//     options: [
//       'A comparison using \'like\' or \'as\'',
//       'A direct comparison without using \'like\' or \'as\'',
//       'A sound device',
//       'A type of rhyme scheme'
//     ],
//     correctAnswer: 1,
//     explanation: 'A metaphor is a direct comparison between two unlike things without using \'like\' or \'as\''
//   }
// ];

// // Mock Sessions
// export const sessions: Session[] = [
//   {
//     id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
//     tutor_id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     student_id: '550e8400-e29b-41d4-a716-446655440001',
//     title: 'Algebra Fundamentals Review',
//     subject: 'Mathematics',
//     mainTopic: 'Algebra',
//     date: '2024-01-15T14:00:00Z',
//     is_paid: true,
//     status: 'published',
//     transcript_path: '/transcripts/session-1.txt',
//     video_path: '/videos/session-1.mp4',
//     topics: [
//       'Linear equations and inequalities',
//       'Quadratic functions and graphing',
//       'Systems of equations',
//       'Polynomial operations'
//     ],
//     progressFeedback: 'Emma has shown significant improvement in solving linear equations. She now demonstrates a solid understanding of the elimination method for systems of equations. Areas for continued focus include factoring complex polynomials and interpreting quadratic function graphs. Her problem-solving approach has become more systematic, and she\'s beginning to recognize patterns in algebraic expressions. I recommend more practice with word problems to strengthen application skills.',
//     quiz: quizQuestions.filter(q => q.session_id === '6ba7b813-9dad-11d1-80b4-00c04fd430c8'),
//     share_link: '/student/6ba7b813-9dad-11d1-80b4-00c04fd430c8'
//   },
//   {
//     id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
//     tutor_id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     student_id: '550e8400-e29b-41d4-a716-446655440002',
//     title: 'Biology Cell Structure Deep Dive',
//     subject: 'Biology',
//     mainTopic: 'Cell Biology',
//     date: '2024-01-18T15:30:00Z',
//     is_paid: false,
//     status: 'published',
//     transcript_path: '/transcripts/session-2.txt',
//     video_path: '/videos/session-2.mp4',
//     topics: [
//       'Cell membrane structure and function',
//       'Organelles and their roles',
//       'Prokaryotic vs eukaryotic cells',
//       'Cell transport mechanisms'
//     ],
//     progressFeedback: 'Marcus has developed a strong conceptual understanding of cell structure. He excels at identifying organelles and can clearly explain their functions. His grasp of passive transport mechanisms is particularly strong. However, he would benefit from more practice with active transport processes and understanding the energy requirements involved. His ability to compare prokaryotic and eukaryotic cells has improved dramatically since our last session.',
//     quiz: quizQuestions.filter(q => q.session_id === '6ba7b817-9dad-11d1-80b4-00c04fd430c8'),
//     share_link: '/student/6ba7b817-9dad-11d1-80b4-00c04fd430c8'
//   },
//   {
//     id: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
//     tutor_id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     student_id: '550e8400-e29b-41d4-a716-446655440003',
//     title: 'Physics Kinematics Workshop',
//     subject: 'Physics',
//     mainTopic: 'Kinematics',
//     date: '2024-01-20T16:00:00Z',
//     isPaid: true,
//     status: 'processing',
//     transcript_path: '/transcripts/session-3.txt',
//     topics: [
//       'Velocity and acceleration',
//       'Kinematic equations',
//       'Motion graphs interpretation',
//       'Free fall problems'
//     ],
//     progressFeedback: 'Sofia demonstrates excellent analytical skills when approaching kinematics problems. She has mastered the concept of acceleration and can effectively use kinematic equations. Her interpretation of position-time and velocity-time graphs has improved significantly. The main area for development is building confidence in problem-solving strategy selection. She tends to second-guess her initial approach, even when it\'s correct.',
//     quiz: quizQuestions.filter(q => q.sessionId === '6ba7b81b-9dad-11d1-80b4-00c04fd430c8')
//   },
//   {
//     id: '6ba7b81e-9dad-11d1-80b4-00c04fd430c8',
//     tutorId: '410544b2-4001-4271-9855-fec4b6a6442a',
//     studentId: '550e8400-e29b-41d4-a716-446655440004',
//     title: 'English Literature Analysis Session',
//     subject: 'English Literature',
//     mainTopic: 'Literary Analysis',
//     date: '2024-01-22T14:30:00Z',
//     isPaid: true,
//     status: 'scheduled',
//     topics: [
//       'Character development in modern fiction',
//       'Thematic analysis techniques',
//       'Symbolism and metaphor identification',
//       'Essay structure and argumentation'
//     ],
//     progressFeedback: 'Alex shows strong analytical thinking and can identify literary devices effectively. Their essay writing has improved considerably, with better thesis statements and supporting evidence. They need to work on connecting textual evidence more clearly to their arguments. Their understanding of character motivation and development is particularly insightful.',
//     quiz: quizQuestions.filter(q => q.sessionId === '6ba7b81e-9dad-11d1-80b4-00c04fd430c8')
//   }
// ];

// // Mock Quiz Attempts
// export const quizAttempts: QuizAttempt[] = [
//   {
//     id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
//     sessionId: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
//     studentId: '550e8400-e29b-41d4-a716-446655440001',
//     scorePercentage: 85,
//     totalQuestions: 3,
//     completedAt: '2024-01-16T10:30:00Z',
//     isAttempted: true
//   },
//   {
//     id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
//     sessionId: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
//     studentId: '550e8400-e29b-41d4-a716-446655440002',
//     scorePercentage: 67,
//     totalQuestions: 3,
//     completedAt: '2024-01-19T09:15:00Z',
//     isAttempted: true
//   }
// ];