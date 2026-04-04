"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { adminAPI } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { isSuperAdmin } from "@/lib/permissions";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !isSuperAdmin(user)) {
      router.push("/dashboard");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const studentsRes = await adminAPI.getAllStudents();
        setStudents(studentsRes.data.students || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, router]);

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
      <AdminSidebar currentPage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's an overview of your platform.
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Resources</p>
                  <p className="text-3xl font-bold text-blue-600">—</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Quizzes</p>
                  <p className="text-3xl font-bold text-green-600">—</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Platform Status</p>
                  <p className="text-3xl font-bold text-emerald-600">✓ Active</p>
                </div>
                <div className="text-4xl">⚙️</div>
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Registrations</h2>
              <p className="text-sm text-gray-600 mt-1">Latest student sign-ups (showing last 5)</p>
            </div>

            {students.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No students registered yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Index Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        A/L Batch
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((student: any) => (
                      <tr
                        key={student._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">
                            {student.indexNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {student.school}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {student.alBatch}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString()}
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
