"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("role");
    if (!token || token === null) {
      router.replace("/auth/login");
    }
  }, [router]);



  return <>{children}</>;
}
