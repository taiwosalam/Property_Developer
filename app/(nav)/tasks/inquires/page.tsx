"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  getAllCallbackRequests,
  ICallRequestPageData,
  inquiriesFilterOptionsWithDropdown,
  RequestCallBackCardData as MockData,
  transformCallbackRequestPageData,
  type RequestCallBackCardDataType,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";
import { useEffect, useRef, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import { CallRequestApiResponse } from "./type";
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
  };
};

const Inquires = () => {
  const [callRequestPageData, setCallRequestPageDate] =
    useState<ICallRequestPageData | null>(null);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

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

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions["State"] || [];
    const agent = menuOptions["Landlord/Landlady Type"]?.[0];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(",");
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_ids = branchIdsArray.join(",");
    }
    if (agent && agent !== "all") {
      queryParams.agent = agent;
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({
      params: queryParams,
    });
  };

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
    <section className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
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
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptionsMenu={inquiriesFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <section>
        {callRequestPageData &&
        callRequestPageData?.call_requests.length === 0 &&
        !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ Create New Landlord"
              title="The landlord and landlady files are empty"
              body={
                <p>
                  You don&apos;t have any landlord or landlady profiles yet. You
                  can easily create one by clicking on the &quot;Create New
                  Landlord&quot; button and add them using their profile ID.
                  After adding profiles to this page, this guide will disappear.
                  <br />
                  <br />
                  To learn more about this page later, click your profile
                  picture at the top right of the dashboard and select
                  Assistance & Support.
                  <br />
                  <br />
                  Before creating or managing a rental property, you need to
                  create a profile for the landlord or landlady of the property.
                  You can invite them using their email and phone number for
                  registration. If you already have their list, you can add them
                  in bulk using an XML file or add them manually.
                </p>
              }
            />
          )
        ) : (
          <>
            {
              <AutoResizingGrid minWidth={400} gap={28}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  callRequestPageData?.call_requests.map(
                    (userDetails, index) => (
                      <RequestCallBackCard
                        key={index}
                        {...transformToCallBackRequestCardProps(userDetails)}
                      />
                    )
                  )
                )}
              </AutoResizingGrid>
            }

            <Pagination
              totalPages={callRequestPageData?.pagination?.total ?? 1}
              currentPage={callRequestPageData?.pagination?.current_page ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </section>
  );
};

export default Inquires;
