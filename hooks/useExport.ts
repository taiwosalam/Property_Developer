import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExport = (ref?: RefObject<HTMLDivElement>) => {
  const handlePrint = () => {
    const printContents = ref && ref.current ? ref.current.innerHTML : document.body.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html><head><title>Print Preview</title><style>body { margin: 0; padding: 20px; font-family: sans-serif; }</style></head><body>${printContents}</body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleDownload = async () => {
    if (!ref || !ref.current) {
      console.error("Ref is not set");
      return;
    }
    const elementToDownload = ref.current;
    const originalCanvas = await html2canvas(elementToDownload);
    const originalCanvasWidth = originalCanvas.width;
    const originalCanvasHeight = originalCanvas.height;

    // Define desired padding (10mm on each side)
    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4; // Convert mm to points (1 inch = 72 points, 1 inch = 25.4mm)
    const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    const scaleFactor = pdfPageWidth / originalCanvasWidth;
    const paddingPixels = Math.round(desiredPaddingPoints / (pdfPageWidth / originalCanvasWidth));

    // Create padded canvas
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = originalCanvasWidth + 2 * paddingPixels;
    paddedCanvas.height = originalCanvasHeight + 2 * paddingPixels;
    const ctx = paddedCanvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
    ctx.drawImage(originalCanvas, paddingPixels, paddingPixels);

    // Pagination with padded content
    const canvas = paddedCanvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pageHeightInPixels = pdfPageHeight / scaleFactor;

    const numPages = Math.ceil(canvasHeight / pageHeightInPixels);

    for (let page = 0; page < numPages; page++) {
      const startY = page * pageHeightInPixels;
      const endY = Math.min(startY + pageHeightInPixels, canvasHeight);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = endY - startY;
      const pageCtx = pageCanvas.getContext('2d')!;
      pageCtx.drawImage(canvas, 0, startY, canvasWidth, endY - startY, 0, 0, canvasWidth, endY - startY);

      const imgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pdfPageWidth, pdfPageHeight);

      if (page < numPages - 1) {
        pdf.addPage();
      }
    }

    pdf.save("report.pdf");
  };

  return { handlePrint, handleDownload };
};

export default useExport;