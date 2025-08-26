"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedSessions, getTutor, updateSessionPaymentStatus } from "@/lib/data";
import { 
  ArrowLeft, 
  Brain, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  CreditCard,
  Lock
} from "lucide-react";

export default function StudentVault(): React.ReactNode {
  // Get published sessions that students can see
  const publishedSessions = getPublishedSessions();
  const [sessions, setSessions] = useState(publishedSessions);
  const tutor = getTutor();

  const handlePayNow = (sessionId: string) => {
    updateSessionPaymentStatus(sessionId, true);
    // Update local state to reflect the change
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId 
          ? { ...session, isPaid: true }
          : session
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
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
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Vault</h1>
            <p className="text-gray-600">Access your tutoring sessions, feedback, and practice quizzes</p>
          </div>

        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sessions.filter(s => s.status === 'published').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(sessions.map(s => s.subject)).size}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quiz Questions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {sessions.reduce((total, session) => total + session.quiz.length, 0)}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
            <CardDescription>
              Review your session content, feedback, and practice with quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-6">
                  Your tutor will share session content with you after each tutoring session.
                </p>
<p className="text-gray-500">
                  Your tutor will provide booking links within each session.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.title}
                          </h3>
                          <Badge 
                            variant={session.status === 'published' ? 'default' : 
                                    session.status === 'processing' ? 'secondary' : 'outline'}
                          >
                            {session.status === 'published' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {session.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                            {session.status}
                          </Badge>
                          <Badge variant={session.isPaid ? 'default' : 'destructive'}>
                            {session.isPaid ? 'Paid' : 'Payment Pending'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Subject:</strong> {session.subject}</p>
                          <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                          <p><strong>Tutor:</strong> {tutor.displayName}</p>
                          {session.topics.length > 0 && (
                            <p><strong>Topics Covered:</strong> {session.topics.slice(0, 3).join(", ")}
                              {session.topics.length > 3 && ` +${session.topics.length - 3} more`}
                            </p>
                          )}
                          <p><strong>Practice Questions:</strong> {session.quiz.length} questions available</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {session.isPaid ? (
                          <Link href={`/student/${session.id}`}>
                            <Button>
                              <Eye className="mr-2 h-4 w-4" />
                              View Session
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled variant="outline">
                            <Lock className="mr-2 h-4 w-4" />
                            Session Locked
                          </Button>
                        )}
                        {!session.isPaid && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handlePayNow(session.id)}
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subjects Overview */}
        {sessions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Learning Journey</CardTitle>
              <CardDescription>
                Track your progress across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(sessions.map(s => s.subject))).map((subject) => {
                  const subjectSessions = sessions.filter(s => s.subject === subject);
                  const totalQuestions = subjectSessions.reduce((total, session) => total + session.quiz.length, 0);
                  
                  return (
                    <div key={subject} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{subject}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{subjectSessions.length} sessions</p>
                        <p>{totalQuestions} practice questions</p>
                        <p>{subjectSessions.filter(s => s.status === 'published').length} published</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready for your next session?</h3>
            <p className="text-blue-700">
              Access individual sessions above to find booking links from {tutor.displayName}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
