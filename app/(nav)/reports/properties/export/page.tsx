"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import {
  propertiesReportTablefields,
  PropertyApiResponse,
  TransformedPropertyData,
  transformPropertyData,
} from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalStore } from "@/store/general-store";

dayjs.extend(advancedFormat);

const ExportProperties = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });

  const filteredProperties = useGlobalStore((s) => s.properties);


  const { data, loading, error, isNetworkError } =
    useFetch<PropertyApiResponse>("/report/properties");

  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyData(data);
      setPageData(transformedData);
    }
  }, [data]);

 

  const { total_properties, monthly_properties, properties } = pageData;

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
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
          className={`${fullContent && "max-h-none"}`}
          fields={propertiesReportTablefields}
          data={filteredProperties || []}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportProperties;
