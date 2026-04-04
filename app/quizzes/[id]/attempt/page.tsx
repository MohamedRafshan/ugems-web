"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { quizAPI } from "@/lib/api";
import { useParams } from "next/navigation";

function QuizAttemptContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [params.id]);

  useEffect(() => {
    if (!timeLeft || !attempt) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, attempt]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizResponse = await quizAPI.getById(params.id);
      setQuiz(quizResponse.data.quiz);

      // Start attempt
      const attemptResponse = await quizAPI.startAttempt(params.id);
      setAttempt(attemptResponse.data.attempt);
      setTimeLeft(quizResponse.data.quiz.timeLimit * 60);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const submissionData = {
        answers: Object.entries(answers).map(
          ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          }),
        ),
      };

      const response = await quizAPI.submit(
        params.id,
        attempt._id,
        submissionData,
      );
      router.push(`/quizzes/${params.id}/results/${response.data.attempt._id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!quiz || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error loading quiz</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-lg font-bold text-red-600">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentQuestion.questionText}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.text}
                  checked={answers[currentQuestion._id] === option.text}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion._id, e.target.value)
                  }
                  className="w-4 h-4"
                />
                <span className="ml-4 text-gray-900">{option.text}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizAttempt() {
  return (
    <ProtectedRoute>
      <QuizAttemptContent />
    </ProtectedRoute>
  );
}
