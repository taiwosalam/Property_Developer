import { useState, useCallback } from "react";
import useExport from "@/hooks/useExport";

interface UseAgreementExportProps {
  firstPageRef: React.RefObject<HTMLDivElement>;
  restOfContentRef: React.RefObject<HTMLDivElement>;
}

export const useAgreementExport = ({
  firstPageRef,
  restOfContentRef,
}: UseAgreementExportProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { handleDownload: exportDownload } = useExport(
    firstPageRef,
    restOfContentRef
  );

  const handleDownload = useCallback(
    async (unitName: string) => {
      setIsDownloading(true);
      try {
        // Ensure DOM is updated before export
        await new Promise((resolve) =>
          requestAnimationFrame(() => setTimeout(resolve, 0))
        );
        await exportDownload();
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setIsDownloading(false);
      }
    },
    [exportDownload]
  );

  return { handleDownload, isDownloading };
};
