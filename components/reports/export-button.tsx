"use client";
import useExport from "@/hooks/useExport";
import { ExcelIcon, PDFIcon } from "@/public/icons/icons";
import Link from "next/link";

const ExportButton: React.FC<{
  type: "pdf" | "csv";
  href?: string;
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
}> = ({ type, href, printRef, firstPageRef, restOfContentRef }) => {
  const { handlePrint, handleDownload } = useExport(
    firstPageRef,
    restOfContentRef,
    printRef
  );

  const isDownload = !href;

  return isDownload ? (
    <button
      // onClick={type === "pdf" ? handlePrint : handleDownload}
      onClick={handleDownload}
      className="rounded-lg py-2 px-4 flex items-center gap-2 bg-white dark:bg-darkText-primary border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-text-secondary dark:text-darkText-1 text-sm font-medium">
        Export
      </span>
    </button>
  ) : (
    <Link
      href={href}
      className="rounded-lg py-2 px-4 flex items-center gap-2 bg-white dark:bg-darkText-primary border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-text-secondary dark:text-darkText-1 text-sm font-medium">
        Export
      </span>
    </Link>
  );
};

export default ExportButton;
