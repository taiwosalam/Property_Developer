"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import { propertiesReportTablefields, PropertyApiResponse, TransformedPropertyData, transformPropertyData } from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";


const ExportProperties = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });

  const { data, loading, error, isNetworkError } = useFetch<PropertyApiResponse>("/report/properties");

  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyData(data);
      setPageData(transformedData);
    }
  }, [data]);

  const {
    total_properties,
    monthly_properties,
    properties,
  } = pageData

  if (loading) return <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
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
          fields={propertiesReportTablefields}
          data={properties}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default ExportProperties;
