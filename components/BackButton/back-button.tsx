"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
// Types
import type { BackButtonProps } from "./types";

// Images
import { ChevronLeft } from "@/public/icons/icons";

const BackButton: React.FC<BackButtonProps> = ({
  children,
  className,
  bold,
  as: Component = "h1",
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className={clsx(
        "text-black dark:text-white flex items-center gap-1",
        className
      )}
    >
      <button
        onClick={handleBack}
        type="button"
        aria-label="Go Back"
        className="p-2"
      >
        <ChevronLeft />
      </button>
      <Component
        className={clsx("text-lg lg:text-xl", {
          "font-bold": bold,
          "font-medium": !bold,
        })}
      >
        {children}
      </Component>
    </div>
  );
};

export default BackButton;
