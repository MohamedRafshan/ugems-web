"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { adminAPI } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminStudents() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const loadStudents = async () => {
      try {
        const response = await adminAPI.getAllStudents();
        setStudents(response.data.students || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [user, router]);

  const filteredStudents = students.filter((student: any) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
      <AdminSidebar currentPage="students" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">
              Manage all registered students on the platform
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

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or index number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                All Students ({filteredStudents.length})
              </h2>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                {searchTerm ? "No students match your search" : "No students registered yet"}
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
                        NIC
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student: any) => (
                      <tr
                        key={student._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600 text-lg">
                            {student.indexNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
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
                          {student.nicNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.address}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {student.isActive ? (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
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
