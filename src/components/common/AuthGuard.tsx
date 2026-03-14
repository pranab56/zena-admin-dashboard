'use client';

import { useGetMyProfileQuery } from "@/features/profile/profileApi";
import { getToken } from "@/utils/storage";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loading from "./Loading";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = getToken();

  const { data: profileRes, isLoading, isError, error } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });

  const userData = profileRes?.data;

  useEffect(() => {
    // 1. If no token, redirect to login
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // 2. If API error (e.g. invalid token), redirect to login
    if (isError) {
      const err = error as { status?: number };
      if (err?.status === 401) {
        localStorage.clear(); // Clear local storage to be safe
        router.replace("/auth/login");
      }
    }

    // 3. Role-based checks once data is loaded
    if (!isLoading && userData) {
      // Save role in localStorage for frontend persistence/sidebar if needed
      if (userData.role) {
        localStorage.setItem('role', userData.role);
      }

      const role = userData.role;

      // Super Admin specific paths
      const superAdminPaths = [
        "/overview",
        "/salons-management",
        "/analytics",
        "/settings/admin"
      ];

      // Salon Admin / Admin specific paths
      const adminPaths = [
        "/customers",
        "/visits",
        "/rewards-management",
        "/redemption-requests",
        "/settings/super-admin"
      ];

      const isTryingSuperAdminPath = superAdminPaths.some(path => pathname.startsWith(path));
      const isTryingAdminPath = adminPaths.some(path => pathname.startsWith(path));

      const isSuperAdmin = (role === 'SUPER_ADMIN' || role === 'superadmin');
      const isAdmin = (role === 'ADMIN' || role === 'salonadmin');

      if (isTryingSuperAdminPath && !isSuperAdmin) {
        // If not super admin but trying super admin path, redirect to their home or show unauthorized
        router.replace("/");
      }

      if (isTryingAdminPath && !isSuperAdmin && !isAdmin) {
        // Generic unauthorized catch
        router.replace("/auth/login");
      }
    }
  }, [token, isLoading, userData, pathname, router, isError, error]);

  // Synchronous checks to prevent ANY flicker
  const isSuperAdminPath = [
    "/overview",
    "/salons-management",
    "/analytics",
    "/settings/admin"
  ].some(path => pathname.startsWith(path));

  const isAdminPath = [
    "/customers",
    "/visits",
    "/rewards-management",
    "/redemption-requests",
    "/settings/super-admin"
  ].some(path => pathname.startsWith(path));

  // 1. Immediate hardware block: No token = no render
  if (!token) {
    return null;
  }

  // 2. Show loading while verifying session against the server
  if (isLoading || (!userData && !isError)) {
    return <Loading minHeight="100vh" />;
  }

  // 3. Post-load Role Protection
  if (userData) {
    const role = userData.role;
    const isSuperAdmin = (role === 'SUPER_ADMIN' || role === 'superadmin');
    const isAdmin = (role === 'ADMIN' || role === 'salonadmin');

    if (isSuperAdminPath && !isSuperAdmin) return null;
    if (isAdminPath && !isSuperAdmin && !isAdmin) return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
