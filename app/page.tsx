"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/sign-in");
  }, [router]);

  return null;
};

export default Home;
