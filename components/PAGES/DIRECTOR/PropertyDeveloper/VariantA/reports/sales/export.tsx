"use client";

import BackButton from "@/components/BackButton/back-button";
import ExportPageHeader from "@/components/reports/export-page-header";
import CustomTable from "@/components/Table/table";
import { clientReportTableFields } from "./data";
import dayjs from "dayjs";
import Signature from "@/components/Signature/signature";
import { useRef } from "react";
import ExportPageFooter from "@/components/reports/export-page-footer";

const PropertyDeveloperReportSalesExportVariantA = () => {
  const exportRef = useRef<HTMLDivElement>(null);

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: `${index + 1}`,
      property_name: `Alabata Road 3 Room 7${index + 1}`,

      clients: `Client ${index + 1}`,
      start_date: `01/01/2000`,
      end_date: `20/06/2005`,
      status: [Math.random() > 0.5 ? "Sold" : "Vacant"],
      annual_rent: `₦${index + 1},000`,
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

export default PropertyDeveloperReportSalesExportVariantA;
