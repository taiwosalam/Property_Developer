"use client";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VisitorRequestCard from "@/components/tasks/CallBack/RequestCard";
import {
  transformVisitorRequestData,
  VisitorPageData,
  VisitorRequestData,
  VisitorRequestFilterOptionsWithDropdown,
  type VisitorRequestDataDataType,
} from "./data";
import { type VisitorRequestCardProps } from "@/components/tasks/CallBack/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { FilterResult } from "../inspections/data";
import dayjs from "dayjs";
import { hasActiveFilters } from "../../reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import { PropertyApiResponse } from "../../listing/property/data";
import { IPropertyApi } from "../../settings/others/types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const transformToVisitorRequestCardProps = (
  data: VisitorRequestDataDataType
): VisitorRequestCardProps => {
  return {
    cardType: "visitor",
    cardViewDetails: [
      { label: "Name of Visitor", accessor: "visitorName" },
      { label: "Visotor Phone no", accessor: "visitorPhoneNumber" },
      { label: "Secret Question", accessor: "secretQuestion" },
      { label: "Purpose", accessor: "purpose" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Branch", accessor: "branch" },
    ],
    id: Number(data.requestId),
    tier_id: 0,
    checked_status: "pending",
    checked_in_by: "",
    checked_out_by: "",
    check_out_companion: "",
    check_in_companion: "",
    check_in_inventory: "",
    check_out_inventory: "",
    check_in_time: "",
    check_out_time: "",
    check_in_date: "",
    check_out_date: "",
   
    ...data,
  };
};

const BookVisitorsPage = () => {
  const [pageData, setPageData] = useState<VisitorPageData | null>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const {
    data: visitorsData,
    loading,
    isNetworkError,
    error,
    silentLoading,
    refetch,
  } = useFetch<VisitorRequestsResponse>(`/visitor-requests`, config);

  useRefetchOnEvent("refetchVisitors", () => refetch({ silent: true }));

  useEffect(() => {
    if (visitorsData) {
      const transformedData = transformVisitorRequestData(visitorsData);
      setPageData(transformedData);
    }
  }, [visitorsData]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions =
    propertiesData?.data.properties.data.map((property) => ({
      label: property.title,
      value: property.id.toString(),
    })) || [];

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions["State"] || [];
    const agent = menuOptions["Landlord/Landlady Type"]?.[0];
    const propertyIdsArray = menuOptions["Property"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(",");
    }
    if (propertyIdsArray.length > 0) {
      queryParams.property_ids = propertyIdsArray.join(",");
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

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
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
        pageTitle="Visitation Request"
        statsCardCount={3}
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <section className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          total={pageData?.month_total || 0}
          title="Total Visitors"
          newData={pageData?.total || 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          total={pageData?.month_completed || 0}
          title="Completed"
          newData={pageData?.total_completed || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          total={pageData?.month_pending || 0}
          title="Pending"
          newData={pageData?.total_pending || 0}
          colorScheme={3}
        />
      </div>

      <FilterBar
        azFilter
        pageTitle="Book for Visitation"
        aboutPageModalData={{
          title: "Book for Visitation",
          description:
            "This page contains a list of Book for Visitation on the platform.",
        }}
        searchInputPlaceholder="Search Visitor Request"
        handleFilterApply={handleFilterApply}
        isDateTrue
        dateLabel="Date"
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
        hasGridListToggle={false}
      />
      {loading ? (
        <CardsLoading />
      ) : !pageData?.visitors.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Visitor Requests Available Yet"
          body={
            <p>
              At the moment, there are no visitor requests available. Once
              requests are added to the system, they will appear here.
              <br />
              <br />
              This section will automatically populate with all available data
              as soon as new visitor requests are created in the platform.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        pageData.visitors.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={28} minWidth={400}>
              {pageData.visitors.map((details, index) => (
                <VisitorRequestCard
                  key={details.requestId || index}
                  {...transformToVisitorRequestCardProps(details)}
                />
              ))}
            </AutoResizingGrid>

            <Pagination
              totalPages={pageData?.pagination?.total_pages || 0}
              currentPage={pageData?.pagination?.current_page || 0}
              onPageChange={() => alert("Function not implemented.")}
            />
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={28} minWidth={400}>
            {pageData.visitors.map((details, index) => (
              <VisitorRequestCard
                key={details.requestId || index}
                {...transformToVisitorRequestCardProps(details)}
              />
            ))}
          </AutoResizingGrid>

          <Pagination
            totalPages={pageData?.pagination?.total_pages || 0}
            currentPage={pageData?.pagination?.current_page || 0}
            onPageChange={handlePageChange}
          />
        </section>
      )}
    </section>
  );
};

export default BookVisitorsPage;
