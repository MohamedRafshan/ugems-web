/**
 * Permission checking utilities for admin role hierarchy
 */

export const isSuperAdmin = (user: any) => {
  // Explicit check for super admin tier
  if (user?.role === "admin" && user?.adminTier === "super") return true;

  // Fallback: if they're an admin but adminTier is undefined (old JWT or not set yet),
  // still treat as potentially super admin - let backend enforce with email/tier check
  if (user?.role === "admin" && user?.adminTier === undefined) return true;

  return false;
};

export const isLimitedAdmin = (user: any) =>
  (user?.role === "admin" || user?.role === "lecturer") &&
  user?.adminTier === "limited";

export const isAdmin = (user: any) =>
  user?.role === "admin" || user?.role === "lecturer";

export const canManageUsers = (user: any) => isSuperAdmin(user);

export const canViewAnalytics = (user: any) => isSuperAdmin(user);

export const canAccessAdminDashboard = (user: any) => isSuperAdmin(user);

/**
 * Check if a user can toggle enable/disable or hide/show for a resource/quiz
 * Super admin can toggle any content, limited admin can only toggle their own
 */
export const canToggleContent = (user: any, creatorId: string) => {
  if (isSuperAdmin(user)) return true;
  if (isLimitedAdmin(user)) return user._id === creatorId;
  return false;
};

/**
 * Check if a user can delete a resource/quiz
 * Super admin can delete any, limited admin can only delete their own
 */
export const canDeleteContent = (user: any, creatorId: string) => {
  if (isSuperAdmin(user)) return true;
  if (isLimitedAdmin(user)) return user._id === creatorId;
  return false;
};

/**
 * Get the admin sidebar menu items based on user tier
 */
export const getAdminMenuItems = (user: any) => {
  const baseItems = [];

  if (isSuperAdmin(user)) {
    return [
      { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
      { label: "Students", href: "/admin/students", icon: "👥" },
      { label: "Resources", href: "/admin/resources", icon: "📚" },
      { label: "Quizzes", href: "/admin/quizzes", icon: "❓" },
    ];
  }

  if (isLimitedAdmin(user)) {
    return [
      { label: "Resources", href: "/admin/resources", icon: "📚" },
      { label: "Quizzes", href: "/admin/quizzes", icon: "❓" },
    ];
  }

  return [];
};

/**
 * Get the admin tier label for display
 */
export const getAdminTierLabel = (user: any) => {
  if (isSuperAdmin(user)) return "👑 Super Admin";
  if (isLimitedAdmin(user)) {
    return user?.role === "lecturer" ? "👨‍🏫 Lecturer" : "📚 Content Manager";
  }
  return null;
};
