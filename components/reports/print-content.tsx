"use client";

import useExport from "@/hooks/useExport";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";

interface IPrintContentProps {
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
  setFullContent?: (content: boolean) => void;
  fullContent?: boolean;
  customBackRoute?: string;
  buttonText: string;
}
export const PrintContent = ({
  printRef,
  firstPageRef,
  restOfContentRef,
  setFullContent,
  buttonText,
}: IPrintContentProps) => {
  const { handlePrint, handleDownload } = useExport(
    firstPageRef,
    restOfContentRef,
    printRef
  );
  const [loading, setLoading] = useState<null | "print" | "download">(null);
  const [readyToExport, setReadyToExport] = useState<
    "print" | "download" | null
  >(null);

  const router = useRouter();
  const runWithDOMUpdate = () => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 0);
      });
    });
  };

  const handleExport = async (type: "print" | "download") => {
    setLoading(type);
    setFullContent?.(true);
    setReadyToExport(type);

    await runWithDOMUpdate();

    if (type === "print") {
      await handlePrint();
    } else if (type === "download") {
      await handleDownload();
    }

    // Cleanup
    setFullContent?.(false);
    setReadyToExport(null);
    setLoading(null);
  };

  return (
    <>
      <div>
        <button
          className="flex gap-1 items-center"
          onClick={() => handleExport("print")}
          disabled={loading !== null}
        >
          <Printer />
          {loading === "print" ? "Please wait..." : buttonText}
        </button>
      </div>
    </>
  );
};
