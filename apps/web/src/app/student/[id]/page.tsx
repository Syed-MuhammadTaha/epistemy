import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStudentById, getSessionsForStudent } from "@/lib/data";
import { attachSessionToStudent, markSessionPaid } from "./actions";
import { Lock, CreditCard, Eye, ArrowLeft, Brain } from "lucide-react";
import { StudentToasts } from "@/components/StudentToasts";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentDashboard({ params, searchParams }: PageProps): Promise<React.ReactNode> {
  const { id: studentId } = await params;
  const sp = (await searchParams) || {};
  const attached = typeof sp.attached === 'string' ? sp.attached : undefined;
  const error = typeof sp.error === 'string' ? sp.error : undefined;
  const paid = typeof sp.paid === 'string' ? sp.paid : undefined;

  const student = await getStudentById(studentId);
  if (!student) {
    notFound();
  }

  const sessions = await getSessionsForStudent(studentId);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentToasts attached={attached} error={error} paid={paid} />
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Epistemy</h1>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-900">Welcome, {student.display_name}</h2>
              <p className="text-sm text-gray-600">Manage your sessions and access learning resources</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Attach Session via Link */}
        <Card>
          <CardHeader>
            <CardTitle>Enroll in a Session</CardTitle>
            <CardDescription>Paste the session link provided by your tutor to enroll</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={attachSessionToStudent.bind(null, studentId)} className="flex gap-2">
              <Input name="session_link" placeholder="Paste session link or ID" className="flex-1" />
              <Button type="submit">Enroll</Button>
            </form>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
            <CardDescription>Access your enrolled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.length === 0 && (
                <p className="text-sm text-gray-600">No sessions yet. Paste a link above to enroll in one.</p>
              )}
              {sessions.map((session) => {
                const locked = !session.is_paid;
                return (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                          <Badge variant={session.status === 'published' ? 'default' : session.status === 'processing' ? 'secondary' : 'outline'}>
                            {session.status}
                          </Badge>
                          <Badge variant={session.is_enrolled ? 'default' : 'secondary'}>
                            {session.is_enrolled ? 'Enrolled' : 'Not Enrolled'}
                          </Badge>
                          <Badge variant={session.is_paid ? 'default' : 'destructive'}>
                            {session.is_paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Subject:</strong> {session.subject}</p>
                          <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                          {session.topics && session.topics.length > 0 && (
                            <p><strong>Topics:</strong> {session.topics.slice(0, 2).join(', ')}{session.topics.length > 2 ? ` +${session.topics.length - 2} more` : ''}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        {locked ? (
                          <Button size="sm" variant="outline" disabled>
                            <Lock className="mr-1 h-3 w-3" />
                            View Session
                          </Button>
                        ) : (
                          <Link href={`/student/${studentId}/session/${session.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="mr-1 h-3 w-3" />
                              View Session
                            </Button>
                          </Link>
                        )}
                        {!session.is_paid && (
                          <form action={markSessionPaid.bind(null, studentId)}>
                            <input type="hidden" name="session_id" value={session.id} />
                            <Button size="sm" variant="default">
                              <CreditCard className="mr-1 h-3 w-3" />
                              Pay Now
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
