Here’s how it fits together for your MVP:
Evaluation Pipeline (MVP-Friendly)
Topic extraction
From current session transcript → extract main subject + subtopics.
From previous session transcript → extract main subject + subtopics.
Score recall
Pull the previous quiz score (overall percentage).
Note which topics the quiz was based on.
Progress evaluation
Compare topics overlap (continuity vs. new material).
Reference previous quiz score:
If score was high → say “understanding was reinforced through the quiz” and that today’s topics built upon it.
If score was low → say “some gaps identified in the quiz can be addressed alongside today’s topics.”
Quiz/question generation (progression-aware)
Based on today’s subtopics.
Bias the difficulty slightly depending on last score (higher score → harder questions, lower score → reinforcement of basics).
What should you target in evaluation?
Keep it simple and session-focused:
✅ Mention what was covered previously (topics + quiz performance).
✅ Mention what was covered now (topics).
✅ Connect them: did the new session build upon, reinforce, or diverge from the previous one?
✅ Give a short progress note (e.g., “stronger understanding of algebra compared to last week” or “geometry basics introduced after reviewing algebra foundations”).
System prompt strategy
Don’t compare the whole transcript → that’s too noisy.
Instead, compare topics + quiz score + teacher’s notes (optional).
You can pass in a structured summary like:
{
  "previous_topics": ["Linear Equations", "Fractions"],
  "previous_score": "72%",
  "current_topics": ["Quadratic Equations", "Factorization"],
  "current_transcript": "..."
}
Then let the LLM generate:
Evaluation summary (progress, reinforcement, gaps).
Quiz (3–5 questions).
👉 This way, the score isn’t mandatory every time, but when it’s there, it grounds the evaluation in measurable progress.
Do you want me to draft a sample evaluation output that ties together previous topics + quiz score + current topics so you can see how it looks in practice?



