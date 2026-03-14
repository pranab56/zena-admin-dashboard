"use client";

import { useGetMyProfileQuery } from "@/features/profile/profileApi";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Loading from "./common/Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuthPath = pathname?.startsWith("/auth");
  const token = typeof window !== "undefined" ? localStorage.getItem("PharmacyAdmin") : null;

  const { data: profileRes, isLoading, isError, isSuccess } = useGetMyProfileQuery(undefined, {
    // We only skip if no token or not hydrated. 
    // We want to verify the token even on auth paths if one exists.
    skip: !token || !isHydrated,
  });

  useEffect(() => {
    if (!isHydrated) return;

    const currentToken = localStorage.getItem("PharmacyAdmin");

    if (!isAuthPath) {
      // PROTECTED PATHS
      if (!currentToken) {
        router.replace("/auth/login");
        return;
      }

      if (isError) {
        localStorage.removeItem("PharmacyAdmin");
        localStorage.removeItem("role");
        router.replace("/auth/login");
        return;
      }

      // Role Based Access Control
      if (profileRes?.data) {
        const role = profileRes.data.role;
        const isSuperAdmin = role === 'SUPER_ADMIN' || role === 'superadmin';
        const isAdmin = role === 'ADMIN' || role === 'salonadmin';

        const superAdminPaths = ["/overview", "/salons-management", "/analytics", "/settings/admin"];
        const adminPaths = ["/customers", "/visits", "/rewards-management", "/redemption-requests", "/settings/super-admin"];

        const isTryingSuperAdmin = superAdminPaths.some(p => pathname.startsWith(p));
        const isTryingAdmin = adminPaths.some(p => pathname.startsWith(p));

        if (isTryingSuperAdmin && !isSuperAdmin) {
          router.replace("/");
        } else if (isTryingAdmin && !isSuperAdmin && !isAdmin) {
          router.replace("/auth/login");
        }
      }
    } else {
      // AUTH PATHS (Login, etc.)
      // ONLY redirect away if we HAVE a token AND the API specifically confirms it is valid (isSuccess)
      if (currentToken && isSuccess && pathname !== "/auth/logout") {
        const role = profileRes?.data?.role;
        if (role === 'SUPER_ADMIN' || role === 'superadmin') {
          router.replace("/overview");
        } else {
          router.replace("/");
        }
      }
    }
  }, [isAuthPath, isError, isSuccess, isHydrated, pathname, profileRes, router]);

  if (!isHydrated) return null;

  if (!isAuthPath) {
    if (!token) return null;
    if (isLoading) return <Loading minHeight="100vh" />;
    if (isError) return null;
  }

  return <>{children}</>;
}
