"use client"
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
  const { handleDownload: exportDownload, generatePdfFile } = useExport(
    firstPageRef,
    restOfContentRef
  );

  const handleDownload = useCallback(
    async (unitName: string) => {
      setIsDownloading(true);
      try {
        await new Promise((resolve) =>
          requestAnimationFrame(() => setTimeout(resolve, 0))
        );
        // await exportDownload(unitName);
        await exportDownload();
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setIsDownloading(false);
      }
    },
    [exportDownload]
  );

  const generatePdf = useCallback(
    async (fileName: string): Promise<File> => {
      setIsDownloading(true);
      try {
        await new Promise((resolve) =>
          requestAnimationFrame(() => setTimeout(resolve, 0))
        );
        const pdfFile = await generatePdfFile(fileName);
        return pdfFile;
      } catch (err) {
        console.error("PDF generation failed:", err);
        throw err;
      } finally {
        setIsDownloading(false);
      }
    },
    [generatePdfFile]
  );

  return { handleDownload, generatePdfFile: generatePdf, isDownloading };
};
