/**
 * Node implementations for the workflow
 */
import postgres from 'postgres';
import { RunnableConfig } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import {
  WorkflowState,
  WorkflowUpdate,
  TopicsSchema,
  SummarySchema,
  EvaluationSchema,
  QuizSchema
} from "./state.js";
import {
  summaryPrompt,
  topicsPrompt,
  evaluationWithHistoryPrompt,
  quizGenerationPrompt,
  evaluationFirstSessionPrompt
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
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

// Clean transcript node (no LLM needed)
export async function cleanTranscriptNode(
    state: WorkflowState,
    _config: RunnableConfig,
  ): Promise<WorkflowUpdate> {
    console.log("🧹 Cleaning transcript...");
  
    let text = state.transcript;
  
    const cleanedTranscript = text
      // 1. Remove timestamps in multiple formats
      .replace(/\[?\(?\d{1,2}:\d{2}(?::\d{2})?\)?\]?/g, "")
      // 2. Remove common transcription artifacts (inaudible, applause, etc.)
      .replace(/\[(inaudible|crosstalk|music|applause|laughter|noise)\]/gi, "")
      .replace(/\((inaudible|crosstalk|music|applause|laughter|noise)\)/gi, "")
      // 3. Remove speaker labels (e.g., "John:", "Speaker 1:")
      .replace(/^[A-Z][a-zA-Z0-9_ ]{0,20}:\s*/gm, "")
      // 4. Remove filler words
      .replace(/\b(um+|uh+|like|you know|i mean|sort of|kind of|ya know)\b/gi, "")
      // 5. Collapse ellipses, excessive punctuation
      .replace(/\.{2,}/g, ".")
      .replace(/!{2,}/g, "!")
      .replace(/\?{2,}/g, "?")
      .replace(/([!?]){2,}/g, "$1")
      // 6. Remove stray characters (—, *, #, etc.)
      .replace(/[*#_~^`]/g, "")
      // 7. Normalize whitespace
      .replace(/\s+/g, " ")
      // 8. Fix spacing before punctuation
      .replace(/\s+([,.!?;:])/g, "$1")
      // 9. Trim leading/trailing spaces
      .trim();
  
    console.log("✅ Transcript cleaned successfully");
  
    return { cleanedTranscript };
  }
  

// Summary generation node
export async function summaryNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log('📝 Generating summary...');
  
  const summaryChain = summaryPrompt.pipe(llm.withStructuredOutput(SummarySchema));
  
  const result = await summaryChain.invoke({
    cleanedTranscript: state.cleanedTranscript || ""
  });
  
  console.log('✅ Summary generated successfully');
  
  return { summary: result.summary };
}

// Topics extraction node
export async function topicsNode(
  state: WorkflowState,
  _config: RunnableConfig,
): Promise<WorkflowUpdate> {
  console.log("🏷️ Extracting topics...");

  const topicsChain = topicsPrompt.pipe(
    llm.withStructuredOutput(TopicsSchema)
  );

  const result = await topicsChain.invoke({
    summary: state.summary || ""
  });

  console.log("✅ Topics extracted successfully");

  return {
    title: result.title,
    subject: result.subject,
    mainTopic: result.mainTopic,
    topics: result.subTopics,
  };
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
      LIMIT 1
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
