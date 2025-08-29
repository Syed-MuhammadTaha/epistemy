/**
 * LangGraph integration for the web app
 */

export interface LangGraphInput {
  transcript: string;
  studentId: string;
  tutorId: string;
  studentName: string;
}

export interface LangGraphResult {
  title: string;
  subject: 'physics' | 'math' | 'cs' | 'english' | 'history' | 'science';
  mainTopic: string;
  topics: string[];
  evaluation: string;
  quiz: Array<{
    subtopic: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

/**
 * Invoke the LangGraph agent workflow
 * This function calls the LangGraph API endpoint
 */
export async function invokeLangGraphAgent(input: LangGraphInput): Promise<LangGraphResult> {
  try {
    console.log('Invoking LangGraph agent...', input);
    
    // Step 1: Create a new thread
    const threadResponse = await fetch('http://localhost:2024/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!threadResponse.ok) {
      throw new Error(`Failed to create thread: ${threadResponse.status} ${threadResponse.statusText}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.thread_id;
    console.log('Created thread:', threadId);

    // Step 2: Create a run with the input
    const runResponse = await fetch(`http://localhost:2024/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistant_id: "agent",
        input: {
          transcript: input.transcript,
          studentId: input.studentId,
          tutorId: input.tutorId,
          studentName: input.studentName
        }
      }),
    });

    if (!runResponse.ok) {
      throw new Error(`Failed to create run: ${runResponse.status} ${runResponse.statusText}`);
    }

    const run = await runResponse.json();
    const runId = run.run_id;
    console.log('Created run:', runId);

    // Step 3: Poll for run completion
    let finalResult: any = null;
    let attempts = 0;
    const maxAttempts = 60; // Wait up to 5 minutes (5s intervals)

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;

      const statusResponse = await fetch(`http://localhost:2024/threads/${threadId}/runs/${runId}`);
      if (!statusResponse.ok) {
        console.warn(`Failed to check run status: ${statusResponse.status}`);
        continue;
      }

      const runStatus = await statusResponse.json();
      console.log(`Run status (attempt ${attempts}):`, runStatus.status);

      if (runStatus.status === 'completed' || runStatus.status === 'success') {
        // Get the run output from the thread's values field
        const threadResponse = await fetch(`http://localhost:2024/threads/${threadId}`);
        if (threadResponse.ok) {
          const thread = await threadResponse.json();
          finalResult = thread.values; // The output is stored in thread.values
          break;
        }
      } else if (runStatus.status === 'error') {
        throw new Error(`LangGraph run failed: ${JSON.stringify(runStatus)}`);
      }
    }

    if (!finalResult) {
      throw new Error('LangGraph run did not complete within the expected time');
    }

    console.log('LangGraph final result:', finalResult);
    
    // Transform the result to match our expected format
    return {
      title: finalResult.title || 'Untitled Session',
      subject: finalResult.subject || 'science',
      mainTopic: finalResult.mainTopic || 'General Topic',
      topics: finalResult.topics || [],
      evaluation: finalResult.evaluation || 'No evaluation available',
      quiz: finalResult.quiz || []
    };
  } catch (error) {
    console.error('Failed to invoke LangGraph agent:', error);
    throw new Error('Failed to process session with AI agent. Please try again.');
  }
}

/**
 * Check if the LangGraph service is running
 */
export async function checkLangGraphHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:2024/health', {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('LangGraph health check failed:', error);
    return false;
  }
}
