/**
 * State definitions and structured output schemas for the workflow
 */
import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

// First, define the quiz question schema
export const QuizQuestionSchema = z.object({
  question: z.string().describe("The quiz question"),
  options: z.array(z.string()).describe("Multiple choice options (A, B, C, D)"),
  correctAnswer: z.number().describe("Index of the correct answer (0-3)"),
  explanation: z.string().describe("Explanation of why the answer is correct"),
  subtopic: z.string().describe("The specific subtopic this question tests")
});

// Define the quiz question type early
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

// Previous session data schema (now that QuizQuestion is defined)
export const PreviousSessionSchema = z.object({
  isAvailable: z.boolean().describe("Whether previous session data is available for this student-tutor-subject combination"),
  sessionScore: z.number().min(0).max(100).describe("Percentage score received in previous session quiz (0-100)"),
  sessionTopics: z.array(z.string()).describe("Array of subtopics covered in the previous session"),
  quizQuestions: z.array(QuizQuestionSchema).describe("List of quiz questions from the previous session")
});

export type PreviousSession = z.infer<typeof PreviousSessionSchema>;

// Main workflow state annotation
export const WorkflowAnnotation = Annotation.Root({
  transcript: Annotation<string>,
  studentId: Annotation<string>,
  tutorId: Annotation<string>,
  studentName: Annotation<string>,

  //Clean transcript
  cleanedTranscript: Annotation<string>,

  //Chunks
  chunks: Annotation<ChunkedTranscript[]>,

  //Summaries
  summary: Annotation<string>,
  title: Annotation<string>,
  subject: Annotation<'physics' | 'math' | 'cs' | 'english' | 'chemistry'>,
  mainTopic: Annotation<string>,
  topics: Annotation<string[]>,
  
  evaluation: Annotation<string>,
  quiz: Annotation<QuizQuestion[]>,
  previousSession: Annotation<PreviousSession>,
});

export type ChunkedTranscript = z.infer<typeof ChunkedTranscriptSchema>;

export const ChunkedTranscriptSchema = z.object({
  summary: z.string().describe("The summary of the chunk"),
  subject: z.enum(['physics', 'math', 'cs', 'english', 'chemistry']).describe("The subject of the chunk"),
  mainTopic: z.string().describe("The main topic of the chunk"),
  topics: z.array(z.string()).describe("The subtopics of the chunk")
});

export const CleanedTranscriptSchema = z.object({
  cleanedTranscript: z.string().describe("The cleaned transcript of the tutoring session")
});

export const SummarySchema = z.object({
  summary: z.string().describe("Concise summary of the tutoring session"),
  subject: z.enum(['physics', 'math', 'cs', 'english', 'chemistry']).describe("The subject of the tutoring session"),
  mainTopic: z.string().describe("The main topic of the tutoring session"),
  subTopics: z.array(z.string()).describe("The subtopics of the tutoring session"),
  title: z.string().describe("The title of the tutoring session")
});


// Other structured output schemas using Zod
export const TopicsSchema = z.object({
  title: z.string().describe("Overall agenda or title of the session in a short phrase"),
  subject: z.enum(['physics', 'math', 'cs', 'english', 'chemistry']).describe("The main subject of the session"),
  mainTopic: z.string().describe("The main topic of discussion within the subject"),
  subTopics: z.array(z.string()).describe("List of sub-topics or specific concepts discussed throughout the session"),
});

export const EvaluationSchema = z.object({
  evaluation: z.string().describe("Student progress evaluation and feedback")
});

export const QuizSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe("Array of quiz questions (3-5 questions)")
});

// Type exports for use in nodes
export type WorkflowState = typeof WorkflowAnnotation.State;
export type WorkflowUpdate = typeof WorkflowAnnotation.Update;
export type Topics = z.infer<typeof TopicsSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
