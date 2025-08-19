"use client";
import useExport from "@/hooks/useExport";
import { useExportToXLSX } from "@/hooks/useExportXlsx";
import { ExcelIcon, PDFIcon } from "@/public/icons/icons";
import Link from "next/link";

const ExportButton: React.FC<{
  type: "pdf" | "csv";
  href?: string;
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
  data?: any
  fileLabel?: string
}> = ({ type, href, printRef, firstPageRef, restOfContentRef, data, fileLabel }) => {
  const { handlePrint, handleDownload } = useExport(
    firstPageRef,
    restOfContentRef,
    printRef
  );
  const { exportToXLSX } = useExportToXLSX()

  const isDownload = !href;

  return isDownload ? (
    <button 
      // onClick={type === "pdf" ? handlePrint : handleDownload}
      onClick={type === "pdf" ? handleDownload : () => exportToXLSX(data, fileLabel || "default-file-label")}
      className="rounded-lg py-2 px-4 max-sm:p-2 flex items-center sm:gap-2 bg-white dark:bg-darkText-primary border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-text-secondary dark:text-darkText-1 hidden md:block sm:text-sm font-medium">
        Export
      </span>
    </button>
  ) : (
    <Link
      href={href}
      className="rounded-lg py-2 px-4 max-sm:p-2 flex items-center sm:gap-2 bg-white dark:bg-darkText-primary border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-text-secondary dark:text-darkText-1 hidden md:block sm:text-sm font-medium">
        Export
      </span>
    </Link>
  );
};

export default ExportButton;
