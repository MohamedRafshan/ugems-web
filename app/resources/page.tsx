"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { resourceAPI } from "@/lib/api";

function ResourcesBrowseContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    subject: "",
    category: "",
    search: "",
  });

  useEffect(() => {
    loadResources();
  }, [filters]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getAll(filters);
      setResources(response.data.resources || []);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await resourceAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resource-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Study Resources</h1>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search resources..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="programming">Programming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="notes">Notes</option>
                <option value="lecture">Lecture Slides</option>
                <option value="tutorial">Tutorial</option>
                <option value="previous-papers">Previous Papers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Button for Students */}
        {user?.role === "student" && (
          <div className="mb-8">
            <Link
              href="/resources/upload"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              + Upload Resource
            </Link>
          </div>
        )}

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No resources found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {resource.subject}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {resource.averageRating
                          ? resource.averageRating.toFixed(1)
                          : "No ratings"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(resource._id)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                    >
                      ↓ Download
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href={`/resources/${resource._id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResourcesBrowse() {
  return (
    <ProtectedRoute>
      <ResourcesBrowseContent />
    </ProtectedRoute>
  );
}
