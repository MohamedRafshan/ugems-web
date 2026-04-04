"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/lib/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isAdmin, isSuperAdmin } from "@/lib/permissions";

function DashboardContent() {
  const router = useRouter();
  const { user, logout, getUser } = useAuthStore();
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Web Development",
      faculty: "Faculty of Technology",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      faculty: "Faculty of Science",
      image: "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=500&h=300&fit=crop",
    },
    {
      id: 3,
      title: "English Literature",
      faculty: "Faculty of Arts",
      image: "https://images.unsplash.com/photo-1507842721343-583f20270319?w=500&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Biology Fundamentals",
      faculty: "Faculty of Science",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Business Management",
      faculty: "Faculty of Commerce",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Digital Design Basics",
      faculty: "Faculty of Technology",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [getUser]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Get unique faculties
  const faculties = ["All", ...new Set(courses.map((c) => c.faculty))];

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchFaculty = filterFaculty === "All" || course.faculty === filterFaculty;
      return matchSearch && matchFaculty;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Logo and Nav */}
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
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-0">
                Dashboard
              </Link>
              <Link href="/my-courses" className="text-gray-600 hover:text-gray-900 font-medium">
                My courses
              </Link>
            </nav>
          </div>

          {/* Right: Icons and Menu */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              🔍
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              🔔
            </button>

            {/* Messages */}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              💬
            </button>

            {/* Edit Mode Toggle (Only for Admin/Lecturer) */}
            {isAdmin(user) && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                <span className="text-sm font-medium text-gray-700">Edit mode</span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    editMode ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      editMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Admin Dashboard Button (Only for Super Admin) */}
            {isSuperAdmin(user) && (
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                👑 Admin Panel
              </Link>
            )}

            {/* User Menu */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My courses 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Hi, {user?.firstName}! <span className="text-2xl">👋</span>
          </p>
          <p className="text-gray-500">Course overview</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty === "All" ? "All" : faculty}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by course name</option>
              <option value="date">Sort by date</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/course/${course.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative group cursor-pointer"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />

                {/* Edit Button (Top Right Corner - Visible in Edit Mode) */}
                {editMode && isAdmin(user) && (
                  <button className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition z-10">
                    ✏️
                  </button>
                )}
              </div>

              {/* Course Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-indigo-600 mb-2 hover:underline cursor-pointer">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm">{course.faculty}</p>
              </div>

              {/* Three Dot Menu */}
              <div className="absolute bottom-24 right-4 opacity-0 group-hover:opacity-100 transition">
                <button onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-gray-600 text-xl">⋮</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
