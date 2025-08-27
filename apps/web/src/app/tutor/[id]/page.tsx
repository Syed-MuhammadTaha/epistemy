import React, { Suspense } from "react";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getTutorById, getSessionsForTutor, getStudentById } from "@/lib/data";
import { updateCalendlyLink } from "./actions";
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
import { ShareLink } from "@/components/share-link";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Skeleton components
function TutorHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendlyFormSkeleton() {
  return (
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
            <div className="flex gap-2 mt-2">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-80" />
        </div>
      </CardContent>
    </Card>
  );
}

function SessionsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>
          Manage and review your tutoring sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Async data components
async function TutorHeader({ tutorId }: { tutorId: string }) {
  const tutor = await getTutorById(tutorId);
  
  if (!tutor) {
    notFound();
  }

  return (
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
        <h2 className="text-lg font-semibold text-gray-900">{tutor.display_name}</h2>
        <p className="text-sm text-gray-600">{tutor.email}</p>
      </div>
    </div>
  );
}

async function StatsOverview({ tutorId }: { tutorId: string }) {
  const sessions = await getSessionsForTutor(tutorId);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
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
                {sessions.filter(s => s.is_paid).length}
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
                {sessions.filter(s => !s.is_paid).length}
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
                {new Set(sessions.filter(s => s.student_id).map(s => s.student_id)).size}
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function CalendlyForm({ tutorId }: { tutorId: string }) {
  const tutor = await getTutorById(tutorId);
  
  if (!tutor) return null;

  return (
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
        <form action={updateCalendlyLink.bind(null, tutor.id)} className="space-y-4">
          <div>
            <Label htmlFor="calendly-link">Calendly Link</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="calendly-link"
                name="calendlyLink"
                type="url"
                defaultValue={tutor.calendly_link || ''}
                placeholder="https://calendly.com/your-username/session"
                className="flex-1"
                required
              />
              <Button type="submit" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              {tutor.calendly_link && (
                <Button variant="outline" size="sm" asChild>
                  <a href={tutor.calendly_link} target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Test Link
                  </a>
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            This link will be used by students to book new tutoring sessions with you.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

async function SessionsList({ tutorId }: { tutorId: string }) {
  const sessions = await getSessionsForTutor(tutorId);
  
  // Get unique student IDs and fetch them
  const studentIds = [...new Set(sessions.filter(s => s.student_id).map(s => s.student_id))];
  const studentMap = new Map();
  
  // Simple sequential fetch for students
  for (const studentId of studentIds) {
    if (studentId) {
      try {
        const student = await getStudentById(studentId);
        if (student) {
          studentMap.set(student.id, student);
        }
      } catch (error) {
        console.error(`Failed to fetch student ${studentId}:`, error);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>
          Manage and review your tutoring sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => {
            const student = session.student_id ? studentMap.get(session.student_id) : null;
            return (
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
                      <Badge variant={session.is_paid ? 'default' : 'destructive'}>
                        {session.is_paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Student:</strong> {student?.display_name || 'Unassigned'}</p>
                      <p><strong>Subject:</strong> {session.subject}</p>
                      <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                      {session.topics && session.topics.length > 0 && (
                        <p><strong>Topics:</strong> {session.topics.slice(0, 2).join(", ")}
                          {session.topics.length > 2 && ` +${session.topics.length - 2} more`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Link href={`/tutor/${tutorId}/session/${session.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    {session.share_link && (
                      <ShareLink link={session.share_link}>
                        <Button size="sm" variant="outline">
                          <Share2 className="mr-1 h-3 w-3" />
                          Share
                        </Button>
                      </ShareLink>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TutorDashboard({ params }: PageProps): React.ReactNode {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Suspense fallback={<TutorHeaderSkeleton />}>
            <TutorHeader tutorId={id} />
          </Suspense>
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
            <Link href={`/tutor/${id}/upload`}>
              <Button className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Session
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsOverview tutorId={id} />
        </Suspense>

        {/* Calendly Link Management */}
        <Suspense fallback={<CalendlyFormSkeleton />}>
          <CalendlyForm tutorId={id} />
        </Suspense>

        {/* Sessions List */}
        <Suspense fallback={<SessionsListSkeleton />}>
          <SessionsList tutorId={id} />
        </Suspense>
      </div>
    </div>
  );
}