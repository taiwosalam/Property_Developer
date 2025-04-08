import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExport = (
  firstPageRef?: RefObject<HTMLDivElement>,
  restOfContentRef?: RefObject<HTMLDivElement>,
  printRef?: RefObject<HTMLDivElement>
) => {
  const handlePrint = async () => {
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    // Define padding in millimeters and convert to points
    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4;
    const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;

    // Calculate content area dimensions
    const contentWidthInPoints = pdfPageWidth - 2 * desiredPaddingPoints;
    const contentHeightInPoints = pdfPageHeight - 2 * desiredPaddingPoints;

    if (printRef && printRef.current) {
      // Use printRef to capture all content as a single unit
      const printCanvas = await html2canvas(printRef.current);
      const printWidth = printCanvas.width;
      const printHeight = printCanvas.height;

      // Calculate page height in pixels for the entire content
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
          pageCanvas.toDataURL("image/png"),
          "PNG",
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
      // Original behavior with firstPageRef and restOfContentRef
      // First page
      const firstPageCanvas = await html2canvas(firstPageRef.current);
      const imageWidthInPoints = contentWidthInPoints;
      const imageHeightInPoints =
        (firstPageCanvas.height / firstPageCanvas.width) * imageWidthInPoints;
      pdf.addImage(
        firstPageCanvas.toDataURL("image/png"),
        "PNG",
        desiredPaddingPoints,
        desiredPaddingPoints,
        imageWidthInPoints,
        imageHeightInPoints
      );

      // Rest of the content
      const restOfContentCanvas = await html2canvas(restOfContentRef.current);
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
          pageCanvas.toDataURL("image/png"),
          "PNG",
          desiredPaddingPoints,
          desiredPaddingPoints,
          imageWidthInPoints,
          imageHeightInPoints
        );
      }
    } else {
      console.error("Required refs are not set");
      return;
    }

    // Generate PDF as blob and trigger print
    const pdfData = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfData);
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      setTimeout(() => {
        printWindow.print();
      }, 1000); // Wait for PDF to load
    }
  };

  const handleDownload = async () => {
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    // Define padding in millimeters and convert to points
    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4;
    const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;

    // Calculate content area dimensions
    const contentWidthInPoints = pdfPageWidth - 2 * desiredPaddingPoints;
    const contentHeightInPoints = pdfPageHeight - 2 * desiredPaddingPoints;

    if (printRef && printRef.current) {
      // Use printRef to capture all content as a single unit
      const printCanvas = await html2canvas(printRef.current);
      const printWidth = printCanvas.width;
      const printHeight = printCanvas.height;

      // Calculate page height in pixels for the entire content
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
          pageCanvas.toDataURL("image/png"),
          "PNG",
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
      // Original behavior with firstPageRef and restOfContentRef
      // First page
      const firstPageCanvas = await html2canvas(firstPageRef.current);
      const imageWidthInPoints = contentWidthInPoints;
      const imageHeightInPoints =
        (firstPageCanvas.height / firstPageCanvas.width) * imageWidthInPoints;
      pdf.addImage(
        firstPageCanvas.toDataURL("image/png"),
        "PNG",
        desiredPaddingPoints,
        desiredPaddingPoints,
        imageWidthInPoints,
        imageHeightInPoints
      );

      // Rest of the content
      const restOfContentCanvas = await html2canvas(restOfContentRef.current);
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
          pageCanvas.toDataURL("image/png"),
          "PNG",
          desiredPaddingPoints,
          desiredPaddingPoints,
          imageWidthInPoints,
          imageHeightInPoints
        );
      }
    } else {
      console.error("Required refs are not set");
      return;
    }

    pdf.save("report.pdf");
  };

  return { handlePrint, handleDownload };
};

export default useExport;
