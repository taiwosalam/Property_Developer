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
import { useEffect, useState } from "react";
import { ActivityTable, ActivityApiResponse, transformActivityAData } from "../[userId]/types";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";

const ExportTracking = () => {
  const [activity, setActivity] = useState<ActivityTable[]>([]);
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
    return <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />;
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
        fields={trackingTableFields}
        data={activity}
        tableHeadClassName="h-[45px]"
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default ExportTracking;
