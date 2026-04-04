"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isAdmin } from "@/lib/permissions";

function CourseDetailContent() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("course");
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  // Sample course data - in real app, fetch from API
  const course = {
    id: courseId,
    title: "Mindful Course Creation",
    subtitle: "... and breathe!",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=1200&h=400&fit=crop",
    sections: [
      {
        id: 1,
        title: "... and breathe!",
        content:
          "Create your course and give your learners a mindful, stress-free experience with Moodle LMS 4.",
        subsections: [
          "Course noticeboard",
          "About this course",
          "Prior experience check",
          "How mindful an educator are ...",
          "Search slideshare for present...",
        ],
      },
      {
        id: 2,
        title: "Why this course?",
        subsections: [
          "Help build our understanding",
          "Let's talk about stress!",
          "The Freiburg Mindfulness inve...",
          "The need for mindfulness",
          "Join us for our weekly live ses...",
        ],
      },
      {
        id: 3,
        title: "Mindful teaching",
        subsections: [
          "What we as teachers can do",
          "(Research paper) Mindfulness...",
        ],
      },
    ],
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="UGEMS"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="font-bold text-indigo-600">UGEMS</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-0"
              >
                My courses
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">🔍</button>
            <button className="p-2 hover:bg-gray-100 rounded-full">🔔</button>
            <button className="p-2 hover:bg-gray-100 rounded-full">💬</button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Close Button */}
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
              >
                <span className="text-xl">✕</span>
                <span className="bg-black text-white px-3 py-1 rounded text-sm font-semibold">
                  Close course index
                </span>
              </button>

              {/* Course Sections Navigation */}
              <nav className="space-y-2">
                {course.sections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-start gap-2 text-gray-700 hover:text-gray-900 font-medium py-2 transition"
                    >
                      <span className="text-lg">
                        {expandedSections.includes(section.id) ? "▼" : "▶"}
                      </span>
                      <span className="text-sm text-left">{section.title}</span>
                    </button>

                    {/* Subsections */}
                    {expandedSections.includes(section.id) && (
                      <div className="ml-6 space-y-2">
                        {section.subsections.map((sub, idx) => (
                          <button
                            key={idx}
                            className="block text-sm text-gray-600 hover:text-indigo-600 text-left py-1 transition"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Course Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {[
                  { id: "course", label: "Course" },
                  { id: "settings", label: "Settings" },
                  { id: "participants", label: "Participants" },
                  { id: "grades", label: "Grades" },
                  { id: "activities", label: "Activities" },
                  { id: "more", label: "More" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-2 font-medium border-b-2 transition ${
                      activeTab === tab.id
                        ? "text-indigo-600 border-indigo-600"
                        : "text-gray-600 hover:text-gray-900 border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Course Tab */}
            {activeTab === "course" && (
              <div className="space-y-8">
                {/* Course Image/Banner */}
                <div className="rounded-lg overflow-hidden bg-gray-200 h-64 relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Course Sections */}
                {course.sections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center gap-2 text-gray-900 font-semibold hover:text-indigo-600 transition"
                      >
                        <span className="text-xl">
                          {expandedSections.includes(section.id) ? "▼" : "▶"}
                        </span>
                        {section.title}
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                        Collapse all
                      </button>
                    </div>

                    {expandedSections.includes(section.id) && (
                      <div className="space-y-4 mt-4">
                        <p className="text-gray-600">{section.content}</p>
                        {section.subsections.map((sub, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-indigo-50 cursor-pointer transition"
                          >
                            <span className="text-lg">📋</span>
                            <span className="text-sm text-gray-700 hover:text-indigo-600">
                              {sub}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Other Tab Content */}
            {activeTab !== "course" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600 text-lg">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  content coming soon...
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <ProtectedRoute>
      <CourseDetailContent />
    </ProtectedRoute>
  );
}
