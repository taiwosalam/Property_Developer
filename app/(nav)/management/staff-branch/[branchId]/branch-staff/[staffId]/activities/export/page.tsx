"use client";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { staffActivitiesTableFields, activitiesTableData, initialPageData, transformStaffAPIResponse } from "../../data";
import { useParams } from "next/navigation";
import useBranchStore from "@/store/branch-store";
import { useEffect, useState } from "react";
import { StaffAPIResponse, StaffPageTypes } from "../../type";
import useFetch from "@/hooks/useFetch";
import useAddressFromCoords from "@/hooks/useGeoCoding";

const StaffActivitiesExportPage = () => {
  const { branchId, staffId } = useParams();
  const { branch } = useBranchStore();
  const [pageData, setPageData] = useState<StaffPageTypes>(initialPageData);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const { address, loading: addressLoading, error: addressError } = useAddressFromCoords(lat, lng);

  const {
    staff,
    activities,
    chats,
    portfolio
  } = pageData

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<StaffAPIResponse>(`/staff/${staffId}`);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformStaffAPIResponse(apiData),
      }));
    }
  }, [apiData]);

  useEffect(() => {
    if (activities) {
      activities.forEach((activity) => {
        const { location } = activity;
        const { latitude, longitude } = location;
        if (latitude && longitude) {
          setLat(parseFloat(`${latitude}`));
          setLng(parseFloat(`${longitude}`));
        }
      });
    }
  }, [activities]);

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p"> {staff.title} {staff.name} </BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable
        data={activities.map(activity => ({
          ...activity,
          location: address?.formattedAddress ? address?.formattedAddress : 'Location not available', // Safely handle location
        }))}
        fields={staffActivitiesTableFields}
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default StaffActivitiesExportPage;
