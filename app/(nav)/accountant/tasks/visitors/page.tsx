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
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { FilterResult } from "../inspections/data";
import dayjs from "dayjs";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import { PropertyApiResponse } from "@/app/(nav)/management/property-draft/data";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { MaintenanceRequestParams } from "../maintenance/data";
import { debounce } from "lodash";

const transformToVisitorRequestCardProps = (
  data: VisitorRequestDataDataType
): VisitorRequestCardProps => {
  return {
    cardType: "visitor",
    cardViewDetails: [
      { label: "Name of Visitor", accessor: "visitorName" },
      { label: "Visitor Phone no", accessor: "visitorPhoneNumber" },
      { label: "Secret Question", accessor: "secretQuestion" },
      { label: "Branch", accessor: "branch" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Unit Name", accessor: "unitName" },
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
    decline_by: "",
    decline_date: "",
    decline_time: "",
    reason: "",
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

  console.log(pageData);

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
    ? [
        ...new Map(
          propertiesData.data.properties.data
            .filter(
              (property: any) =>
                typeof property.book_visitors === "boolean" &&
                property.book_visitors
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

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
    console.log("Task Page changer");
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

  const visitationStatus = {
    label: "Status",
    value: [
      { label: "In-Progress", value: "checked_in" },
      { label: "Completed", value: "checked_out" },
      { label: "Decline", value: "cancelled" },
    ],
  };

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Book for Visitation"
        statsCardCount={3}
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <section className="space-y-9">
      <div className="flex gap-5 py-4 scrollbar-hide overflow-x-auto md:flex-wrap">
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
        handleFilterApply={handleAppliedFilter}
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
          visitationStatus,
        ]}
        hasGridListToggle={false}
      />
      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <PropertyrequestSkeletonLoader length={10} />
        </AutoResizingGrid>
      ) : !pageData?.visitors.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Visitor Requests Available Yet"
          body={
            <p>
              There are currently no visitor requests. Once a visitor submits a
              request, the details will appear here. Visitor requests help you
              manage and approve visits to your properties, ensuring smooth
              scheduling and security.
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
              onPageChange={handlePageChange}
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
            className="pb-4"
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
