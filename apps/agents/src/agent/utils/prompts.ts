/**
 * Prompt templates for different workflow nodes
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const cleanTranscriptPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert assistant that cleans and preprocesses tutoring transcripts.
    
    Transcript to clean:
    {rawTranscript}
    
    Your task:
    - Remove irrelevant small talk, greetings, and casual chatter (e.g., "How are you?", "scroll up", "wait")
    - Eliminate incomplete, incoherent, or redundant fragments that don't contribute to the educational flow
    - Keep all educational content intact: questions, explanations, problem-solving steps, examples, and strategies
    - Normalize formatting into clear, readable sentences
    - Do NOT summarize; keep as much relevant detail as possible, only cleaner


    Return the cleaned transcript as a JSON object.
    
    `);
    
    

    // Map (chunk) prompt — returns only JSON with no extra text
export const mapTranscriptPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert tutor’s assistant. You are given a transcript chunk from an educational session.
    
    CHUNK: {chunk}

    This is **only a partial segment**, so avoid making global assumptions about the entire session.
    Focus on capturing **local knowledge** from this chunk only.

    Analyze this chunk to extract:
    - summary: A concise, factual local summary of this chunk
    - subject: The academic subject (must be one of: "math", "physics", "chemistry", "english", "cs")
    - mainTopic: The main topic discussed in this chunk
    - topics: An array of key subtopics mentioned in this chunk
    
    Rules:
    1. Return ONLY the JSON object. No explanations, no trailing text.
    3. The "summary" must focus on educational content: student question(s), tutor explanation(s), examples, problem-solving methods. Exclude navigation, filler, greetings, or short back-and-forth.
    4. "mainTopic" must be the single most central idea in this chunk (do not invent global titles).
    5. "topics" must be **conceptual** tags (e.g., "graph interpretation", "elimination strategies", "reading comprehension", "biodiversity example"). Do NOT include raw numbers, dates, or filler phrases.
    6. Do NOT hallucinate facts or invent content not grounded in the chunk. If an example is mentioned verbatim (e.g., "Lake Abel"), you may include a normalized tag such as "biodiversity example".
    7. Keep all strings short and canonical (prefer lowercase, hyphen or space separated is acceptable).
    
    `);


    

// Summary generation prompt
// Reduce prompt: aggregate multiple chunks
export const reduceSummaryPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert tutor’s assistant. You have been given summaries of multiple transcript chunks. 
    Each chunk already has a local summary, subject, main topic, and subtopics.
    
    Your task: **Aggregate all chunks into one coherent, global session summary**.
    
    Here are the chunks:
    {chunks}
    
    Use these rules:
    1. **Identify a single universal subject** of the session. (Must be one of: physics, math, cs, english, chemistry).  
       - If multiple subjects are present, pick the **dominant one** based on chunk frequency and content weight.  
    2. **Merge the summaries** into one global summary:
       - Preserve important concepts and learning objectives.
       - Remove redundancy and contradictions.
       - Ensure clarity and coherence as if written from scratch.  
    3. **Extract the overall mainTopic** that best represents the session.  
       - This should be broad enough to encompass the session’s purpose.  
    4. **Merge all subtopics into a structured list**:
       - Deduplicate overlapping subtopics.
       - Keep hierarchy clear (from general to specific).  
    5. **Extract the title** of the session.
    6. Output the final result in the JSON

    
    `);


export const evaluationWithHistoryPrompt = ChatPromptTemplate.fromTemplate(`
    You are an academic learning evaluator tasked with analyzing a tutoring session for {studentName}.
    
    Student: {studentName}
    Subject: {subject}
    Session Title: {title}
    Main Topic: {mainTopic}
    
    Current Session Subtopics:
    {currentTopics}
    
    Previous Session Score: {prevScore}%
    Previous Session Subtopics:
    {prevTopics}
    
    Previous Session Quiz Questions (each with its subtopic):
    {prevQuizQuestions}
    
    INSTRUCTIONS
    1. Compare the **current session subtopics** with the **previous session subtopics**.  
        - Identify which subtopics were **revisited** and which are **newly introduced**.  
        - Normalize strings when comparing (ignore case, punctuation, minor phrasing differences).
    
    2. For each current subtopic:
        - Check if it had corresponding quiz questions in the previous session (use the \`subtopic\` field of each quiz question).  
        - Use the **previous score** and the correctness of quiz coverage to determine mastery.  
            - High score (≥80) with prior coverage → likely strong mastery.  
            - Mid score (50–79) → needs some review.  
            - Low score (<50) → likely needs reinforcement.  
        - If no prior question exists for a subtopic → classify as new learning or insufficient evidence.  
    
    3. Base your evaluation on **both the subtopic overlap** and the **score + quiz evidence**.  
        Be specific about strengths and weaknesses.
    
    4. Address {studentName} by name in the final evaluation summary, then use "you" afterwards.  
    Keep the tone supportive and instructional.

    Return the final result in the JSON
    `);


export const evaluationFirstSessionPrompt = ChatPromptTemplate.fromTemplate(`
    You are an academic learning evaluator tasked with creating a baseline evaluation for {studentName}.
    
    Student: {studentName}
    Subject: {subject}
    Session Title: {title}
    Main Topic: {mainTopic}
    
    Session Summary:
    {summary}
    
    Current Session Subtopics:
    {currentTopics}
    
    INSTRUCTIONS
    1. Since this is the first recorded session, there is no prior history or score to compare against.  
    2. For each current subtopic, determine its instructional role based on the session summary context:  
        - "Introduced" (first exposure to concept)  
        - "Practiced" (worked on examples or exercises)  
        - "Reinforced" (reviewed/strengthened existing knowledge)  
        - "Struggled" (explicit confusion or repeated clarification observed).  
    
    3. Provide a baseline evaluation that highlights {studentName}’s starting point in {subject}, the significance of the main topic "{mainTopic}", and the role of each subtopic.  
    4. Address {studentName} by name once in the summary, then use "you" afterwards.  
    Keep the evaluation concise, educational, and constructive.

    Return the final result in the JSON
    `);
    
    

    export const quizGenerationPrompt = ChatPromptTemplate.fromTemplate(`
        You are an expert quiz generator. Based on the following session context, generate 3–5 multiple-choice quiz questions.
        
        Session Context:
        Subject: {subject}
        Main Topic: {mainTopic}
        Subtopics: {topics}
        Evaluation Summary: {evaluation}
        
        INSTRUCTIONS
        1. Each quiz question must strictly follow the QuizQuestion schema:
           - question: A clear and concise question.
           - options: Four multiple-choice options (A, B, C, D).
           - correctAnswer: Index of the correct option (0-3).
           - explanation: Short educational explanation for the correct answer.
           - subtopic: The specific subtopic the question targets.
        
        2. Ground all questions in the subject ({subject}), ensuring alignment with the main topic and subtopics.
        
        3. Questions should reflect the session evaluation:  
           - If a subtopic was introduced → test basic understanding.  
           - If practiced → test applied examples.  
           - If reinforced → test deeper knowledge.  
           - If struggled → test conceptual clarity in a supportive way.
        
        4. Output only the array of QuizQuestion objects (no extra text).  

        Return the final result in the JSON
        `);
        