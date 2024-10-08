import Link from "next/link";
// Icons
import { PDFIcon, ExcelIcon } from "@/public/icons/icons";

const ExportButton: React.FC<{
  type: "pdf" | "csv";
  href?: string;
}> = ({ type, href = "#" }) => {
  return (
    <Link
      href={href}
      className="rounded-lg py-2 px-4 flex items-center gap-2 bg-white border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-[#344054] text-sm font-medium">Export</span>
    </Link>
  );
};

export default ExportButton;
