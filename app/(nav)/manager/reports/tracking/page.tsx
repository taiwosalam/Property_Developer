"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsListingsFilterOptionsWithDropdown,
  trackingTableFields,
} from "./data";
import {
  ActivityApiResponse,
  ActivityTable,
  transformActivityAData,
} from "./[userId]/types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity } from "lucide-react";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const TrackingReport = () => {
  const router = useRouter();
  const [pageData, setPageData] = useState<ActivityTable[]>([]);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
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

  useEffect(() => {
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [apiData, staff, property]);

  const reportTenantFilterOption = [
    {
      label: "Account Manager",
      value: [
        ...new Map(
          branchAccountOfficers.map((staff: any) => [
            staff.user.name.toLowerCase(), // Use lowercase for comparison
            {
              label: staff.user.name.toLowerCase(), // Keep original case for display
              value: staff.user.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Property",
      value: [
        ...new Map(
          propertyList.map((property: any) => [
            property.title.toLowerCase(), // Use lowercase for comparison
            {
              label: property.title, // Keep original case for display
              value: property.id.toString(),
            },
          ])
        ).values(),
      ],
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
      const property = menuOptions["Property"] || [];
      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/report/activities?branch_id=${BRANCH_ID}`
      : null;

  const { data, loading, error, isNetworkError } =
    useFetch<ActivityApiResponse>(`/report/activities`, config);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformActivityAData(data);
      const newActivities = transformedData;
      const currentActivities = useGlobalStore.getState().activities;
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
        setGlobalStore("activities", activitiesLocation);
      }

      if (transformedData && transformedData.length > 0) {
        transformedData.forEach((activity) => {
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

  const handleSelectTableItem = (item: DataItem) => {
    router.push(`/reports/tracking/${item.id}`);
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Tracking"
        aboutPageModalData={{
          title: "Tracking",
          description: "This page contains a list of Tracking on the platform.",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/tracking/export"
        xlsxData={pageData.map((activity) => ({
          ...activity,
          location: address?.formattedAddress
            ? address.formattedAddress
            : "___ ___",
        }))}
        fileLabel={"Activity Reports"}
      />
      <section>
        {pageData.length === 0 && !loading ? (
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
            fields={trackingTableFields}
            data={pageData.map((activity) => ({
              ...activity,
              location: address?.formattedAddress
                ? address.formattedAddress
                : "___ ___",
            }))}
            tableHeadClassName="h-[45px]"
            handleSelect={handleSelectTableItem}
          />
        )}
      </section>
    </div>
  );
};

export default TrackingReport;
