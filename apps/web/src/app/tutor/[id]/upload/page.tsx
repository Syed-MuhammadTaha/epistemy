"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Brain, 
  Upload, 
  FileText, 
  Video, 
  Loader2
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UploadSession({ params }: PageProps): React.ReactNode {
  const { id: tutorId } = use(params);
  const router = useRouter();
  const [uploadType, setUploadType] = useState<'transcript' | 'video'>('transcript');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !studentName || !subject) {
      alert('Please fill in all fields and select a file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload and processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a new session ID and redirect
    const newSessionId = `session-${Date.now()}`;
    router.push(`/tutor/${tutorId}/session/${newSessionId}`);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Session</h1>
            <p className="text-gray-600">
              Upload your tutoring session content to generate AI-powered insights and quizzes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Session Upload</CardTitle>
              <CardDescription>
                Choose your upload method and provide session details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information */}
                <div className="md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="e.g., Mathematics, Biology"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Upload Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Upload Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        uploadType === 'transcript' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setUploadType('transcript')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          uploadType === 'transcript' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            uploadType === 'transcript' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Upload Transcript</h3>
                          <p className="text-sm text-gray-600">Text file (.txt) or PDF</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        uploadType === 'video' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setUploadType('video')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          uploadType === 'video' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Video className={`h-5 w-5 ${
                            uploadType === 'video' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Upload Video</h3>
                          <p className="text-sm text-gray-600">Video file (.mp4, .mov)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {uploadType === 'transcript' ? 'Transcript File' : 'Video File'}
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="mb-4">
                        <Label htmlFor="file" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-600"> or drag and drop</span>
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          accept={uploadType === 'transcript' ? '.txt,.pdf' : '.mp4,.mov,.avi'}
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {uploadType === 'transcript' 
                          ? 'TXT or PDF up to 10MB' 
                          : 'MP4, MOV, AVI up to 100MB'
                        }
                      </p>
                    </div>
                  </div>
                  {file && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                      <FileText className="h-4 w-4" />
                      <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                {/* Processing Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• AI will analyze your content and extract key topics</li>
                    <li>• Progress evaluation will be generated based on session content</li>
                    <li>• 3-5 practice questions will be created automatically</li>
                    <li>• You'll be able to review and edit all AI outputs before sharing</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUploading || !file || !studentName || !subject}
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & Process
                      </>
                    )}
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
