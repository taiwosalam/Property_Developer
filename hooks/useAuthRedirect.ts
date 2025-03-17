"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUserStatus } from "@/app/(nav)/data";
import { getLocalStorage } from "@/utils/local-storage";
import Cookies from "js-cookie";
import { useRole } from "./roleContext";

type UseAuthRedirectOptions = {
  skipSetupRedirect?: boolean;
};

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Check if "edit" is present in the query parameters.
  const isEditMode = searchParams.get("edit") !== null;
  // const role = Cookies.get("role") || "";

  const { role, setRole } = useRole();
  const authStoreToken = useAuthStore((state) => state.token);
  const setAuthState = useAuthStore((state) => state.setAuthState);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!authStoreToken) {
        const localAuthToken = getLocalStorage("authToken");
        if (!localAuthToken && role === "director") {
          router.replace("/auth/sign-in");
          return;
        }

        if (!localAuthToken && role !== "director") {
          router.replace("/auth/user/sign-in");
          return;
        }
        setAuthState("token", localAuthToken);
      }

      const status = await getUserStatus();

      // If the URL contains the "edit" param, allow the user to remain on /setup
      if (isEditMode) {
        return;
      }

      if (status === "redirect to setup" && !options.skipSetupRedirect) {
        router.replace("/setup");
        return;
      }

      if (status === "redirect to verify email") {
        router.replace("/auth/sign-up");
        return;
      }
    };

    checkAuthAndRedirect();
  }, [router, authStoreToken, options.skipSetupRedirect]);
};
