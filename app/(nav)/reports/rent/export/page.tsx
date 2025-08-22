"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import BackButton from "@/components/BackButton/back-button";
import { rentReportTableFields, transformRentData } from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { RentListResponse, RentReportData } from "../types";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalStore } from "@/store/general-store";

dayjs.extend(advancedFormat);

const ExportRent = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [rents, setRents] = useState<RentReportData>({
    total_rents: 0,
    current_month_rents: 0,
    rents: [],
  });
  const { data, loading, error, isNetworkError } =
    useFetch<RentListResponse>("report/rents");

  const filteredRents = useGlobalStore((s) => s.rents);

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
          fields={rentReportTableFields}
          data={filteredRents || []}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportRent;
