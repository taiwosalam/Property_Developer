"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { unitsReportTableFields } from "../data";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import useFetch from "@/hooks/useFetch";
import { useState, useEffect, useRef } from "react";
import {
  UnitsReportType,
  UnitListResponse,
  transformUnitListData,
} from "../types";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const ExportUnits = () => {
  const generateTableData = (numItems: number) => {
    const unitTypes = ["Apartment", "Flat", "Hotel"];

    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      unit_id: `76280${index + 1}`,
      property_name: `Property ${index + 1}`,
      unit_name: `Unit ${index + 1}`,
      unit_type: unitTypes[Math.floor(Math.random() * unitTypes.length)],
      status: Math.random() > 0.5 ? "Vacant" : "Sold",
      amount: `client${index + 1}@example.com`,
    }));
  };

  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
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
          fields={unitsReportTableFields}
          data={generateTableData(15)}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
        {/* {signatureData && signatureData?.signatures.length > 0 && <Signature /> } */}
      </div>
      <ExportPageFooter
        printRef={exportRef}
        setFullContent={setFullContent}
        fullContent={fullContent}
      />
    </div>
  );
};

export default ExportUnits;
