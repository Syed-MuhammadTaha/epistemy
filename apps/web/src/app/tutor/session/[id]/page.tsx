"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { mockSessions, getStudentBySessionId } from "@/lib/data";
import { 
  ArrowLeft, 
  Brain, 
  Save, 
  FileDown, 
  Share2, 
  Plus, 
  Trash2,
  Copy,
  Check
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SessionEdit({ params }: PageProps): React.ReactNode {
  const { id } = use(params);
  const [session, setSession] = useState(mockSessions.find(s => s.id === id) || mockSessions[0]);
  const [topics, setTopics] = useState(session.topics);
  const [progressFeedback, setProgressFeedback] = useState(session.progressFeedback);
  const [quiz, setQuiz] = useState(session.quiz);
  const [shareLink, setShareLink] = useState(session.shareLink || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate share link if it doesn't exist
    if (!shareLink) {
      const link = `/student/${id}`;
      setShareLink(link);
    }
  }, [id, shareLink]);

  const handleAddTopic = () => {
    setTopics([...topics, '']);
  };

  const handleUpdateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q${quiz.length + 1}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuiz([...quiz, newQuestion]);
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const newQuiz = [...quiz];
    if (field === 'options') {
      newQuiz[index].options = value;
    } else {
      (newQuiz[index] as any)[field] = value;
    }
    setQuiz(newQuiz);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Simulate save
    alert('Session saved successfully!');
  };

  const handleExportPDF = () => {
    // Simulate PDF export
    alert('PDF export initiated! This would generate a PDF with the session content.');
  };

  const handleCopyShareLink = () => {
    const fullLink = `${window.location.origin}${shareLink}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/tutor" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
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
        {/* Session Info Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span><strong>Student:</strong> {getStudentBySessionId(session.id)?.displayName || 'Unassigned'}</span>
                <span><strong>Subject:</strong> {session.subject}</span>
                <span><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</span>
                <Badge variant={session.isPaid ? 'default' : 'destructive'}>
                  {session.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleCopyShareLink}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Share Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Session Topics</CardTitle>
              <CardDescription>
                Key topics covered in this session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={topic}
                    onChange={(e) => handleUpdateTopic(index, e.target.value)}
                    placeholder="Enter topic"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveTopic(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddTopic}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </CardContent>
          </Card>

          {/* Progress Feedback Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progress Feedback</CardTitle>
              <CardDescription>
                Detailed feedback on student progress and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={progressFeedback}
                onChange={(e) => setProgressFeedback(e.target.value)}
                placeholder="Enter detailed progress feedback..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quiz Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Practice Quiz</CardTitle>
                <CardDescription>
                  Generated questions based on session content
                </CardDescription>
              </div>
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {quiz.map((question, questionIndex) => (
                <div key={question.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Label className="text-lg font-semibold">
                      Question {questionIndex + 1}
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`question-${questionIndex}`}>Question</Label>
                      <Input
                        id={`question-${questionIndex}`}
                        value={question.question}
                        onChange={(e) => handleUpdateQuestion(questionIndex, 'question', e.target.value)}
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
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleUpdateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                              className="text-blue-600"
                            />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                handleUpdateQuestion(questionIndex, 'options', newOptions);
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`explanation-${questionIndex}`}>Explanation</Label>
                      <Textarea
                        id={`explanation-${questionIndex}`}
                        value={question.explanation}
                        onChange={(e) => handleUpdateQuestion(questionIndex, 'explanation', e.target.value)}
                        placeholder="Explain the correct answer"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Share Link Section */}
        {shareLink && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Share with Student</CardTitle>
              <CardDescription>
                Use this link to share the session content with your student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}${shareLink}`}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyShareLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Link href={shareLink}>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
