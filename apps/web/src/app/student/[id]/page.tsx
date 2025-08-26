"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockSessions, getTutor, hasAttemptedQuiz, getQuizAttempt, createQuizAttempt } from "@/lib/data";
import { 
  ArrowLeft, 
  Brain, 
  Calendar, 
  FileDown, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  BookOpen,
  Target
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentSessionView({ params }: PageProps): React.ReactNode {
  const { id } = use(params);
  const session = mockSessions.find(s => s.id === id) || mockSessions[0];
  const tutor = getTutor();
  const studentId = "student-1"; // In a real app, this would come from auth context
  
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{correct: number, total: number} | null>(null);
  
  // Check if quiz has been attempted
  const hasAttempted = hasAttemptedQuiz(session.id, studentId);
  const existingAttempt = getQuizAttempt(session.id, studentId);

  // Initialize quiz state for attempted quizzes
  React.useEffect(() => {
    if (hasAttempted && existingAttempt) {
      setShowResults(true);
      // For demo purposes, we'll show the correct answers
      // In a real app, you'd store the actual answers chosen
      const correctAnswers: {[key: string]: number} = {};
      session.quiz.forEach(question => {
        correctAnswers[question.id] = question.correctAnswer;
      });
      setQuizAnswers(correctAnswers);
    }
  }, [hasAttempted, existingAttempt, session.quiz]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (hasAttempted) return; // Prevent resubmission
    
    const score = calculateQuizScore();
    setQuizScore(score);
    setIsSubmitted(true);
    setShowResults(true);
    
    // Create quiz attempt record
    createQuizAttempt(session.id, studentId, score.correct, score.total);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    session.quiz.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: session.quiz.length };
  };

  // Use existing attempt score if available, otherwise use current calculation
  const score = existingAttempt 
    ? { 
        correct: Math.round((existingAttempt.scorePercentage / 100) * existingAttempt.totalQuestions), 
        total: existingAttempt.totalQuestions 
      }
    : quizScore;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Vault
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
        {/* Session Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <span><strong>Subject:</strong> {session.subject}</span>
                <span><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</span>
                <span><strong>Tutor:</strong> {tutor.displayName}</span>
                <Badge 
                  variant={session.status === 'published' ? 'default' : 
                          session.status === 'processing' ? 'secondary' : 'outline'}
                >
                  {session.status === 'published' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {session.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                  {session.status}
                </Badge>
                <Badge variant={session.isPaid ? 'default' : 'destructive'}>
                  {session.isPaid ? 'Paid' : 'Payment Required'}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button asChild>
                <a href={tutor.calendlyLink} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Next Session
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Warning */}
        {!session.isPaid && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Payment Required</h3>
                  <p className="text-red-700">
                    Please complete payment for this session to access all content and features.
                  </p>
                </div>
                <Button variant="destructive" className="ml-auto">
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Topics Covered
              </CardTitle>
              <CardDescription>
                Key concepts from your session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {session.topics.map((topic, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Progress Feedback Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Your Progress & Feedback
              </CardTitle>
              <CardDescription>
                Personalized feedback from your tutor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {session.progressFeedback}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Practice Quiz
                  {showResults && score && (
                    <Badge variant={score.correct === score.total ? 'default' : 'secondary'} className="ml-3">
                      {score.correct}/{score.total} Correct
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Test your understanding with these practice questions
                </CardDescription>
              </div>
              {!hasAttempted && !showResults && Object.keys(quizAnswers).length === session.quiz.length && (
                <Button onClick={handleSubmitQuiz}>
                  Submit Quiz
                </Button>
              )}
              {hasAttempted && (
                <Badge variant="secondary">
                  Quiz Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {session.quiz.map((question, questionIndex) => {
                const isAnswered = question.id in quizAnswers;
                const selectedAnswer = quizAnswers[question.id];
                const isCorrect = (showResults || hasAttempted) && selectedAnswer === question.correctAnswer;
                const isIncorrect = (showResults || hasAttempted) && selectedAnswer !== question.correctAnswer;

                return (
                  <div key={question.id} className="border rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Question {questionIndex + 1}: {question.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selectedAnswer === optionIndex;
                          const isCorrectOption = optionIndex === question.correctAnswer;
                          
                          let optionClass = "border rounded-lg p-3 cursor-pointer transition-colors ";
                          
                          if (showResults || hasAttempted) {
                            if (isCorrectOption) {
                              optionClass += "border-green-500 bg-green-50 text-green-900";
                            } else if (isSelected && !isCorrectOption) {
                              optionClass += "border-red-500 bg-red-50 text-red-900";
                            } else {
                              optionClass += "border-gray-200 bg-gray-50 text-gray-700";
                            }
                          } else {
                            if (isSelected) {
                              optionClass += "border-blue-500 bg-blue-50 text-blue-900";
                            } else {
                              optionClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                            }
                          }

                          return (
                            <div
                              key={optionIndex}
                              className={optionClass}
                              onClick={() => !showResults && !hasAttempted && handleAnswerSelect(question.id, optionIndex)}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={isSelected}
                                  onChange={() => !showResults && !hasAttempted && handleAnswerSelect(question.id, optionIndex)}
                                  className="text-blue-600"
                                  disabled={showResults || hasAttempted}
                                />
                                <span className="flex-1">{option}</span>
                                {(showResults || hasAttempted) && isCorrectOption && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {(showResults || hasAttempted) && isSelected && !isCorrectOption && (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {(showResults || hasAttempted) && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <h4 className={`font-semibold mb-2 ${
                          isCorrect ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {isCorrect ? 'Correct!' : 'Explanation:'}
                        </h4>
                        <p className={`text-sm ${
                          isCorrect ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {(showResults || hasAttempted) && score && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                  <Award className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Quiz {hasAttempted ? 'Results' : 'Complete!'}
                  </h3>
                  <p className="text-blue-800 mb-4">
                    You scored {score.correct} out of {score.total} questions correctly
                    ({Math.round((score.correct / score.total) * 100)}%)
                  </p>
                  {hasAttempted && (
                    <p className="text-blue-700 mb-4 text-sm">
                      Completed on {existingAttempt ? new Date(existingAttempt.completedAt).toLocaleString() : 'Unknown'}
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    <Button asChild>
                      <a href={tutor.calendlyLink} target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Follow-up Session
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
