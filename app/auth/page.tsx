"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Auth = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/sign-in");
  }, [router]);

  return null;
};

export default Auth;
