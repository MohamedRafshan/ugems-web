'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/lib/authStore';

export default function Home() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().init();
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">UGEMS</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-700">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Undergraduate Engineering & Medicine Society
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          A comprehensive digital ecosystem for undergraduate students in Engineering and Medicine. Access resources, take quizzes, and collaborate with your peers.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Resources</h3>
            <p className="text-gray-600">
              Share and access comprehensive study materials from your peers and instructors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600">
              Test your knowledge with timed quizzes and get instant feedback on your performance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Connect with other students and instructors in a vibrant academic community.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
