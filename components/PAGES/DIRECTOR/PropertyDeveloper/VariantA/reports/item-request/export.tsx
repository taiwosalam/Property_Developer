"use client";

import BackButton from "@/components/BackButton/back-button";
import ExportPageHeader from "@/components/reports/export-page-header";
import CustomTable from "@/components/Table/table";
import { clientReportTableFields } from "./data";
import dayjs from "dayjs";
import Signature from "@/components/Signature/signature";
import { useRef } from "react";
import ExportPageFooter from "@/components/reports/export-page-footer";

const PropertyDeveloperItemRequestReportExportVariantA = () => {
  const exportRef = useRef<HTMLDivElement>(null);

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      request_id: `5778723${index + 1}`,
      staff_name: `Adelakun Tunde ${index + 1}`,
      categories: `Food, Drink, Beverages`,
      units: `KG`,
      quantity: Math.floor(Math.random() * 100),
      amount: `₦${(index + 1) * 1000}`,
      status: Math.random() > 0.5 ? "Completed" : "Cancelled",
    }));
  };

  const tableData = generateTableData(15);
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div className="space-y-9">
        <ExportPageHeader />
        <div className="space-y-3">
          <h1 className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
            Summary{" "}
            <span className="px-2">{`(${dayjs().format(
              "Do MMMM YYYY"
            )})`}</span>
          </h1>
        </div>
        <CustomTable
          fields={clientReportTableFields}
          data={tableData}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default PropertyDeveloperItemRequestReportExportVariantA;
