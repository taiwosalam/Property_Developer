"use client";

import React, { useEffect, useMemo, useState } from "react";

// Imports
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { property_listing_status } from "@/components/Listing/Property/data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  DraftPropertyFilterParams,
  DraftPropertyState,
  initialState,
  listingPropertyFilter,
  PropertyApiResponse,
  PropertyPageState,
  transformDraftUnitData,
} from "./data";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const Property = () => {
  const [pageData, setPageData] = useState<PropertyPageState>(initialState);

  const [state, setState] = useState<DraftPropertyState>({
    total_pages: 1,
    current_page: 1,
    last_page: 1,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const { menuOptions, startDate, endDate } = appliedFilters;
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const endpoint =
    isFilterApplied() || search || sort
      ? "/unit/vacant/list/filter"
      : "/property/invite/lists";

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page,
        date_from: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        date_to: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        branch_id: appliedFilters.menuOptions["Branch"] || [],
        state: appliedFilters.menuOptions["State"] || [],
        property_type: appliedFilters.menuOptions["Property Type"]?.[0],
        sort_by: sort,
      } as DraftPropertyFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<PropertyApiResponse | any>(endpoint, config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({ ...x, ...transformDraftUnitData(apiData) }));
      setState((prevState) => ({
        ...prevState,
      }));
    }
  }, [apiData]);

  // Listen for the refetch event
  useRefetchOnEvent("refetchPropertyDraft", () => refetch({ silent: true }));

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Property Draft & Request"
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Property"
          newData={pageData.current_month_property}
          total={pageData.total_property}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Drafted"
          newData={pageData.current_month_draft}
          total={pageData.total_draft}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Request"
          newData={pageData.current_month_invite}
          total={pageData.total_invite}
          className="w-[240px]"
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Property Draft & Request"
        aboutPageModalData={{
          title: "Moderating Property",
          description:
            "This page contains a list of Moderating Property on the platform.",
          video: "",
        }}
        searchInputPlaceholder="Search"
        handleFilterApply={() => {}}
        isDateTrue={false}
        filterOptionsMenu={listingPropertyFilter}
        hasGridListToggle={false}
      />
      <div className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(property_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
        {pageData.properties.map((property) => (
          <PropertyListingCard
            key={property.id}
            data={property as any}
            status={property.status}
            propertyType={property.property_type as "rental" | "gated"}
          />
        ))}
      </div>
    </div>
  );
};

export default Property;
