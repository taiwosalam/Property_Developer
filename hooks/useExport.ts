import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useDarkMode from "./useCheckDarkMode";
import { toast } from "sonner";

const useExport = (
  firstPageRef?: RefObject<HTMLDivElement>,
  restOfContentRef?: RefObject<HTMLDivElement>,
  printRef?: RefObject<HTMLDivElement>
) => {
  const isDarkMode = useDarkMode();

  console.log("isDarkMode", isDarkMode)
  const generatePdf = async () => {
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4;
    const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;
    const contentWidthInPoints = pdfPageWidth - 2 * desiredPaddingPoints;
    const contentHeightInPoints = pdfPageHeight - 2 * desiredPaddingPoints;

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (printRef && printRef.current) {
      const printCanvas = await html2canvas(printRef.current, {
        // backgroundColor: null,
        backgroundColor: "#ffffff",
        scale: 1.5,
        useCORS: true,
        logging: true,
      }).catch((err) => {
        console.error("html2canvas error for printRef:", err);
        throw err;
      }); 
      const printWidth = printCanvas.width;
      const printHeight = printCanvas.height;

      const pageHeightInPixels =
        (contentHeightInPoints / contentWidthInPoints) * printWidth;
      const numPages = Math.ceil(printHeight / pageHeightInPixels);

      for (let page = 0; page < numPages; page++) {
        const startY = page * pageHeightInPixels;
        const endY = Math.min(startY + pageHeightInPixels, printHeight);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = printWidth;
        pageCanvas.height = endY - startY;
        const pageCtx = pageCanvas.getContext("2d")!;
        pageCtx.drawImage(
          printCanvas,
          0,
          startY,
          printWidth,
          endY - startY,
          0,
          0,
          printWidth,
          endY - startY
        );

        const imageWidthInPoints = contentWidthInPoints;
        const imageHeightInPoints =
          (pageCanvas.height / pageCanvas.width) * imageWidthInPoints;

        if (page > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          pageCanvas.toDataURL("image/jpeg", 0.7),
          "JPEG",
          desiredPaddingPoints,
          desiredPaddingPoints,
          imageWidthInPoints,
          imageHeightInPoints
        );
      }
    } else if (
      firstPageRef &&
      firstPageRef.current &&
      restOfContentRef &&
      restOfContentRef.current
    ) {
      const firstPageCanvas = await html2canvas(firstPageRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: true,
      }).catch((err) => {
        console.error("html2canvas error for firstPageRef:", err);
        throw err;
      });
      const imageWidthInPoints = contentWidthInPoints;
      const imageHeightInPoints =
        (firstPageCanvas.height / firstPageCanvas.width) * imageWidthInPoints;
      pdf.addImage(
        firstPageCanvas.toDataURL("image/jpeg", 0.7),
        "JPEG",
        desiredPaddingPoints,
        desiredPaddingPoints,
        imageWidthInPoints,
        imageHeightInPoints
      );

      const restOfContentCanvas = await html2canvas(restOfContentRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: true,
      }).catch((err) => {
        console.error("html2canvas error for restOfContentRef:", err);
        throw err;
      });
      const restOfContentWidth = restOfContentCanvas.width;
      const restOfContentHeight = restOfContentCanvas.height;

      const pageHeightInPixels =
        (contentHeightInPoints / contentWidthInPoints) * restOfContentWidth;
      const numPages = Math.ceil(restOfContentHeight / pageHeightInPixels);

      for (let page = 0; page < numPages; page++) {
        const startY = page * pageHeightInPixels;
        const endY = Math.min(startY + pageHeightInPixels, restOfContentHeight);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = restOfContentWidth;
        pageCanvas.height = endY - startY;
        const pageCtx = pageCanvas.getContext("2d")!;
        pageCtx.drawImage(
          restOfContentCanvas,
          0,
          startY,
          restOfContentWidth,
          endY - startY,
          0,
          0,
          restOfContentWidth,
          endY - startY
        );

        const imageHeightInPoints =
          (pageCanvas.height / pageCanvas.width) * imageWidthInPoints;

        pdf.addPage();
        pdf.addImage(
          pageCanvas.toDataURL("image/jpeg", 0.7),
          "JPEG",
          desiredPaddingPoints,
          desiredPaddingPoints,
          imageWidthInPoints,
          imageHeightInPoints
        );
      }
    } else {
      throw new Error("Required refs are not set");
    }

    return pdf;
  };

  const handlePrint = async () => {
    if(isDarkMode) return toast.warning("Please switch to Light Mode to Print")
    try {
      const pdf = await generatePdf();
      const pdfData = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfData);
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
    } catch (err) {
      console.error("Print failed:", err);
    }
  };

  const handleDownload = async () => {
    if(isDarkMode) return toast.warning("Please switch to Light Mode to Download")
    try {
      const pdf = await generatePdf();
      // pdf.save(`${fileName || "report"}.pdf`);
      pdf.save(`${"Generated_file"}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      throw err;
    }
  };

  // const handleDownload = async () => {
  //   const pdf = new jsPDF();
  //   const pdfPageWidth = pdf.internal.pageSize.getWidth();
  //   const pdfPageHeight = pdf.internal.pageSize.getHeight();

  //   // Define padding in millimeters and convert to points
  //   const desiredPaddingMM = 10;
  //   const pointsPerMM = 72 / 25.4;
  //   const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;

  //   // Calculate content area dimensions
  //   const contentWidthInPoints = pdfPageWidth - 2 * desiredPaddingPoints;
  //   const contentHeightInPoints = pdfPageHeight - 2 * desiredPaddingPoints;

  //   if (printRef && printRef.current) {
  //     // Use printRef to capture all content as a single unit
  //     const printCanvas = await html2canvas(printRef.current);
  //     const printWidth = printCanvas.width;
  //     const printHeight = printCanvas.height;

  //     // Calculate page height in pixels for the entire content
  //     const pageHeightInPixels =
  //       (contentHeightInPoints / contentWidthInPoints) * printWidth;
  //     const numPages = Math.ceil(printHeight / pageHeightInPixels);

  //     for (let page = 0; page < numPages; page++) {
  //       const startY = page * pageHeightInPixels;
  //       const endY = Math.min(startY + pageHeightInPixels, printHeight);
  //       const pageCanvas = document.createElement("canvas");
  //       pageCanvas.width = printWidth;
  //       pageCanvas.height = endY - startY;
  //       const pageCtx = pageCanvas.getContext("2d")!;
  //       pageCtx.drawImage(
  //         printCanvas,
  //         0,
  //         startY,
  //         printWidth,
  //         endY - startY,
  //         0,
  //         0,
  //         printWidth,
  //         endY - startY
  //       );

  //       const imageWidthInPoints = contentWidthInPoints;
  //       const imageHeightInPoints =
  //         (pageCanvas.height / pageCanvas.width) * imageWidthInPoints;

  //       if (page > 0) {
  //         pdf.addPage();
  //       }
  //       pdf.addImage(
  //         pageCanvas.toDataURL("image/png"),
  //         "PNG",
  //         desiredPaddingPoints,
  //         desiredPaddingPoints,
  //         imageWidthInPoints,
  //         imageHeightInPoints
  //       );
  //     }
  //   } else if (
  //     firstPageRef &&
  //     firstPageRef.current &&
  //     restOfContentRef &&
  //     restOfContentRef.current
  //   ) {
  //     // Original behavior with firstPageRef and restOfContentRef
  //     // First page
  //     const firstPageCanvas = await html2canvas(firstPageRef.current);
  //     const imageWidthInPoints = contentWidthInPoints;
  //     const imageHeightInPoints =
  //       (firstPageCanvas.height / firstPageCanvas.width) * imageWidthInPoints;
  //     pdf.addImage(
  //       firstPageCanvas.toDataURL("image/png"),
  //       "PNG",
  //       desiredPaddingPoints,
  //       desiredPaddingPoints,
  //       imageWidthInPoints,
  //       imageHeightInPoints
  //     );

  //     // Rest of the content
  //     const restOfContentCanvas = await html2canvas(restOfContentRef.current);
  //     const restOfContentWidth = restOfContentCanvas.width;
  //     const restOfContentHeight = restOfContentCanvas.height;

  //     const pageHeightInPixels =
  //       (contentHeightInPoints / contentWidthInPoints) * restOfContentWidth;
  //     const numPages = Math.ceil(restOfContentHeight / pageHeightInPixels);

  //     for (let page = 0; page < numPages; page++) {
  //       const startY = page * pageHeightInPixels;
  //       const endY = Math.min(startY + pageHeightInPixels, restOfContentHeight);
  //       const pageCanvas = document.createElement("canvas");
  //       pageCanvas.width = restOfContentWidth;
  //       pageCanvas.height = endY - startY;
  //       const pageCtx = pageCanvas.getContext("2d")!;
  //       pageCtx.drawImage(
  //         restOfContentCanvas,
  //         0,
  //         startY,
  //         restOfContentWidth,
  //         endY - startY,
  //         0,
  //         0,
  //         restOfContentWidth,
  //         endY - startY
  //       );

  //       const imageHeightInPoints =
  //         (pageCanvas.height / pageCanvas.width) * imageWidthInPoints;

  //       pdf.addPage();
  //       pdf.addImage(
  //         pageCanvas.toDataURL("image/png"),
  //         "PNG",
  //         desiredPaddingPoints,
  //         desiredPaddingPoints,
  //         imageWidthInPoints,
  //         imageHeightInPoints
  //       );
  //     }
  //   } else {
  //     console.error("Required refs are not set");
  //     return;
  //   }

  //   pdf.save("report.pdf");
  // };

  const generatePdfFile = async (fileName: string): Promise<File> => {
    try {
      const pdf = await generatePdf();
      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], `${fileName || "report"}.pdf`, {
        type: "application/pdf",
      });
      console.log("Generated PDF size:", file.size / (1024 * 1024), "MB");
      return file;
    } catch (err) {
      console.error("PDF file generation failed:", err);
      throw err;
    }
  };

  return { handlePrint, handleDownload, generatePdfFile };
};

export default useExport;
