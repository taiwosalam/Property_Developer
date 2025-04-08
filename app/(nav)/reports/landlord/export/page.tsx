"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import {
  landlordsReportTableFields,
  landlordsReportTableData,
  LandlordsReport,
  LandlordsApiResponse,
  transformLandlordsData,
} from "../data";
import ExportPageFooter from "@/components/reports/export-page-footer";
import Signature from "@/components/Signature/signature";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const ExportLandlords = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [landlords_report, setLandlords_report] = useState<LandlordsReport>({
    total_landlords: 0,
    monthly_landlords: 0,
    landlords: [],
  });

  const { total_landlords, monthly_landlords, landlords } = landlords_report;

  const { data, loading, error, isNetworkError } =
    useFetch<LandlordsApiResponse>("/report/landlords");

  useEffect(() => {
    if (data) {
      setLandlords_report(transformLandlordsData(data));
    }
  }, [data]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;
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
          fields={landlordsReportTableFields}
          className={`${fullContent && "max-h-none"}`}
          data={landlords}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportLandlords;
