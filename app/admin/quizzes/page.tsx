"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { adminAPI, quizAPI } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminQuizzes() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const loadQuizzes = async () => {
      try {
        const response = await quizAPI.getAll({ limit: 1000 });
        setQuizzes(response.data.quizzes || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [user, router]);

  const handleToggleEnable = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.toggleQuizEnable(id);
      setSuccess("Quiz status updated");

      const response = await quizAPI.getAll({ limit: 1000 });
      setQuizzes(response.data.quizzes || []);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update quiz");
    }
  };

  const handleToggleHide = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.toggleQuizHide(id);
      setSuccess("Quiz visibility updated");

      const response = await quizAPI.getAll({ limit: 1000 });
      setQuizzes(response.data.quizzes || []);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update quiz");
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz: any) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar currentPage="quizzes" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-gray-600 mt-1">
              Manage all quizzes on the platform
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
              {success}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quizzes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                All Quizzes ({filteredQuizzes.length})
              </h2>
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                {searchTerm ? "No quizzes match your search" : "No quizzes available"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Quiz Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Time Limit
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Visibility
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuizzes.map((quiz: any) => (
                      <tr
                        key={quiz._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {quiz.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {quiz.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {quiz.questions?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {quiz.timeLimit} mins
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {quiz.attemptLimit}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              quiz.isEnabled
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {quiz.isEnabled ? "✓ Enabled" : "✗ Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              quiz.isHidden
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {quiz.isHidden ? "👁️ Hidden" : "👀 Visible"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleEnable(quiz._id)}
                              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                quiz.isEnabled
                                  ? "bg-orange-100 hover:bg-orange-200 text-orange-800"
                                  : "bg-green-100 hover:bg-green-200 text-green-800"
                              }`}
                            >
                              {quiz.isEnabled ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => handleToggleHide(quiz._id)}
                              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                quiz.isHidden
                                  ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                              }`}
                            >
                              {quiz.isHidden ? "Show" : "Hide"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
