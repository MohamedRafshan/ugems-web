'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from '@/lib/authStore';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useAuthStore.getState().init();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
