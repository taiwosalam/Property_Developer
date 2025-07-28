"use client";
import React, { useEffect, useRef, useState } from "react";

// Imports
import ApplicationCard from "@/components/Applications/application-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { DocumentssFilterOptionsWithDropdown } from "../../documents/data";
import useFetch from "@/hooks/useFetch";
import {
  ApplicationResponse,
  IApplicationPageData,
  transformApplicationData,
} from "../tasks/applications/data";
import { transformApiData } from "../../community/agent-forum/threads/[threadId]/preview/data";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { hasActiveFilters } from "../../reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ApplicationStatusItem } from "@/components/Listing/Property/property-listing-component";
import { IPropertyApi } from "../../settings/others/types";
import { rejectApplication } from "../tasks/applications/[applicationId]/manage/data";
import Pagination from "@/components/Pagination/pagination";

const Applications = () => {
  const [pageData, setPagedata] = useState<IApplicationPageData | null>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const {
    data: apiData,
    loading,
    error,
    isNetworkError,
    silentLoading,
    refetch,
  } = useFetch<ApplicationResponse>(`/property-applications/company`, config);

  useRefetchOnEvent("dispatchApplication", () => refetch({ silent: true }));

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

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
    ? [
        ...new Map(
          propertiesData.data.properties.data.map((property: any) => [
            property.title, // Use property title as the unique key
            {
              label: property.title,
              value: property.id.toString(),
            },
          ])
        ).values(),
      ]
    : [];

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const property = menuOptions["Property"] || [];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (property.length > 0) {
      property.forEach((id: string | number, idx: number) => {
        (queryParams as any)[`property_ids[${idx}]`] = id;
      });
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_ids = branchIdsArray.join(",");
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

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  useEffect(() => {
    if (apiData) {
      const transData = transformApplicationData(apiData);
      setPagedata(transData);
    }
  }, [apiData]);

  const handleEvaluation = async (
    id: string,
    flagged: "flagged" | "unflagged",
    status: "evaluated" | "rejected" | "pending" | "approved"
  ) => {
    if (flagged === "flagged" || status === "evaluated") {
      return;
    }
    try {
      const res = await rejectApplication(id, "evaluate");
      if (res) {
        // toast.success("Application evaluated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Application" />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Application"
          newData={pageData?.month_application || 0}
          total={pageData?.total_application || 0}
          colorScheme={1}
        />
        {/* <ManagementStatistcsCard
          title="Mobile Application"
          newData={pageData?.month_mobile_application || 0}
          total={pageData?.mobile_application || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Web Application"
          newData={pageData?.month_web_application || 0}
          total={pageData?.web_application || 0}
          colorScheme={3}
        /> */}
      </div>
      <div className="custom-flex-col gap-5">
        <FilterBar
          azFilter
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Applications"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          dateLabel="Application Date"
          handleFilterApply={handleFilterApply}
          handleSearch={handleSearch}
          onSort={handleSort}
          appliedFilters={appliedFilters}
          filterOptionsMenu={[
            ...(propertyOptions.length > 0
              ? [
                  {
                    label: "Property",
                    value: propertyOptions,
                  },
                ]
              : []),
          ]}
          // filterOptionsMenu={[
          //   ...(DocumentssFilterOptionsWithDropdown),
          //   ...(branchOptions)
          // ]

          //}
        />

        <section>
          {pageData && pageData?.applications?.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-end pb-6">
              <ApplicationStatusItem status="pending" />
              <ApplicationStatusItem status="evaluated" />
              <ApplicationStatusItem status="approved" />
              <ApplicationStatusItem status="rejected" />
            </div>
          )}
          {pageData?.applications?.length === 0 && !loading ? (
            !!config.params.search || hasActiveFilters(appliedFilters) ? (
              <SearchError />
            ) : (
              <EmptyList
                noButton
                title="There are currently no applicants for your property unit."
                body={
                  <p>
                    Once a potential occupant or tenant submits an application
                    for any of your property units, their details will appear
                    here.
                    <br />
                    <br />
                    You will then have the option to either assign rent or
                    decline the application.
                  </p>
                }
              />
            )
          ) : (
            <AutoResizingGrid
              minWidth={300}
              gap={32}
              containerClassName="w-full"
            >
              {pageData && pageData?.applications?.length > 0
                ? pageData?.applications.map((item) => (
                    <div
                      key={item.id}
                      className="w-full"
                      onClick={() =>
                        handleEvaluation(
                          item?.id?.toString(),
                          item?.flagged,
                          item?.application_status
                        )
                      }
                    >
                      <ApplicationCard
                        status={item?.flagged}
                        type={item.application_status}
                        data={item}
                      />
                    </div>
                  ))
                : "No Application Yet"}
            </AutoResizingGrid>
          )}
        </section>
      </div>
      <Pagination
        totalPages={pageData?.pagination?.total_pages || 0}
        currentPage={pageData?.pagination?.current_page || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Applications;
