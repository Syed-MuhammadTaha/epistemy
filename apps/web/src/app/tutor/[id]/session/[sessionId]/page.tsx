import React, { Suspense } from "react";
import Link from "next/link";
import { use } from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { SessionHeader, TopicsList, ProgressFeedback, QuizSection } from "./components";
import { SessionHeaderSkeleton, TopicsSkeleton, FeedbackSkeleton, QuizSkeleton } from "./loading";

interface PageProps {
  params: Promise<{
    id: string;      // tutor ID
    sessionId: string; // session ID
  }>;
}

export default function SessionEdit({ params }: PageProps): React.ReactNode {
  const { id: tutorId, sessionId } = use(params);

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
        {/* Session Info Header */}
        <Suspense fallback={<SessionHeaderSkeleton />}>
          <SessionHeader tutorId={tutorId} sessionId={sessionId} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics Section */}
          <Suspense fallback={<TopicsSkeleton />}>
            <TopicsList sessionId={sessionId} tutorId={tutorId} />
          </Suspense>

          {/* Progress Feedback Section */}
          <Suspense fallback={<FeedbackSkeleton />}>
            <ProgressFeedback sessionId={sessionId} tutorId={tutorId} />
          </Suspense>
        </div>

        {/* Quiz Section */}
        <Suspense fallback={<QuizSkeleton />}>
          <QuizSection sessionId={sessionId} tutorId={tutorId} />
        </Suspense>
      </div>
    </div>
  );
}