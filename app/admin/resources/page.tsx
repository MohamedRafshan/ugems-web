"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { adminAPI, resourceAPI } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { isLimitedAdmin, canToggleContent } from "@/lib/permissions";

export default function AdminResources() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const loadResources = async () => {
      try {
        const response = await resourceAPI.getAll({ limit: 1000 });
        setResources(response.data.resources || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [user, router]);

  const handleToggleEnable = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.toggleResourceEnable(id);
      setSuccess("Resource status updated");

      const response = await resourceAPI.getAll({ limit: 1000 });
      setResources(response.data.resources || []);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update resource");
    }
  };

  const handleToggleHide = async (id: string) => {
    try {
      setSuccess("");
      await adminAPI.toggleResourceHide(id);
      setSuccess("Resource visibility updated");

      const response = await resourceAPI.getAll({ limit: 1000 });
      setResources(response.data.resources || []);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update resource");
    }
  };

  // For limited admins, filter to show only their own resources
  const displayedResources = isLimitedAdmin(user)
    ? resources.filter((r: any) => r.uploadedBy === user._id)
    : resources;

  const filteredResources = displayedResources.filter(
    (resource: any) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
      <AdminSidebar currentPage="resources" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-600 mt-1">
              {isLimitedAdmin(user) ? "Manage your study materials" : "Manage all study materials on the platform"}
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
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Study Resources ({filteredResources.length})
              </h2>
            </div>

            {filteredResources.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                {searchTerm ? "No resources match your search" : "No resources available"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Downloads
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
                    {filteredResources.map((resource: any) => {
                      const canModify = canToggleContent(user, resource.uploadedBy);
                      return (
                        <tr
                          key={resource._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {resource.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {resource.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {resource.category}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {resource.downloads || 0}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                resource.isEnabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {resource.isEnabled ? "✓ Enabled" : "✗ Disabled"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                resource.isHidden
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {resource.isHidden ? "👁️ Hidden" : "👀 Visible"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {canModify ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleEnable(resource._id)}
                                  className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                    resource.isEnabled
                                      ? "bg-orange-100 hover:bg-orange-200 text-orange-800"
                                      : "bg-green-100 hover:bg-green-200 text-green-800"
                                  }`}
                                >
                                  {resource.isEnabled ? "Disable" : "Enable"}
                                </button>
                                <button
                                  onClick={() => handleToggleHide(resource._id)}
                                  className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                    resource.isHidden
                                      ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                  }`}
                                >
                                  {resource.isHidden ? "Show" : "Hide"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No access</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
