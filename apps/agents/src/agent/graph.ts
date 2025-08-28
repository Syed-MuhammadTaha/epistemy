/**
 * Main workflow graph orchestration
 */
import { StateGraph } from "@langchain/langgraph";
import {
  WorkflowAnnotation,
  cleanTranscriptNode,
  summaryNode,
  topicsNode,
  evaluationNode,
  quizNode,
  previousSessionNode
} from "./utils/index.js";

// Define the complete workflow
const workflow = new StateGraph(WorkflowAnnotation)
  // Add all nodes
  .addNode("cleanTranscript", cleanTranscriptNode)
  .addNode("generateSummary", summaryNode)
  .addNode("extractTopics", topicsNode)
  .addNode("fetchPreviousSession", previousSessionNode)
  .addNode("evaluateProgress", evaluationNode)
  .addNode("generateQuiz", quizNode)
  
  // Define the execution flow
  .addEdge("__start__", "cleanTranscript")
  .addEdge("cleanTranscript", "generateSummary")
  .addEdge("generateSummary", "extractTopics")
  .addEdge("extractTopics", "fetchPreviousSession")
  .addEdge("fetchPreviousSession", "evaluateProgress")
  .addEdge("evaluateProgress", "generateQuiz")
  .addEdge("generateQuiz", "__end__");

// Compile and export the graph
export const graph = workflow.compile({
  interruptBefore: [], 
  interruptAfter: [],
});