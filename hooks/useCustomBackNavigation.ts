import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseCustomBackNavigationProps {
  customBackPath?: string;
  condition?: boolean;
}

export const useCustomBackNavigation = ({
  customBackPath,
  condition = true,
}: UseCustomBackNavigationProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!customBackPath || !condition) return;

    const handlePopState = (event: PopStateEvent) => {
      // event.preventDefault();
      router.push(customBackPath);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [customBackPath, condition, router]);
};
