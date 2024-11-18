"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/local-storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authToken = getLocalStorage("authToken");
    // If user is authenticated, redirect to dashboard
    if (authToken) {
      router.replace("/dashboard");
      return;
    }
    // If user is not authenticated, redirect to sign-in
    router.replace("/auth/sign-in");
  }, [router]);

  // Optional: Show a loading state while redirecting
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="loader" />
    </div>
  );
}
