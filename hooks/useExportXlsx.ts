import dayjs from "dayjs";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const useExportToXLSX = () => {
  const exportToXLSX = (data: any, tableLabel: string) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      toast.error("Invalid or empty data provided for export");
      return;
    }
    if (!tableLabel || typeof tableLabel !== "string") {
      tableLabel = "Our property report sheet";
    }
    const timestamp = dayjs().format('DD-MM-YYYY h-mm-ss A');

    // special character are not allowed in the file name
    const fileName = `${tableLabel}_${timestamp}.xlsx`;
    const sheetName = `${tableLabel}_${timestamp}`.slice(0, 31);

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return { exportToXLSX };
};
