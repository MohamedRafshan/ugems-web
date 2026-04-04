"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/lib/authStore";
import { getAdminMenuItems, getAdminTierLabel } from "@/lib/permissions";

interface AdminSidebarProps {
  currentPage: "dashboard" | "students" | "resources" | "quizzes";
}

export default function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Get menu items based on admin tier
  const menuItems = getAdminMenuItems(user);
  const tierLabel = getAdminTierLabel(user);

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-700 flex flex-col items-center">
        <Image
          src="/logo.jpeg"
          alt="UGEMS Logo"
          width={80}
          height={80}
          className="mb-3"
          priority
        />
        <h1 className="text-xl font-bold text-center">UGEMS Admin</h1>
        <p className="text-indigo-200 text-sm mt-1">{tierLabel || "Management Panel"}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentPage === item.label.toLowerCase() ||
              (item.href.includes(currentPage) && currentPage !== "dashboard")
                ? "bg-indigo-600 text-white font-semibold"
                : "text-indigo-100 hover:bg-indigo-700"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-indigo-700 space-y-2">
        <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          <span className="text-xl">👤</span>
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
