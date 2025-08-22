"use client";

import { useRouter } from "next/navigation";

// Types
import type { BackButtonProps } from "./types";
import { cn } from "@/lib/utils";

import { ChevronLeft } from "@/public/icons/icons";

const BackButton: React.FC<BackButtonProps> = ({
  children,
  className,
  bold,
  as: Component = "h1",
  textClassName,
  reducePaddingTop,
  customBackPath,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (customBackPath) {
      router.push(customBackPath);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        "text-black dark:text-white flex items-center gap-1 pt-8 pb-4 sm:pt-2",
        className
      )}
    >
      <button
        onClick={handleBack}
        type="button"
        aria-label="Go Back"
        className={cn("p-2", reducePaddingTop && "pt-[0.1rem]")}
      >
        <ChevronLeft />
      </button>
      <Component
        className={cn(
          "text-lg lg:text-xl capitalize",
          {
            "font-bold": bold,
            "font-medium": !bold,
          },
          textClassName
        )}
      >
        {children}
      </Component>
    </div>
  );
};

export default BackButton;
