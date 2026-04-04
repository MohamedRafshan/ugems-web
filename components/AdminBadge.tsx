"use client";

import {
  getAdminTierLabel,
  isSuperAdmin,
  isLimitedAdmin,
} from "@/lib/permissions";

interface AdminBadgeProps {
  user: any;
  variant?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export default function AdminBadge({
  user,
  variant = "medium",
  showLabel = true,
}: AdminBadgeProps) {
  const tierLabel = getAdminTierLabel(user);

  if (!tierLabel) {
    return null;
  }

  const sizeClasses = {
    small: "text-sm px-2 py-1",
    medium: "text-base px-3 py-1.5",
    large: "text-lg px-4 py-2",
  };

  const bgColors = isSuperAdmin(user)
    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
    : "bg-blue-100 text-blue-800 border border-blue-300";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${bgColors} ${sizeClasses[variant]}`}
    >
      <span className="text-lg">{tierLabel.split(" ")[0]}</span>
      {showLabel && <span>{tierLabel.split(" ").slice(1).join(" ")}</span>}
    </div>
  );
}
