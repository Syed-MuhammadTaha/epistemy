import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Brain, 
  Upload
} from "lucide-react";
import { fetchStudents } from "@/lib/data";
import { createSessionAction } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UploadSession({ params }: PageProps): Promise<React.ReactNode> {
  const { id: tutorId } = await params;
  const students = await fetchStudents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/tutor/${tutorId}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Session</h1>
            <p className="text-gray-600">
              Create a new tutoring session by selecting a student and providing session details
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Session Creation</CardTitle>
              <CardDescription>
                Select a student and provide session information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createSessionAction.bind(null, tutorId)} className="space-y-6">
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <Select name="student_id" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transcript Text */}
                <div className="space-y-2">
                  <Label htmlFor="transcript">Session Transcript</Label>
                  <Textarea
                    id="transcript"
                    name="transcript_text"
                    placeholder="Paste or type the session transcript here..."
                    rows={8}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    This text will be analyzed to generate topics, progress evaluation, and quiz questions.
                  </p>
                </div>

                {/* Processing Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• AI will analyze your transcript and extract key topics</li>
                    <li>• Progress evaluation will be generated based on session content</li>
                    <li>• 3-5 practice questions will be created automatically</li>
                    <li>• You'll be able to review and edit all AI outputs before sharing</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Create Session
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
