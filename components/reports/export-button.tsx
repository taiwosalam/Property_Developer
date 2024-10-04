import { PDFIcon, ExcelIcon } from "@/public/icons/icons";

const ExportButton: React.FC<{
  type: "pdf" | "csv";
}> = ({ type }) => {
  return (
    <button
      type="button"
      className="rounded-lg py-2 px-4 flex items-center gap-2 bg-white border border-[#D0D5DD]"
    >
      {type === "pdf" ? <PDFIcon /> : <ExcelIcon />}
      <span className="text-[#344054] text-sm font-medium">Export</span>
    </button>
  );
};

export default ExportButton;
