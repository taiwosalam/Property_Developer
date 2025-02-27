"use client";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { trackingTableFields } from "../../data";
import { transformUserActivityData, UserActivityResponse, UserActivityTable } from "../types";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const UserActivitiesExportPage = () => {
  const [userActivity, setUserActivity] = useState<UserActivityTable>({
      name: "",
      activities: [],
    });
  const { userId } = useParams()
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

  const { name, activities } = userActivity

  
  if (loading)
    return <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">{name}</BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable fields={trackingTableFields} data={activities} />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default UserActivitiesExportPage;
