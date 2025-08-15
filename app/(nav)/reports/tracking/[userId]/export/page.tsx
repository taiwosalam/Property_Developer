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
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";

dayjs.extend(advancedFormat);

const UserActivitiesExportPage = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);

  const [userActivity, setUserActivity] = useState<UserActivityTable>({
    name: "",
    activities: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });
  const { userId } = useParams();
  const {
    data: activityData,
    loading,
    isNetworkError,
    error,
  } = useFetch<UserActivityResponse>(`report/activities/${userId}`);

  const filteredActivities = useGlobalStore((s) => s.user_activities)

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
  if (error) {
    return <ServerError error={error} />;
  }
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
          data={filteredActivities || []}
          className={`${fullContent && "max-h-none"}`}
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} fullContent={fullContent}/>
    </div>
  );
};

export default UserActivitiesExportPage;
