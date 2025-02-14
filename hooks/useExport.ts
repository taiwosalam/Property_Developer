import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExport = (ref?: RefObject<HTMLDivElement>) => {
    //   const handlePrint = () => {
    //     window.print();
    //   };

    const handlePrint = () => {
        // Use the ref's content if provided; otherwise, default to the entire body.
        const printContents = ref && ref.current ? ref.current.innerHTML : document.body.innerHTML;
        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
            <html>
              <head>
                <title>Print Preview</title>
                <style>
                  body { margin: 0; padding: 20px; font-family: sans-serif; }
                  /* Add any additional print styles here */
                </style>
              </head>
              <body>
                ${printContents}
              </body>
            </html>
          `);
            printWindow.document.close();
            printWindow.focus();
            // Allow some time for the content to render before printing.
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };


    // const handleDownload = async () => {
    //     if (ref.current) {
    //         const canvas = await html2canvas(ref.current);
    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF();
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    //         pdf.save("report.pdf");
    //     }
    // };

    const handleDownload = async () => {
        // Use the ref's element if available; else default to document.body.
        const elementToDownload = ref && ref.current ? ref.current : document.body;
        const canvas = await html2canvas(elementToDownload);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("report.pdf");
    };

    return { handlePrint, handleDownload };
};

export default useExport;
