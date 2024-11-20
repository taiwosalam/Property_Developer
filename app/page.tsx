"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/local-storage";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";

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
  return <PageCircleLoader />;
}
