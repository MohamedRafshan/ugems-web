"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { quizAPI } from "@/lib/api";

function QuizzesBrowseContent() {
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", search: "" });

  useEffect(() => {
    loadQuizzes();
  }, [filters]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAll(filters);
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <div className="flex gap-4">
            {(user?.role === "lecturer" || user?.role === "admin") && (
              <Link
                href="/quizzes/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                + New Quiz
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <input
            type="text"
            placeholder="Search quizzes..."
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <p className="text-center text-gray-600">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No quizzes available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {quiz.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📚 Category: {quiz.category}</p>
                    <p>⏱️ Time Limit: {quiz.timeLimit} minutes</p>
                    <p>❓ Questions: {quiz.questions?.length || 0}</p>
                    <p>📊 Attempts: {quiz.attemptLimit}</p>
                  </div>

                  <Link
                    href={`/quizzes/${quiz._id}`}
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Take Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function QuizzesBrowse() {
  return (
    <ProtectedRoute>
      <QuizzesBrowseContent />
    </ProtectedRoute>
  );
}
