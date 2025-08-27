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

import { CompanySignaturesResponse } from "@/components/Signature/signature";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";

dayjs.extend(advancedFormat);

const ExportUnits = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [unitData, setUnitData] = useState<UnitsReportType>({
    total_unit: 0,
    monthly_unit: 0,
    units: [],
  });
  const { data, loading, error, isNetworkError } =
    useFetch<UnitListResponse>("/report/units");

    const filteredUnits = useGlobalStore((s) => s.units);

  const {
    data: signatureData,
    loading: sigLoading,
    error: sigError,
  } = useFetch<CompanySignaturesResponse>("/company-signatures");

  useEffect(() => {
    if (data) {
      setUnitData(transformUnitListData(data));
    }
  }, [data]);

  const { units } = unitData;

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Export Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />

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
          fields={unitsReportTableFields}
          data={filteredUnits || []}
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
