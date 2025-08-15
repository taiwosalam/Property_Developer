"use client";

import CustomTable from "@/components/Table/table";
import { trackingTableFields } from "../data";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { config } from "process";
import { useEffect, useRef, useState } from "react";
import {
  ActivityTable,
  ActivityApiResponse,
  transformActivityAData,
} from "../[userId]/types";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalStore } from "@/store/general-store";

dayjs.extend(advancedFormat);

const ExportTracking = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [activity, setActivity] = useState<ActivityTable>({
    activities: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });
  const [fullContent, setFullContent] = useState(false);

  const filteredActivities = useGlobalStore((s) => s.activities);

  const {
    data: activityData,
    loading,
    isNetworkError,
    error,
  } = useFetch<ActivityApiResponse>("report/activities");

  useEffect(() => {
    if (activityData) {
      setActivity(transformActivityAData(activityData));
    }
  }, [activityData]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />
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
          fields={trackingTableFields}
          data={filteredActivities || []}
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

export default ExportTracking;
