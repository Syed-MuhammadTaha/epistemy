import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getSession, getStudentBySessionId, getQuizQuestionsBySessionId } from "@/lib/data";
import { notFound } from "next/navigation";
import { 
  Save, 
  FileDown, 
  Copy, 
  Plus,
  Loader2
} from "lucide-react";
import { saveSessionTopics, saveSessionProgress, saveQuizQuestions } from "@/app/tutor/[id]/session/[sessionId]/actions";
import { ShareLink } from "@/components/share-link";
import Link from "next/link";

export async function SessionHeader({ tutorId, sessionId }: { tutorId: string, sessionId: string }) {
  const [session, student] = await Promise.all([
    getSession(sessionId),
    getStudentBySessionId(sessionId)
  ]);

  if (!session) {
    notFound();
  }

  const shareUrl = session.share_link || `/session/${sessionId}`;
  const isProcessing = session.status === 'processing';

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {isProcessing ? 'Processing Session...' : (session.title || 'Untitled Session')}
            </h1>
            {isProcessing && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI Processing
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span><strong>Student:</strong> {student?.display_name || 'Unassigned'}</span>
            <span><strong>Subject:</strong> {session.subject || 'Processing...'}</span>
            <span><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</span>
            <Badge variant={session.is_paid ? 'default' : 'destructive'}>
              {session.is_paid ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {!isProcessing && (
            <>
              <Link href={`/tutor/${tutorId}/session/${sessionId}/export`} target="_blank">
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </Link>
              <ShareLink link={shareUrl} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export async function TopicsList({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const session = await getSession(sessionId);
  if (!session) return null;

  const isProcessing = session.status === 'processing';

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Session Topics</CardTitle>
        <CardDescription>
          {isProcessing ? 'AI is analyzing the transcript to extract topics...' : 'Key topics covered in this session'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Extracting topics from transcript...</p>
            </div>
          </div>
        ) : (
          <form id={`session-topics-${sessionId}`} action={saveSessionTopics.bind(null, tutorId, sessionId)} className="space-y-4">
            <input type="hidden" name="session_id" value={sessionId} />
            {session.topics.length > 0 ? (
              session.topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    name={`topic_${index}`}
                    defaultValue={topic}
                    placeholder="Enter topic"
                    className="flex-1"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No topics available</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" variant="default">
                <Save className="mr-2 h-4 w-4" />
                Save Topics
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export async function ProgressFeedback({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const session = await getSession(sessionId);
  if (!session) return null;

  const isProcessing = session.status === 'processing';

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Progress Evaluation</CardTitle>
        <CardDescription>
          {isProcessing ? 'AI is evaluating student progress...' : 'Detailed feedback on student progress and areas for improvement'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Analyzing student progress...</p>
            </div>
          </div>
        ) : (
          <form id={`session-progress-${sessionId}`} action={saveSessionProgress.bind(null, tutorId, sessionId)} className="space-y-4">
            <Textarea
              name="progress_feedback"
              defaultValue={session.progress_feedback || ''}
              placeholder="Enter detailed progress feedback..."
              className="min-h-[200px]"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="default">
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export async function QuizSection({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const [session, questions] = await Promise.all([
    getSession(sessionId),
    getQuizQuestionsBySessionId(sessionId)
  ]);

  if (!session) return null;

  const isProcessing = session.status === 'processing';

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Practice Quiz</CardTitle>
            <CardDescription>
              {isProcessing ? 'AI is generating practice questions...' : 'Generated questions based on session content'}
            </CardDescription>
          </div>
          {!isProcessing && questions.length > 0 && (
            <Button type="submit" form={`quiz-form-${sessionId}`}>
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Generating practice questions...</p>
            </div>
          </div>
        ) : questions.length > 0 ? (
          <form id={`quiz-form-${sessionId}`} action={saveQuizQuestions.bind(null, tutorId, sessionId)} className="space-y-8">
            <input type="hidden" name="session_id" value={sessionId} />
            <input type="hidden" name="questions_count" value={`${questions.length}`} />
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">
                    Question {questionIndex + 1}
                  </Label>
                  <Badge variant="secondary">{question.subtopic}</Badge>
                </div>
                
                <div className="space-y-4">
                  <input type="hidden" name={`q_${questionIndex}_id`} defaultValue={question.id} />
                  <div>
                    <Label htmlFor={`q_${questionIndex}_question`}>Question</Label>
                    <Input
                      id={`q_${questionIndex}_question`}
                      name={`q_${questionIndex}_question`}
                      defaultValue={question.question}
                      placeholder="Enter the question"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-2 mt-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`q_${questionIndex}_correct`}
                            defaultChecked={question.correct_answer === optionIndex}
                            value={optionIndex}
                            className="text-blue-600"
                          />
                          <Input
                            name={`q_${questionIndex}_opt_${optionIndex}`}
                            defaultValue={option}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`q_${questionIndex}_subtopic`}>Subtopic</Label>
                    <Input
                      id={`q_${questionIndex}_subtopic`}
                      name={`q_${questionIndex}_subtopic`}
                      defaultValue={question.subtopic}
                      placeholder="Subtopic"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`q_${questionIndex}_explanation`}>Explanation</Label>
                    <Textarea
                      id={`q_${questionIndex}_explanation`}
                      name={`q_${questionIndex}_explanation`}
                      defaultValue={question.explanation}
                      placeholder="Explain the correct answer"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </form>
        ) : (
          <p className="text-gray-500 text-center py-8">No quiz questions available</p>
        )}
      </CardContent>
    </Card>
  );
}
