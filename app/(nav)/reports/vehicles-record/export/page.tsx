"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { vehicleRecordReportTableFields } from "../data";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import {
  transformVehicleRecordsData,
  VehicleRecordsResponse,
  VehicleRecordsType,
} from "../types";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import dayjs from "dayjs";

const ExportVehiclesRecord = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [vehiclesRecordTableData, setVehiclesRecordTableData] = useState<
    VehicleRecordsType[]
  >([]);
  const {
    data: vehicleData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<VehicleRecordsResponse>("report/vehicle-records");

  useEffect(() => {
    if (vehicleData) {
      setVehiclesRecordTableData(transformVehicleRecordsData(vehicleData));
    }
  }, [vehicleData]);

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
            <span className="px-2">{`(${dayjs().format("D-MM-YYYY")})`}</span>
          </h1>
        </div>
        <CustomTable
          fields={vehicleRecordReportTableFields}
          data={vehiclesRecordTableData}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef}/>
    </div>
  );
};

export default ExportVehiclesRecord;
