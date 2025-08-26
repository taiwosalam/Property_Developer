"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";

import {
  propertiesReportTablefields,
  PropertyApiResponse,
  transformPropertyData,
  TransformedPropertyData,
} from "@/app/(nav)/reports/properties/data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalStore } from "@/store/general-store";
import { clientReportTableFields } from "./data";

dayjs.extend(advancedFormat);

const PropertyDeveloperPropertiesExportReportVariantA = () => {

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      properties: `Bodija Property ${index + 1}}`,

      branch: `Branch ${index + 1}`,
      branch_manager: `Adedimeji Oluwokan ${index + 1}`,
      date: `20/03/1${index}`,
    }));
  };

  
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });

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
          fields={clientReportTableFields}
          data={generateTableData(15)}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default PropertyDeveloperPropertiesExportReportVariantA;