"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface FullPageLoaderProps {
  text?: string;
  className?: string;
  onClose?: () => void; // Optional close button for testing
}

const FullPageLoader = ({
  text = "Loading...",
  className,
  onClose,
}: FullPageLoaderProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    console.log("FullPageLoader: Not mounted, skipping render");
    return null;
  }

  const target = typeof document !== "undefined" ? document.body : null;

  if (!target) {
    console.log("FullPageLoader: document.body not found");
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[99999] bg-white/50 backdrop-blur-sm flex items-center justify-center flex-col space-y-4 h-screen w-screen",
        className
      )}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
      aria-busy="true"
      role="alert"
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-medium text-gray-700">{text}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[100000] py-2 px-3 bg-white text-gray-600 hover:text-black text-xl font-bold rounded-full shadow"
        >
          ×
        </button>
      )}
    </div>,
    target
  );
};

export default FullPageLoader;