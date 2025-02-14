"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import { landlordsReportTableFields, landlordsReportTableData, LandlordsReport, LandlordsApiResponse, transformLandlordsData } from "../data";
import ExportPageFooter from "@/components/reports/export-page-footer";
import Signature from "@/components/Signature/signature";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const ExportLandlords = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [landlords_report, setLandlords_report] = useState<LandlordsReport>({
    total_landlords: 0,
    monthly_landlords: 0,
    landlords: [],
  });

  const {
    total_landlords,
    monthly_landlords,
    landlords
  } = landlords_report

  const { data, loading, error, isNetworkError } = useFetch<LandlordsApiResponse>("/report/landlords");

  useEffect(() => {
    if (data) {
      setLandlords_report(transformLandlordsData(data));
    }
  }, [data]);

  if (loading) return <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">

        <ExportPageHeader />
        <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
          Summary
        </h1>
        <CustomTable
          fields={landlordsReportTableFields}
          data={landlordsReportTableData}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default ExportLandlords;
