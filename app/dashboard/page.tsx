"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { resourceAPI, quizAPI } from "@/lib/api";

function DashboardContent() {
  const router = useRouter();
  const { user, logout, getUser } = useAuthStore();
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await getUser();
        const [resourcesRes, quizzesRes] = await Promise.all([
          resourceAPI.getAll({ limit: 5 }),
          quizAPI.getAll({ limit: 5 }),
        ]);
        setResources(resourcesRes.data.resources || []);
        setQuizzes(quizzesRes.data.quizzes || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [getUser]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">UGEMS</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Role:{" "}
            <span className="font-semibold">{user?.role.toUpperCase()}</span>
          </p>

          {/* Student Profile Card with Index Number */}
          {user?.role === "student" && user?.indexNumber && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Index Number</p>
                  <p className="text-2xl font-bold text-indigo-600">{user.indexNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">A/L Batch: {user.alBatch}</p>
                  <p className="text-sm text-gray-600">School: {user.school}</p>
                </div>
              </div>
              {user.address && (
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <p className="text-sm text-gray-600">Address: {user.address}</p>
                  {user.nicNumber && <p className="text-sm text-gray-600">NIC: {user.nicNumber}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/resources"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Study Resources
            </h3>
            <p className="text-gray-600">Browse and download study materials</p>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quizzes
            </h3>
            <p className="text-gray-600">Test your knowledge with quizzes</p>
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-amber-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Admin Dashboard
              </h3>
              <p className="text-gray-600">Manage users, resources, and quizzes</p>
            </Link>
          )}

          {(user?.role === "admin" || user?.role === "lecturer") && user?.role !== "admin" ? null : (
            user?.role === "student" && (
              <Link
                href="/resources/upload"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Resource
                </h3>
                <p className="text-gray-600">Share study materials with others</p>
              </Link>
            )
          )}
        </div>

        {/* Recent Resources */}
        {resources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource: any) => (
                <div
                  key={resource._id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {resource.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-indigo-600">
                      {resource.subject}
                    </span>
                    <Link
                      href={`/resources/${resource._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Quizzes */}
        {quizzes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz: any) => (
                <div key={quiz._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {quiz.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {quiz.timeLimit} mins
                    </div>
                    <Link
                      href={`/quizzes/${quiz._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
