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
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity, Loader2 } from "lucide-react";
import VirtualizeTable from "@/components/Table/virtualize-table";

const TrackingReport = () => {
  const router = useRouter();
  const [pageData, setPageData] = useState<ActivityTable>({
    activities: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

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

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const {
    address,
    loading: addressLoading,
    error: addressError,
  } = useAddressFromCoords(lat, lng);

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
      label: "Branch",
      value: [
        ...new Map(
          branches.map((branch) => [
            branch.branch_name.toLowerCase(),
            {
              label: branch.branch_name.toLowerCase(),
              value: branch.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Property",
      value: [
        ...new Map(
          propertyList
            .filter((u) => u.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(), // Use lowercase for comparison
              {
                label: property.title.toLowerCase(), // Keep original case for display
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
      const accountOfficer = menuOptions["Account Manager"] || [];
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
    useFetch<ActivityApiResponse>("report/activities", config);

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (data) {
      const transData = transformActivityAData(data);
      setPageData((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.activities
            : [...prev.activities, ...transData.activities],
      }));
      //setGlobalStore("emails", transData.emails);
      setIsFetchingMore(false);
    }
  }, [data, config.params.page, setGlobalStore]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (
      loading ||
      isFetchingMore ||
      !pageData ||
      pageData.activities.length === 0 ||
      pageData.pagination.current_page >= pageData.pagination.last_page
    ) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setConfig((prev) => ({
            ...prev,
            params: { ...prev.params, page: prev.params.page + 1 },
          }));
          setIsFetchingMore(true);
        }
      },
      {
        root: tableContainerRef.current, // Use TableContainer as the scrollable root
        rootMargin: "20px", // Trigger slightly before the bottom
        threshold: 1.0, // Trigger when the last row is fully visible
      }
    );

    if (lastRowRef.current) {
      observerRef.current.observe(lastRowRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, isFetchingMore, pageData]);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformActivityAData(data);
      const newActivities = transformedData;
      const currentActivities = useGlobalStore.getState().activities;
      if (JSON.stringify(currentActivities) !== JSON.stringify(newActivities)) {
        setPageData(transformedData);
        const activitiesLocation = newActivities.activities.map((activity) => {
          return {
            ...activity,
            location: address?.formattedAddress
              ? address?.formattedAddress
              : "___ ___",
          };
        });
        setGlobalStore("activities", activitiesLocation);
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
        xlsxData={pageData.activities?.map((activity) => ({
          ...activity,
          location: address?.formattedAddress
            ? address.formattedAddress
            : "___ ___",
        }))}
        fileLabel={"Activity Reports"}
      />
      <section>
        {pageData?.activities?.length === 0 && !loading ? (
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
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={trackingTableFields}
              data={pageData?.activities?.map((activity) => ({
                ...activity,
                location: address?.formattedAddress
                  ? address.formattedAddress
                  : "___ ___",
              }))}
              tableHeadClassName="h-[45px]"
              handleSelect={handleSelectTableItem}
              lastRowRef={lastRowRef}
            />

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-brand-9" />
              </div>
            )}
            {pageData &&
              pageData.pagination.current_page >=
                pageData.pagination.last_page &&
              pageData.activities.length > 0 && (
                <div className="text-center py-4 text-gray-500"></div>
              )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TrackingReport;
