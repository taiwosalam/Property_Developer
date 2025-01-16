import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore"; // Adjust the import path if needed

const useRole = () => {
  const [role, setRole] = useState<string | null>(null);

  const setRoleInStore = useAuthStore((state) => state.setAuthState);

  useEffect(() => {
    // Check if role exists in cookies immediately on mount
    const cookieRole = Cookies.get("role");

    if (cookieRole) {
      setRole(cookieRole);
      setRoleInStore("role", cookieRole); // Sync role with Zustand store
    }
  }, [setRoleInStore]);

  return role;
};

export default useRole;