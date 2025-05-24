import { RefObject, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useDarkMode from "./useCheckDarkMode";
import { toast } from "sonner";

const useMultiPageExport = (pageRefs: RefObject<HTMLDivElement>[]) => {
  const isDarkMode = useDarkMode();
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4;
    const padding = desiredPaddingMM * pointsPerMM;
    const contentWidth = pdfPageWidth - 2 * padding;

    for (let i = 0; i < pageRefs.length; i++) {
      const ref = pageRefs[i];
      if (ref?.current) {
        const canvas = await html2canvas(ref.current, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imageHeight = (canvas.height / canvas.width) * contentWidth;

        if (i > 0) pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.9),
          "JPEG",
          padding,
          padding,
          contentWidth,
          imageHeight
        );
      }
    }

    return pdf;
  };

  const handleDownload = async () => {
    if (isDarkMode) return toast.warning("Please switch to Light Mode to Download");
    try {
      setLoading(true);
      const pdf = await generatePdf();
      pdf.save("Generated_file.pdf");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (isDarkMode) return toast.warning("Please switch to Light Mode to Print");
    try {
      setLoading(true);
      const pdf = await generatePdf();
      const pdfData = pdf.output("blob");
      const url = URL.createObjectURL(pdfData);
      const win = window.open(url);
      if (win) {
        setTimeout(() => win.print(), 1000);
      }
    } catch (err) {
      console.error("Print failed:", err);
      toast.error("Failed to print PDF");
    } finally {
      setLoading(false);
    }
  };

  const generatePdfFile = async (fileName: string): Promise<File> => {
    setLoading(true);
    const pdf = await generatePdf();
    const pdfBlob = pdf.output("blob");
    setLoading(false);
    return new File([pdfBlob], `${fileName || "report"}.pdf`, {
      type: "application/pdf",
    });
  };

  return { handleDownload, handlePrint, generatePdfFile, loading };
};

export default useMultiPageExport;
