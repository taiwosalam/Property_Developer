"use client";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import { useParams, useRouter } from "next/navigation";
import { trackingTableFields } from "../data";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import {
  transformUserActivityData,
  UserActivityResponse,
  UserActivityTable,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import {
  BranchFilter,
  FilterResult,
  PropertyFilter,
} from "../../tenants/types";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../../tenants/data";
import dayjs from "dayjs";
import { hasActiveFilters } from "../../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { debounce } from "lodash";

const UserTrackingPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [pageData, setPageData] = useState<UserActivityTable>({
    name: "",
    activities: [],
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredUserActivities = useGlobalStore((s) => s.user_activities);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const {
    address,
    loading: addressLoading,
    error: addressError,
  } = useAddressFromCoords(lat, lng);

  // Store addresses keyed by activity index
  const [addresses, setAddresses] = useState<{
    [key: number]: { address: string; loading: boolean; error: string | null };
  }>({});

  useEffect(() => {
    console.log(
      "Source page - filteredUserActivities:",
      filteredUserActivities
    );
  }, [filteredUserActivities]);

  useEffect(() => {
    if (apiData) setBranches(apiData.data);
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [apiData, staff, property]);

  // Fetch addresses for each activity

  const reportTenantFilterOption = [
    {
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Branch",
      value: branches.map((branch) => ({
        label: branch.branch_name,
        value: branch?.id.toString(),
      })),
    },
    {
      label: "Property",
      value: propertyList.map((property: any) => ({
        label: property.title,
        value: property.id.toString(),
      })),
    },
  ];

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const branch = menuOptions["Branch"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (branch.length > 0) queryParams.branch_id = branch.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const { data, loading, error, isNetworkError } =
    useFetch<UserActivityResponse>(`report/activities/${userId}`, config);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformUserActivityData(data);
      console.log("API data:", data);
      console.log("Transformed data:", transformedData);
      const newActivities = transformedData.activities;
      const currentActivities = useGlobalStore.getState().user_activities;
      if (JSON.stringify(currentActivities) !== JSON.stringify(newActivities)) {
        setPageData(transformedData);
        const activitiesLocation = newActivities.map((activity) => {
          return {
            ...activity,
            location: address?.formattedAddress
              ? address?.formattedAddress
              : "___ ___",
          };
        });
        setGlobalStore("user_activities", activitiesLocation);
      }
      if (transformedData && transformedData.activities.length > 0) {
        transformedData.activities.forEach((activity) => {
          const lat = activity?.latitude;
          const lng = activity?.longitude;
          if (lat && lng) {
            setLat(parseFloat(`${lat}`));
            setLng(parseFloat(`${lng}`));
          }
        });
      }
    }
  }, [data, loading, setGlobalStore]);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="User Tracking Report"
        view="table"
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-6">
      <BackButton bold>{pageData.name}</BackButton>
      <FilterBar
        pageTitle="Tracking"
        azFilter
        isDateTrue
        noExclamationMark
        searchInputPlaceholder="Search for Audit Trail"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exports
        exportHref={`/reports/tracking/${userId}/export`}
        xlsxData={pageData.activities.map((activity, index) => ({
          ...activity,
          location: address?.formattedAddress
            ? address.formattedAddress
            : "___ ___",
        }))}
        fileLabel={"Activities Reports"}
      />
      <section>
        {pageData.activities.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Staff Activities Report Available Yet"
              body={
                <p>
                  Currently, there are no staff activity reports available for
                  export. Once activity records are logged into the system, they
                  will appear here and be ready for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically display all available
                    records related to staff activities as soon as they are
                    generated within the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            data={pageData.activities.map((activity, index) => ({
              ...activity,
              location: address?.formattedAddress
                ? address.formattedAddress
                : "___ ___",
            }))}
            fields={trackingTableFields}
          />
        )}
      </section>
    </div>
  );
};

export default UserTrackingPage;
