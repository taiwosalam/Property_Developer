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
  ApplicationApiResponse,
  IApplicationPageData,
  transformApplicationData,
} from "./data";
import { transformApiData } from "../../management/agent-community/threads/[threadId]/preview/data";
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
  } = useFetch<ApplicationApiResponse>(`property-applications`, config);

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
    const propertyArray = menuOptions["Property"] || [];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (propertyArray.length > 0) {
      queryParams.states = propertyArray.join(",");
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

  const propertyOptions = [];

  useEffect(() => {
    if (apiData) {
      const transData = transformApplicationData(apiData);
      setPagedata(transData);
    }
  }, [apiData]);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Landlords/Landladies (Owners)"
      />
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
        <ManagementStatistcsCard
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
        />
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
          onSort={handleSort}
          appliedFilters={appliedFilters}
          filterOptionsMenu={[]}
          // filterOptionsMenu={[
          //   ...(DocumentssFilterOptionsWithDropdown),
          //   ...(branchOptions)
          // ]

          //}
        />

        <section>
          {pageData?.applications?.length === 0 && !loading ? (
            !!config.params.search || hasActiveFilters(appliedFilters) ? (
              <SearchError />
            ) : (
              <EmptyList
                noButton
                title="No Application Yet"
                body={
                  <p>
                    At the moment, there are no landlord or landlady profiles
                    available for export. Once profile records are added to the
                    system, they will appear here and be available for download
                    or export.
                    <br />
                    <br />
                    <p>
                      This section will automatically populate with all
                      available data as soon as new landlord or landlady
                      profiles are created or imported into the platform.
                    </p>
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
              {pageData && pageData?.applications?.length > 0 ? (
                pageData?.applications.map((item) => (
                  <ApplicationCard
                    key={item.id}
                    status="flagged"
                    type="guest"
                    {...item}
                  />
                ))
              ) : (
                <p>No Application Data</p>
              )}
              {/* <ApplicationCard status="flagged" type="staff" />
              <ApplicationCard status="unflagged" type="guest" />
              <ApplicationCard status="unflagged" type="staff" /> */}
            </AutoResizingGrid>
          )}
        </section>
      </div>
    </div>
  );
};

export default Applications;
