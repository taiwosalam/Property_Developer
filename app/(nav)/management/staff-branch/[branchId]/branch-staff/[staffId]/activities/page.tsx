"use client";
import { LocationIcon } from "@/public/icons/icons";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import { useParams } from "next/navigation";
import { staffActivitiesTableFields, activitiesTableData, initialPageData, transformStaffAPIResponse } from "../data";
import useBranchStore from "@/store/branch-store";
import { useEffect, useState } from "react";
import { StaffAPIResponse, StaffPageTypes } from "../type";
import useFetch from "@/hooks/useFetch";
import useAddressFromCoords from "@/hooks/useGeoCoding";

const StaffActivitiesPage = () => {
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
    <div className="space-y-6">
      <div className="custom-flex-col gap-2">
        <BackButton bold> {branch.branch_name} </BackButton>
        <div className="flex">
          <div className="w-10"></div>
          <div className="flex items-center gap-1 text-text-disabled">
            <LocationIcon />
            <p className="text-sm font-normal">
              {branch.address}
            </p>
          </div>
        </div>
      </div>
      <FilterBar
        pageTitle={staff.name}
        azFilter
        isDateTrue
        noExclamationMark
        handleFilterApply={() => { }}
        searchInputPlaceholder="Search for Audit Trail"
        hasGridListToggle={false}
        exports
        exportHref={`/management/staff-branch/${branchId}/branch-staff/${staffId}/activities/export`}
      />
      <CustomTable
        data={activities.map(activity => ({
          ...activity,
          location: address?.formattedAddress ? address?.formattedAddress : 'Location not available', // Safely handle location
        }))}
        fields={staffActivitiesTableFields}
      />
    </div>
  );
};

export default StaffActivitiesPage;
