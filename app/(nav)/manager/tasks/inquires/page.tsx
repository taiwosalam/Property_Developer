"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  ICallRequestPageData,
  transformCallbackRequestPageData,
  type RequestCallBackCardDataType,
} from "@/app/(nav)/tasks/inquires/data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";
import { useCallback, useEffect, useRef, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import { CallRequestApiResponse } from "@/app/(nav)/tasks/inquires/type";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import ServerError from "@/components/Error/ServerError";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import CardsLoading from "@/components/Loader/CardsLoading";
import Link from "next/link";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import { debounce } from "lodash";
import { MaintenanceRequestParams } from "@/app/(nav)/tasks/maintenance/data";
import { hasActiveFilters } from "../../reports/data/utils";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import { useSearchParams } from "next/navigation";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const transformToCallBackRequestCardProps = (
  data: RequestCallBackCardDataType
): CallRequestCardProps => {
  return {
    cardType: "callback",
    cardViewDetails: [
      { label: "Phone Number", accessor: "phoneNumber" },
      { label: "Branch", accessor: "branch" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Account Manager", accessor: "accountOfficer" },
      { label: "Property Address", accessor: "propertyAddress" },
      { label: "Unit Name", accessor: "unitName" },
    ],
    ...data,
    unitName: data.unitName ?? "___ ___",
  };
};

const Inquires = () => {
  const [callRequestPageData, setCallRequestPageDate] =
    useState<ICallRequestPageData | null>(null);
  const searchParams = useSearchParams();
  const urlStatus = searchParams.get("status");
  const { role } = useRole();

  // PERMISSIONS
  const canViewCallRequests = usePermission(role, "Can view call request");

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      ...(urlStatus ? { status: urlStatus } : {}),
    } as LandlordRequestParams,
  });

  // Optionally, keep config in sync if user navigates with a different status param
  useEffect(() => {
    if (urlStatus) {
      setConfig((prev) => ({
        ...prev,
        params: { ...prev.params, status: urlStatus },
      }));
    }
  }, [urlStatus]);

  const {
    data: apiData,
    silentLoading,
    loading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<CallRequestApiResponse>(`call-requests`, config);

  useRefetchOnEvent("dispatchRequest", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      const transformData = transformCallbackRequestPageData(apiData);
      setCallRequestPageDate(transformData);
    }
  }, [apiData]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  // const handleAppliedFilter = useCallback(
  //   debounce((filters: FilterResult) => {
  //     setAppliedFilters(filters);
  //     const { menuOptions, startDate, endDate } = filters;
  //     const accountOfficer = menuOptions["Account Officer"] || [];
  //     const status = menuOptions["Status"] || [];
  //     const property = menuOptions["Property"] || [];

  //     const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
  //     if (accountOfficer.length > 0)
  //       queryParams.account_officer_id = accountOfficer.join(",");
  //     if (status.length > 0) queryParams.status = status.join(",");
  //     if (property.length > 0) {
  //       property.forEach((id: string | number, idx: number) => {
  //         (queryParams as any)[`property_ids[${idx}]`] = id;
  //       });
  //     }
  //     if (startDate)
  //       queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
  //     if (endDate)
  //       queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
  //     setConfig({ params: queryParams });
  //   }, 300),
  //   []
  // );

  const handleAppliedFilter = useCallback(
    (filters: FilterResult) => {
      const debouncedFilter = debounce((filters: FilterResult) => {
        setAppliedFilters(filters);
        const { menuOptions, startDate, endDate } = filters;
        const accountOfficer = menuOptions["Account Officer"] || [];
        const status = menuOptions["Status"] || [];
        const property = menuOptions["Property"] || [];

        const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
        if (accountOfficer.length > 0)
          queryParams.account_officer_id = accountOfficer.join(",");
        if (status.length > 0) queryParams.status = status.join(",");
        if (property.length > 0) {
          property.forEach((id: string | number, idx: number) => {
            (queryParams as any)[`property_ids[${idx}]`] = id;
          });
        }
        if (startDate)
          queryParams.start_date = dayjs(startDate).format(
            "YYYY-MM-DD:hh:mm:ss"
          );
        if (endDate)
          queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
        setConfig({ params: queryParams });
      }, 300);

      debouncedFilter(filters);
    },
    [setAppliedFilters, setConfig]
  );

  const contentTopRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
    // Scroll to the top where LandlordCards start
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
    ? [
        ...new Map(
          propertiesData.data.properties.data
            .filter(
              (property: any) =>
                typeof property.request_call_back === "boolean" &&
                property.request_call_back
            )
            .map((property: any) => [
              property.title, // Use property title as the unique key
              {
                label: property.title,
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Request Callback"
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <section className="space-y-9 relative">
      <div className="flex gap-5 py-4 scrollbar-hide overflow-x-auto md:flex-wrap">
        <ManagementStatistcsCard
          total={callRequestPageData?.total_call || 0}
          title="Total Request"
          newData={callRequestPageData?.total_call_month || 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          total={callRequestPageData?.total_resolved_call || 0}
          title="Total Resolved"
          newData={callRequestPageData?.total_resolved_call_month || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          total={callRequestPageData?.total_unresolved || 0}
          title="Total Unresolved"
          newData={callRequestPageData?.total_unresolved_month || 0}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Request Callback"
        aboutPageModalData={{
          title: "Request Callback",
          description:
            "This page contains a list of Request Callback on the platform.",
        }}
        searchInputPlaceholder="Search Call Request"
        handleFilterApply={handleAppliedFilter}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptionsMenu={[
          ...(propertyOptions?.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),
          {
            radio: true,
            label: "Status",
            value: [
              {
                label: "Pending",
                value: "pending",
              },
              {
                label: "Completed",
                value: "completed",
              },
            ],
          },
        ]}
        hasGridListToggle={false}
      />

      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <PropertyrequestSkeletonLoader length={10} />
        </AutoResizingGrid>
      ) : !callRequestPageData?.call_requests?.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Call Back Requests Available"
          body={
            <p>
              There are currently no call back requests. Once a request is
              submitted, the details will appear here. Call back requests help
              you stay connected by allowing clients or tenants to ask for a
              call at a convenient time to discuss any property-related matters.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        callRequestPageData?.call_requests?.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results?
          <section>
            <AutoResizingGrid gap={28} minWidth={380}>
              {callRequestPageData?.call_requests?.map((details, index) => (
                <RequestCallBackCard
                  key={index}
                  {...transformToCallBackRequestCardProps(details)}
                />
              ))}
            </AutoResizingGrid>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={32} minWidth={380}>
            {callRequestPageData?.call_requests.map((userDetails, index) => (
              <RequestCallBackCard
                key={index}
                {...transformToCallBackRequestCardProps(userDetails)}
              />
            ))}
          </AutoResizingGrid>
        </section>
      )}

      {(callRequestPageData?.call_requests?.length ?? 0) > 0 && (
        <Pagination
          className="pb-4"
          totalPages={callRequestPageData?.pagination?.total ?? 1}
          currentPage={callRequestPageData?.pagination?.current_page ?? 1}
          onPageChange={handlePageChange}
        />
      )}

      {/* PERMISSION OVERLAY */}
      {!canViewCallRequests && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 rounded-md flex items-center justify-center text-center px-4">
          <p className="text-sm font-medium text-gray-700">
            ⚠️ You don’t have permission to view call back requests.
          </p>
        </div>
      )}
    </section>
  );
};

export default Inquires;
