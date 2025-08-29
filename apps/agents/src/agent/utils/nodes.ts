/**
 * Node implementations for the workflow
 */
import postgres from 'postgres';
import { RunnableConfig } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOllama } from "@langchain/ollama";
import {
  WorkflowState,
  WorkflowUpdate,
  TopicsSchema,
  SummarySchema,
  EvaluationSchema,
  QuizSchema,
  CleanedTranscriptSchema,
  ChunkedTranscriptSchema
} from "./state.js";
import {
  reduceSummaryPrompt,
  evaluationWithHistoryPrompt,
  quizGenerationPrompt,
  evaluationFirstSessionPrompt,
  cleanTranscriptPrompt,
  mapTranscriptPrompt
} from "./prompts.js";

// Database connection setup
const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  max: 5, // Limit connections for agents
  idle_timeout: 20,
  connect_timeout: 10,
});

// Initialize the LLM (you can make this configurable later)
const llm = new ChatGroq({
  model: "llama3-8b-8192",
  temperature: 0,
});

// const llm = new ChatOllama({
//   model: "llama3.2:3b",
//   temperature: 0,
// });

export async function cleanTranscriptNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log("🧹 Cleaning transcript with LLM...");

  console.log("🔍 Raw transcript:", state.transcript);

  const chain = cleanTranscriptPrompt.pipe(llm.withStructuredOutput(CleanedTranscriptSchema));
  const result = await chain.invoke({
    rawTranscript: state.transcript
  });

  console.log("✅ Transcript cleaned successfully");

  return { cleanedTranscript: result.cleanedTranscript};
}

export async function chunkMapTranscriptNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log("🔍 Chunking transcript...");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 500,
  });

  const chunks = await textSplitter.splitText(state.cleanedTranscript);
  
  const mapResults = await Promise.all(chunks.map(async (chunk) => {
    const chain = mapTranscriptPrompt.pipe(llm.withStructuredOutput(ChunkedTranscriptSchema));
    const result = await chain.invoke({
      chunk: chunk
    });
    return result;
  }));

  return { chunks: mapResults };
  
}

// Summary generation node
export async function reduceSummaryNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log('📝 Generating summary...');
  
  const summaryChain = reduceSummaryPrompt.pipe(llm.withStructuredOutput(SummarySchema));
  
  const formattedChunks = state.chunks
  .map((chunk, i) => {
    return `Chunk ${i + 1}:
    - Summary: ${chunk.summary}
    - Subject: ${chunk.subject}
    - MainTopic: ${chunk.mainTopic}
    - SubTopics: ${chunk.topics.join(", ")}`;
  })
  .join("\n\n"); // Separate chunks with a blank line

  // Now pass into chain
  const result = await summaryChain.invoke({
    chunks: formattedChunks, // matches your {chunks} variable in the reduce prompt
  });
  
  console.log('✅ Summary generated successfully');
  
  return { summary: result.summary, subject: result.subject, mainTopic: result.mainTopic, topics: result.subTopics, title: result.title };
}

// Previous session data retrieval node
export async function previousSessionNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log('📚 Fetching previous session data...');
  
  try {
    // Query for the most recent session with same student, tutor, and subject
    const previousSessions = await sql`
      SELECT 
        s.id,
        s.topics,
        s.date
      FROM sessions s
      WHERE s.student_id = ${state.studentId}
        AND s.tutor_id = ${state.tutorId}
        AND s.subject = ${state.subject}
      ORDER BY s.date DESC
      LIMIT 1
    `;
    
    // Get the most recent previous session
    const previousSession = previousSessions.length > 0 ? previousSessions[0] : null;
    
    if (!previousSession) {
      console.log('ℹ️ No previous session found');
      return { 
        previousSession: {
          isAvailable: false,
          sessionScore: 0,
          sessionTopics: [],
          quizQuestions: []
        }
      };
    }
    
    console.log(`📖 Found previous session: ${previousSession.id}`);
    
    // Get quiz questions for the previous session
    const quizQuestions = await sql`
      SELECT 
        id,
        session_id,
        subtopic,
        question,
        options,
        correct_answer,
        explanation
      FROM quiz_questions
      WHERE session_id = ${previousSession.id}
      ORDER BY id
    `;
    
    // Get the quiz attempt score for this student
    const quizAttempt = await sql`
      SELECT 
        score_percentage,
        total_questions,
        completed_at
      FROM quiz_attempts
      WHERE session_id = ${previousSession.id}
        AND student_id = ${state.studentId}
        AND is_attempted = true
      ORDER BY completed_at DESC
      LIMIT 2
      OFFSET 1
    `;
    
    // Extract session score (default to 0 if no attempt found)
    const sessionScore = quizAttempt.length > 0 ? quizAttempt[0].score_percentage : 0;
    
    // Extract session topics (from the topics array in the session)
    const sessionTopics = Array.isArray(previousSession.topics) ? previousSession.topics : [];
    
    // Format quiz questions to match our schema
    const formattedQuizQuestions = quizQuestions.map((q: any) => ({
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      subtopic: q.subtopic
    }));
    
    console.log(`✅ Previous session data retrieved: ${sessionScore}% score, ${sessionTopics.length} topics, ${formattedQuizQuestions.length} questions`);
    
    return {
      previousSession: {
        isAvailable: true,
        sessionScore: sessionScore,
        sessionTopics: sessionTopics,
        quizQuestions: formattedQuizQuestions
      }
    };
    
  } catch (error) {
    console.error('❌ Error fetching previous session data:', error);
    
    // Return empty previous session data on error
    return {
      previousSession: {
        isAvailable: false,
        sessionScore: 0,
        sessionTopics: [],
        quizQuestions: []
      }
    };
  }
}


// Progress evaluation node
export async function evaluationNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log('📊 Evaluating progress...');
  

  if (state.previousSession?.isAvailable) {
    console.log('🔄 Using evaluation prompt with previous session context');
    const evaluationChain = evaluationWithHistoryPrompt.pipe(llm.withStructuredOutput(EvaluationSchema));
    const result = await evaluationChain.invoke({
      studentName: state.studentName,
      subject: state.subject,
      title: state.title,
      mainTopic: state.mainTopic,
      currentTopics: state.topics,
      prevScore: state.previousSession.sessionScore,
      prevTopics: state.previousSession.sessionTopics,
      prevQuizQuestions: state.previousSession.quizQuestions.map((q: any) => ({
        subtopic: q.subtopic,
        question: q.question,
      }))
    });

    return { evaluation: result.evaluation };

  } else {
    console.log('🆕 Using evaluation prompt for first-time session');
    const evaluationChain = evaluationFirstSessionPrompt.pipe(llm.withStructuredOutput(EvaluationSchema));
    const result = await evaluationChain.invoke({
      studentName: state.studentName,
      subject: state.subject,
      title: state.title,
      mainTopic: state.mainTopic,
      summary: state.summary,
      currentTopics: state.topics,
    });

    return { evaluation: result.evaluation };
  }
}

// Quiz generation node
export async function quizNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log('❓ Generating quiz...');
  
  const quizChain = quizGenerationPrompt.pipe(llm.withStructuredOutput(QuizSchema));
  
  const result = await quizChain.invoke({
    subject: state.subject,
    mainTopic: state.mainTopic,
    topics: state.topics,
    evaluation: state.evaluation || "",
  });
  
  console.log('✅ Quiz generated successfully');
  
  return { quiz: result.quiz };
}
