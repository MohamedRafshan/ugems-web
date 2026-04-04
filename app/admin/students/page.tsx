"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { adminAPI } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { isSuperAdmin } from "@/lib/permissions";

export default function AdminStudents() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [roleFilter, setRoleFilter] = useState("all"); // all, admin, student

  useEffect(() => {
    // Only super admin can access this page
    if (user && !isSuperAdmin(user)) {
      router.push("/admin/resources");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadStudents();
  }, [user, router]);

  const loadStudents = async () => {
    try {
      const response = await adminAPI.getAllStudents();
      setStudents(response.data.students || []);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.updateUserRole(id, "admin");
      setSuccess("Student promoted to admin successfully");
      loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleMakeLecturer = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.updateUserRole(id, "lecturer");
      setSuccess("Student promoted to lecturer successfully");
      loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.updateUserRole(id, "student");
      setSuccess("Admin/Lecturer role removed successfully");
      loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setSuccess("");
      if (currentStatus) {
        // Deactivate the user
        await adminAPI.deactivateUser(id);
        setSuccess("User deactivated successfully (can't access system)");
      } else {
        // Activate the user
        await adminAPI.activateUser(id);
        setSuccess("User activated successfully (can access system)");
      }
      loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student: any) => {
    const matchSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.isActive) ||
      (statusFilter === "inactive" && !student.isActive);

    const matchRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && student.role === "admin") ||
      (roleFilter === "lecturer" && student.role === "lecturer") ||
      (roleFilter === "student" && student.role === "student");

    return matchSearch && matchStatus && matchRole;
  });

  const adminCount = students.filter((s: any) => s.role === "admin").length;
  const studentCount = students.filter((s: any) => s.role === "student").length;
  const activeCount = students.filter((s: any) => s.isActive).length;
  const inactiveCount = students.filter((s: any) => !s.isActive).length;

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
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">
              Manage student accounts, assign admin roles, and control access
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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{students.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">👑 {adminCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Students</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">👥 {studentCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-green-600 mt-1">✓ {activeCount}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, or index number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin Only</option>
                  <option value="lecturer">Lecturer Only</option>
                  <option value="student">Students Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                All Users ({filteredStudents.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredStudents.length} of {students.length} users match your filters
              </p>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                  ? "No users match your filter criteria"
                  : "No users registered yet"}
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
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
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
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              student.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : student.role === "lecturer"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {student.role === "admin"
                              ? "👑 Admin"
                              : student.role === "lecturer"
                              ? "👨‍🏫 Lecturer"
                              : "👥 Student"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              student.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.isActive ? "✓ Active" : "✗ Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {/* Role Management Buttons */}
                            {student.role === "student" ? (
                              <>
                                <button
                                  onClick={() => handleMakeAdmin(student._id)}
                                  className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 transition"
                                  title="Promote to admin"
                                >
                                  Make Admin
                                </button>
                                <button
                                  onClick={() => handleMakeLecturer(student._id)}
                                  className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 hover:bg-orange-200 text-orange-800 transition"
                                  title="Promote to lecturer"
                                >
                                  Make Lecturer
                                </button>
                              </>
                            ) : student.role === "admin" ? (
                              <button
                                onClick={() => handleRemoveAdmin(student._id)}
                                className="px-2 py-1 rounded text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 transition"
                                title="Remove admin role"
                              >
                                Remove Admin
                              </button>
                            ) : student.role === "lecturer" ? (
                              <button
                                onClick={() => handleRemoveAdmin(student._id)}
                                className="px-2 py-1 rounded text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 transition"
                                title="Remove lecturer role"
                              >
                                Remove Lecturer
                              </button>
                            ) : null}

                            {/* Activate/Deactivate Button */}
                            {student.isActive ? (
                              <button
                                onClick={() =>
                                  handleToggleActive(student._id, student.isActive)
                                }
                                className="px-2 py-1 rounded text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 transition"
                                title="Deactivate user (they can't access the system)"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleActive(student._id, student.isActive)
                                }
                                className="px-2 py-1 rounded text-xs font-semibold bg-green-100 hover:bg-green-200 text-green-800 transition"
                                title="Activate user (they can access the system)"
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Filter Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Use filters to find specific users quickly.
              Active users can access the system. Inactive users cannot access.
              Promote students to Admin or Lecturer to give them special access. Click "Remove Admin" or "Remove Lecturer" to demote them back to student.
            </p>
            <p className="text-xs text-blue-800 mt-2 font-semibold">
              🔐 Note: The main super admin account is protected and cannot be modified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
