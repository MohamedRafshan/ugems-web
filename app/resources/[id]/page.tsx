"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { resourceAPI } from "@/lib/api";
import { useParams } from "next/navigation";

function ResourceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadResource();
  }, [params.id]);

  const loadResource = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getById(params.id);
      setResource(response.data.resource);
      setComments(response.data.resource.comments || []);
    } catch (error) {
      console.error("Error loading resource:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await resourceAPI.comment(params.id, { content: newComment });
      setNewComment("");
      loadResource();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRate = async (stars) => {
    try {
      await resourceAPI.rate(params.id, { rating: stars });
      setRating(stars);
      loadResource();
    } catch (error) {
      console.error("Error rating resource:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await resourceAPI.download(params.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resource-${params.id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      await resourceAPI.delete(params.id);
      router.push("/resources");
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Resource not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/resources"
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Resources
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {resource.title}
          </h1>

          <div className="flex gap-4 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {resource.subject}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
              {resource.category}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
              {resource.field}
            </span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {resource.description}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <p className="text-2xl font-bold text-yellow-500">
                {resource.averageRating
                  ? resource.averageRating.toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Downloads</p>
              <p className="text-2xl font-bold text-indigo-600">
                {resource.downloads}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Comments</p>
              <p className="text-2xl font-bold">{comments.length}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleDownload}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              ↓ Download Resource
            </button>
            {user?.id === resource.uploadedBy?._id && (
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            )}
          </div>

          {/* Rating */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rate This Resource
            </h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`text-3xl ${
                    star <= (rating || resource.averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400 transition`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments
            </h3>

            {/* Add Comment Form */}
            <form
              onSubmit={handleAddComment}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-600">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </div>
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResourceDetail() {
  return (
    <ProtectedRoute>
      <ResourceDetailContent />
    </ProtectedRoute>
  );
}
