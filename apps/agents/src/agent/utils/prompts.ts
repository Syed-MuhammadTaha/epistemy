/**
 * Prompt templates for different workflow nodes
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Summary generation prompt
export const summaryPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert tutor’s assistant specializing in summarizing educational sessions.
    
    Your task is to summarize the following transcript of a tutoring session:
    
    {cleanedTranscript}
    
    The summary should serve as a foundation for later steps such as subject classification, topic extraction, progress evaluation, and quiz generation.
    
    When writing the summary:
    - Identify and clearly list the **main topics** the tutor and student discussed.  
    - Highlight the **key concepts explained** or demonstrated, avoiding repetition or irrelevant chit-chat.  
    - Emphasize the **learning objectives achieved**, i.e., what the student was expected to understand or practice by the end of the session.  
    - If applicable, note **problem-solving methods**, examples, or strategies introduced by the tutor.  
    - Keep the summary **concise, factual, and educational**, avoiding filler or conversational details.  
    `);
    
// Topic extraction prompt
export const topicsPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert at analyzing tutoring session summaries and extracting structured educational metadata.
    
    Given the session summary:
    
    {summary}
    
    Extract the following:
    - **Title**: A short, descriptive agenda or title for the session (e.g., "Practice with Quadratic Equations" or "Reading Comprehension Strategies").  
    - **Subject**: The overall subject area (must be one of: physics, math, cs, english, chemistry).  
    - **Main Topic**: The primary topic of discussion within the subject (e.g., for math → "quadratic equations", for english → "essay writing").  
    - **SubTopics**: A list of supporting or secondary concepts covered in the session.
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
        `);
        