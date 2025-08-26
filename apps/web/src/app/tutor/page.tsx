"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockSessions, getTutor, getStudentBySessionId, updateTutorCalendlyLink } from "@/lib/data";
import { 
  Upload, 
  Calendar, 
  FileText, 
  Edit, 
  Share2, 
  Brain, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Save
} from "lucide-react";

export default function TutorDashboard(): React.ReactNode {
  const tutor = getTutor();
  const [calendlyLink, setCalendlyLink] = useState(tutor.calendlyLink || '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempLink, setTempLink] = useState(calendlyLink);

  const handleSaveLink = () => {
    setCalendlyLink(tempLink);
    setIsEditing(false);
    // Update the shared tutor info (in a real app, this would be an API call)
    updateTutorCalendlyLink(tempLink);
  };

  const handleCancelEdit = () => {
    setTempLink(calendlyLink);
    setIsEditing(false);
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
              <h2 className="text-lg font-semibold text-gray-900">{tutor.displayName}</h2>
              <p className="text-sm text-gray-600">{tutor.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
            <p className="text-gray-600">Manage your tutoring sessions and track student progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Link href="/tutor/upload">
              <Button className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Session
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSessions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Sessions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockSessions.filter(s => s.isPaid).length}
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
                  <p className="text-sm font-medium text-gray-600">Unpaid Sessions</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockSessions.filter(s => !s.isPaid).length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(mockSessions.filter(s => s.studentId).map(s => s.studentId)).size}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendly Link Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Calendly Link Management
            </CardTitle>
            <CardDescription>
              Update your Calendly link for student session bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="calendly-link">Calendly Link</Label>
                {isEditing ? (
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="calendly-link"
                      type="url"
                      value={tempLink}
                      onChange={(e) => setTempLink(e.target.value)}
                      placeholder="https://calendly.com/your-username/session"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveLink} size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="calendly-link"
                      type="url"
                      value={calendlyLink}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={calendlyLink} target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Test Link
                      </a>
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                This link will be used by students to book new tutoring sessions with you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              Manage and review your tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSessions.map((session) => (
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
                          {session.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Student:</strong> {getStudentBySessionId(session.id)?.displayName || 'Unassigned'}</p>
                        <p><strong>Subject:</strong> {session.subject}</p>
                        <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                        {session.topics.length > 0 && (
                          <p><strong>Topics:</strong> {session.topics.slice(0, 2).join(", ")}
                            {session.topics.length > 2 && ` +${session.topics.length - 2} more`}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col gap-2">
                      <Link href={`/tutor/session/${session.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      {session.shareLink && (
                        <Link href={session.shareLink}>
                          <Button size="sm" variant="outline">
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
