"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error: any) {
      setLocalError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">UGEMS</h1>
        <p className="text-gray-600 mb-6">Sign in to your account</p>

        {(error || localError) && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 hover:underline"
          >
            Register here
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Are you an administrator?{" "}
            <Link
              href="/admin/login"
              className="text-amber-600 hover:underline font-semibold"
            >
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
