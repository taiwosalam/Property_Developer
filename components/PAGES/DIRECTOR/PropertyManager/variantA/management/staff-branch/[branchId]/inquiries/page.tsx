"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  getAllCallbackRequests,
  ICallRequestPageData,
  inquiriesFilterOptionsWithDropdown,
  RequestCallBackCardData as MockData,
  transformCallbackRequestPageData,
  type RequestCallBackCardDataType,
} from "@/app/(nav)/tasks/inquires/data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";
import { useCallback, useEffect, useRef, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import BackButton from "@/components/BackButton/back-button";
import { LocationIcon } from "@/public/icons/icons";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import useBranchStore from "@/store/branch-store";
import { useParams, useSearchParams } from "next/navigation";
import { CallRequestApiResponse } from "@/app/(nav)/tasks/inquires/type";
import useFetch from "@/hooks/useFetch";
// import { LandlordRequestParams } from "../../../landlord/data";
import { LandlordRequestParams } from "@/app/(nav)/management/landlord/data";
import { AxiosRequestConfig } from "axios";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { FilterResult } from "@/components/Management/Landlord/types";
import { debounce } from "lodash";
import { MaintenanceRequestParams } from "@/app/(nav)/tasks/maintenance/data";
import dayjs from "dayjs";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const transformToCallBackRequestCardProps = (
  data: RequestCallBackCardDataType
): CallRequestCardProps => {
  return {
    cardType: "callback",
    cardViewDetails: [
      { label: "Phone Number", accessor: "phoneNumber" },
      { label: "Branch", accessor: "branch" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Account Officer", accessor: "accountOfficer" },
      { label: "Property Address", accessor: "propertyAddress" },
    ],
    ...data,
    unitName: data.unitName ?? "",
  };
};

const BranchInquires = () => {
  const { branchId } = useParams();
  const { branch } = useBranchStore();
  const [callRequestPageData, setCallRequestPageDate] =
    useState<ICallRequestPageData | null>(null);
  const [requestCallBackCardData, setRequestCallBackCardData] = useState<
    RequestCallBackCardDataType[]
  >([]);
  const searchParams = useSearchParams();
  const urlStatus = searchParams.get("status");

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      ...(urlStatus ? { status: urlStatus } : {}),
    } as LandlordRequestParams,
  });

  const {
    data: apiData,
    silentLoading,
    loading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<CallRequestApiResponse>(
    `call-requests?branch_ids[0]=${branchId}`,
    config
  );

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

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
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
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
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
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Inquiries" />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <section className="space-y-9">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {branch?.branch_name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">{branch?.address}</p>
          </div>
        </BackButton>
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
          totalPages={callRequestPageData?.pagination?.total ?? 1}
          currentPage={callRequestPageData?.pagination?.current_page ?? 1}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default BranchInquires;
