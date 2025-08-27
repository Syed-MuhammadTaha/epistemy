import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession, getQuizQuestionsBySessionId, getQuizAttempt, hasAttemptedQuiz } from "@/lib/data";
import { submitQuiz } from "./actions";
import { Brain, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string; sessionId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentSessionPage({ params, searchParams }: PageProps): Promise<React.ReactNode> {
  const { id: studentId, sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) notFound();

  const questions = await getQuizQuestionsBySessionId(sessionId);
  const attempted = await hasAttemptedQuiz(sessionId, studentId);
  const existingAttempt = attempted ? await getQuizAttempt(sessionId, studentId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/student/${studentId}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Epistemy</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview (title, status, date, subject, main topic) */}
        <Card>
          <CardHeader>
            <CardTitle>{session.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-3">
                <Badge variant={session.status === 'published' ? 'default' : session.status === 'processing' ? 'secondary' : 'outline'}>
                  {session.status}
                </Badge>
                <span className="text-xs text-gray-600">{new Date(session.date).toLocaleDateString()}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Subject:</strong> {session.subject}</div>
              <div><strong>Main topic:</strong> {session.main_topic}</div>
            </div>
          </CardContent>
        </Card>

        {/* Topics and Progress side-by-side to mirror tutor layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Session Topics</CardTitle>
              <CardDescription>Key topics covered in this session</CardDescription>
            </CardHeader>
            <CardContent>
              {session.topics && session.topics.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {session.topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No topics listed.</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progress Evaluation</CardTitle>
              <CardDescription>Overview of your learning progress for this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-gray-800 text-sm">
                {session.progress_feedback || 'No progress added yet.'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Quiz</CardTitle>
            <CardDescription>
              {attempted ? `Your score: ${existingAttempt?.score_percentage}% (${existingAttempt?.total_questions} questions)` : "Attempt once. Your first submission will be recorded."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!attempted ? (
              <form action={submitQuiz.bind(null, studentId, sessionId)} className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="border rounded-lg p-4 space-y-3">
                    <div className="text-sm text-gray-600"><strong>Subtopic:</strong> {q.subtopic}</div>
                    <div className="font-medium">{idx + 1}. {q.question}</div>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className="flex items-center gap-2 text-sm">
                          <input type="radio" name={`q_${idx}_choice`} value={optIdx} required />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Submit Quiz
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="border rounded-lg p-4 space-y-3">
                    <div className="text-sm text-gray-600"><strong>Subtopic:</strong> {q.subtopic}</div>
                    <div className="font-medium">{idx + 1}. {q.question}</div>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`text-sm ${optIdx === q.correct_answer ? 'text-green-700' : 'text-gray-800'}`}>
                          {optIdx === q.correct_answer ? '✓ ' : ''}{opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
                {existingAttempt && (
                  <div className="text-sm text-gray-700">
                    Final score: {existingAttempt.score_percentage}% ({existingAttempt.total_questions} questions)
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}