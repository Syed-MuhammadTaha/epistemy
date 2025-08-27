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
  Plus
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

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span><strong>Student:</strong> {student?.display_name || 'Unassigned'}</span>
            <span><strong>Subject:</strong> {session.subject}</span>
            <span><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</span>
            <Badge variant={session.is_paid ? 'default' : 'destructive'}>
              {session.is_paid ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/tutor/${tutorId}/session/${sessionId}/export`} target="_blank">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </Link>
          <ShareLink link={shareUrl} />
        </div>
      </div>
    </div>
  );
}

export async function TopicsList({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const session = await getSession(sessionId);
  if (!session) return null;

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Session Topics</CardTitle>
        <CardDescription>Key topics covered in this session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form id={`session-topics-${sessionId}`} action={saveSessionTopics.bind(null, tutorId, sessionId)} className="space-y-4">
          <input type="hidden" name="session_id" value={sessionId} />
          {session.topics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                name={`topic_${index}`}
                defaultValue={topic}
                placeholder="Enter topic"
                className="flex-1"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit" variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save Topics
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export async function ProgressFeedback({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const session = await getSession(sessionId);
  if (!session) return null;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Progress Evaluation</CardTitle>
        <CardDescription>
          Detailed feedback on student progress and areas for improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form id={`session-progress-${sessionId}`} action={saveSessionProgress.bind(null, tutorId, sessionId)} className="space-y-4">
          <Textarea
            name="progress_feedback"
            defaultValue={session.progress_feedback}
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
      </CardContent>
    </Card>
  );
}

export async function QuizSection({ sessionId, tutorId }: { sessionId: string, tutorId: string }) {
  const questions = await getQuizQuestionsBySessionId(sessionId);

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Practice Quiz</CardTitle>
            <CardDescription>
              Generated questions based on session content
            </CardDescription>
          </div>
          <Button type="submit" form={`quiz-form-${sessionId}`}>
            <Save className="mr-2 h-4 w-4" />
            Save Quiz
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
