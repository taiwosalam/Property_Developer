"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/local-storage";
import { useAuthStore } from "@/store/authStore";

const Home = () => {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  useEffect(() => {
    const authToken = getLocalStorage("authToken");

    if (authToken) {
      setToken(authToken);
      router.replace("/dashboard");
    } else {
      router.replace("/auth/sign-in");
    }
  }, [router, setToken]);

  return null;
};

export default Home;
