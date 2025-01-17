"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/local-storage";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { getDashboardPage } from "./(onboarding)/auth/data";
import Cookies from 'js-cookie'

export default function Home() {
  const router = useRouter();
  const role = Cookies.get('role') || "";
  const dashboardPage = getDashboardPage(role)

  useEffect(() => {
    const authToken = getLocalStorage("authToken");
    // If user is authenticated, redirect to dashboard
    if (authToken) {
      router.replace(dashboardPage);
      return;
    }
    // If user is not authenticated, redirect to sign-in
    router.replace("/auth/sign-in");
  }, [router]);

  // Optional: Show a loading state while redirecting
  return <PageCircleLoader />;
}
