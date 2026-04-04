"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { quizAPI } from "@/lib/api";
import { useParams } from "next/navigation";

function QuizResultsContent() {
  const params = useParams();
  const attemptId = Array.isArray(params.attemptId) ? params.attemptId[0] : (params.attemptId as string);
  const { user } = useAuthStore();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getResult(attemptId);
      setResult(response.data);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error loading results</p>
      </div>
    );
  }

  const attempt = result.attempt;
  const percentage = (attempt.score / attempt.totalPoints) * 100;
  const isPassed = percentage >= 60;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div
          className={`rounded-lg shadow p-8 mb-8 text-center ${isPassed ? "bg-green-50" : "bg-red-50"}`}
        >
          <p
            className={`text-6xl font-bold mb-2 ${isPassed ? "text-green-600" : "text-red-600"}`}
          >
            {percentage.toFixed(1)}%
          </p>
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            {isPassed ? "✅ Passed!" : "❌ Did not Pass"}
          </p>
          <p className="text-lg text-gray-600">
            Score: {attempt.score}/{attempt.totalPoints}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Time Taken: {attempt.timeTaken} minutes
          </p>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Answer Review
          </h2>

          <div className="space-y-6">
            {attempt.answers.map((answer: any, index: number) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg ${answer.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}
              >
                <p className="font-semibold text-gray-900 mb-2">
                  Question {index + 1}: {answer.questionText}
                </p>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Your Answer:</span>{" "}
                    <span
                      className={
                        answer.isCorrect ? "text-green-700" : "text-red-700"
                      }
                    >
                      {answer.selectedAnswer}
                    </span>
                  </p>

                  {!answer.isCorrect && (
                    <p className="text-sm">
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      <span className="text-green-700">
                        {answer.correctAnswer}
                      </span>
                    </p>
                  )}

                  {answer.explanation && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {answer.explanation}
                    </p>
                  )}
                </div>

                <p
                  className={`text-sm font-semibold mt-2 ${answer.isCorrect ? "text-green-700" : "text-red-700"}`}
                >
                  {answer.pointsEarned}/{answer.questionPoints} points
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/quizzes"
            className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
          >
            Back to Quizzes
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 text-center bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function QuizResults() {
  return (
    <ProtectedRoute>
      <QuizResultsContent />
    </ProtectedRoute>
  );
}
