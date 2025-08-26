import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Brain, Zap } from "lucide-react";

export default function LandingPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Epistemy</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Tutoring Sessions with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Upload your tutoring sessions and let our AI generate intelligent summaries, 
            progress feedback, and personalized quizzes. Streamline your teaching workflow 
            and enhance student learning outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tutor">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Tutor Dashboard
              </Button>
            </Link>
            <Link href="/student">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Student Vault
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h3>
          <p className="text-lg text-gray-600">Everything you need to enhance your tutoring experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Automatically extract topics, evaluate progress, and generate insights from your sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Topic extraction and categorization</li>
                <li>• Progress evaluation vs. previous sessions</li>
                <li>• Intelligent content summarization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Smart Quiz Generation</CardTitle>
              <CardDescription>
                Create progression-aware practice questions tailored to each student's needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 3-5 targeted practice questions</li>
                <li>• Progress-aware difficulty adjustment</li>
                <li>• Detailed explanations included</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Seamless Sharing</CardTitle>
              <CardDescription>
                Easy sharing between tutors and students with integrated booking and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Shareable session links</li>
                <li>• PDF export functionality</li>
                <li>• Calendly integration for bookings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Simple steps to transform your tutoring sessions</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Upload Session",
                description: "Upload your video file or transcript from the tutoring session"
              },
              {
                step: "2", 
                title: "AI Processing",
                description: "Our AI analyzes the content and generates insights automatically"
              },
              {
                step: "3",
                title: "Review & Edit", 
                description: "Review and customize the AI-generated content before sharing"
              },
              {
                step: "4",
                title: "Share & Track",
                description: "Share with students and track their progress over time"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Join the future of personalized tutoring with AI-powered session intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tutor">
              <Button size="lg" className="w-full sm:w-auto">
                Start as a Tutor
              </Button>
            </Link>
            <Link href="/student">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Access as Student
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6" />
              <span className="text-lg font-semibold">Epistemy</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Epistemy. Transforming education with AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
