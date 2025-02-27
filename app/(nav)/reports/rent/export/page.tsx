"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import BackButton from "@/components/BackButton/back-button";
import { rentReportTableFields, transformRentData } from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { RentListResponse, RentReportData } from "../types";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const ExportRent = () => {
  const [rents, setRents] = useState<RentReportData>({
    total_rents: 0,
    current_month_rents: 0,
    rents: [],
  });
  const { data, loading, error, isNetworkError } = useFetch<RentListResponse>(
    "report/rents",
  );

  useEffect(() => {
    if (data) {
      setRents(transformRentData(data));
    }
  }, [data]);

  const { rents: tableData } = rents;

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Export Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;


  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-darkText-1 text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable
        fields={rentReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default ExportRent;
