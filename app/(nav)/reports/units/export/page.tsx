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
import { useState, useEffect } from "react";
import { UnitsReportType, UnitListResponse, transformUnitListData } from "../types";

const ExportUnits = () => {
  const [unitData, setUnitData] = useState<UnitsReportType>({
    total_unit: 0,
    monthly_unit: 0,
    units: [],
  });
  const { data, loading, error, isNetworkError } = useFetch<UnitListResponse>("/report/units");

  useEffect(() => {
    if(data){
      setUnitData(transformUnitListData(data))
    }
  }, [data]);

  const { units } = unitData;

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
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable
        fields={unitsReportTableFields}
        data={units}
        tableHeadClassName="h-[45px]"
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default ExportUnits;
