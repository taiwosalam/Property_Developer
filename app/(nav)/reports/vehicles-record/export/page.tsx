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
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";

const ExportVehiclesRecord = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
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

  const filteredVehicleRecords = useGlobalStore((s) => s.vehicle_records);

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
  if (error) {
    return <ServerError error={error} />;
  }
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
          fields={vehicleRecordReportTableFields}
          data={filteredVehicleRecords || []}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter
        printRef={exportRef}
        setFullContent={setFullContent}
        fullContent={fullContent}
      />
    </div>
  );
};

export default ExportVehiclesRecord;
