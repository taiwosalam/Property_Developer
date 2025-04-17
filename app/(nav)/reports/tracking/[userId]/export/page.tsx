"use client";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { trackingTableFields } from "../../data";
import {
  transformUserActivityData,
  UserActivityResponse,
  UserActivityTable,
} from "../types";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const UserActivitiesExportPage = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);

  const [userActivity, setUserActivity] = useState<UserActivityTable>({
    name: "",
    activities: [],
  });
  const { userId } = useParams();
  const {
    data: activityData,
    loading,
    isNetworkError,
    error,
  } = useFetch<UserActivityResponse>(`report/activities/${userId}`);

  useEffect(() => {
    if (activityData) {
      setUserActivity(transformUserActivityData(activityData));
    }
  }, [activityData]);

  const { name, activities } = userActivity;

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">{name}</BackButton>
      <div ref={exportRef}>
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
          fields={trackingTableFields}
          data={activities}
          className={`${fullContent && "max-h-none"}`}
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} fullContent={fullContent}/>
    </div>
  );
};

export default UserActivitiesExportPage;
