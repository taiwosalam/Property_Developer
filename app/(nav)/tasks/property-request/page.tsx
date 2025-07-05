"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import {
  PropertyRequestData,
  propertyRequestPageData,
  transformPropertyRequestData,
  type PropertyRequestDataType,
} from "./data";
import { type PropertyRequestCardProps } from "@/components/tasks/CallBack/types";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { PropertyRequestApi } from "./type";
import { Property } from "../../accountant/management/rent-unit/data";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import ServerError from "@/components/Error/ServerError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { FilterResult } from "../inspections/data";
import dayjs from "dayjs";
import { hasActiveFilters } from "../../reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import { getAllStates } from "@/utils/states";

const allStates = getAllStates();

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): PropertyRequestCardProps => {
  return {
    cardType: "property",
    cardViewDetails: [
      { label: "Location (State)", accessor: "state" },
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Property Sub Type", accessor: "subType" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
    ],
    ...data,
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
    location: data.location ?? "",
  };
};

const PropertyRequest = () => {
  const [pageData, setPageData] = useState<propertyRequestPageData | null>(
    null
  );

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const {
    data: propertyRequest,
    loading,
    isNetworkError,
    error,
    silentLoading,
  } = useFetch<PropertyRequestApi>(`property-request/company`, config);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (propertyRequest) {
      const transData = transformPropertyRequestData(propertyRequest);
      setPageData(transData);
    }
  }, [propertyRequest]);

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

    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (statesArray.length > 0) {
      queryParams.state = statesArray.join(",");
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
      <CustomLoader layout="page" pageTitle="Property Request" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Property Request"
          newData={pageData?.total_month || 0}
          total={pageData?.total || 0}
          className="w-[unset]"
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Property Request"
        filterOptionsMenu={[
          {
            label: "State",
            value: allStates.map((state) => ({ label: state, value: state })),
          },
        ]}
        aboutPageModalData={{
          title: "Request",
          description: "This page contains a list of Request on the platform.",
        }}
        searchInputPlaceholder="Search Property Request"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        hasGridListToggle={false}
      />

      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <PropertyrequestSkeletonLoader length={10} />
        </AutoResizingGrid>
      ) : !pageData?.requests.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Property Requests Yet"
          body={
            <p>
              There are currently no property requests submitted by potential
              tenants or occupants. Once a request is made for a specific type
              of property, it will appear here.
              <br />
              <br />
              You will be able to review the request, match it with available
              listings, and respond accordingly to meet the client&apos;s needs.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        pageData.requests.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={28} minWidth={400}>
              {pageData?.requests.map((details, index) => (
                <PropertyRequestCard
                  key={index}
                  {...transformToPropertyRequestCardProps(details)}
                />
              ))}
            </AutoResizingGrid>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={28} minWidth={400}>
            {pageData?.requests.map((details, index) => (
              <PropertyRequestCard
                key={index}
                {...transformToPropertyRequestCardProps(details)}
              />
            ))}
          </AutoResizingGrid>
        </section>
      )}
    </div>
  );
};

export default PropertyRequest;
