"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.adminLogin(formData);

      // Store token and user in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-4 border-amber-500">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-amber-600 mb-2">⚙️</div>
          <h1 className="text-3xl font-bold text-gray-900">UGEMS Admin</h1>
          <p className="text-gray-600 mt-2">Administrative Access Only</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 border border-red-200">
            <p className="font-semibold">Access Denied</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="••••••••"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>
              Email: <code className="bg-white px-1">ugems@gmail.com</code>
            </p>
            <p>
              Password: <code className="bg-white px-1">ugems@123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center">
            Not an admin?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Student Login
            </Link>
          </p>
          <p className="text-gray-600 text-sm text-center mt-2">
            Need to register?{" "}
            <Link
              href="/auth/register"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Student Registration
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            ℹ️ <strong>Admin Access Only:</strong> This page is restricted to
            authorized administrators with special credentials. Unauthorized
            access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
