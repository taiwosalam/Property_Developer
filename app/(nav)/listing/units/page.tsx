"use client";
// Imports
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { initialState, listingUnitFilter, RentAndUnitState, transformRentUnitApiResponse, unit_listing_status, UnitApiResponse, UnitFilterResponse, UnitPageState } from "./data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import { useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { RentUnitFilterParams } from "../../management/rent-unit/data";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const Units = () => {
  const [pageData, setPageData] = useState<UnitPageState>(initialState);
  const {
    total_vacant,
    month_vacant,
    unit: [],
  } = pageData;

  const [state, setState] = useState<RentAndUnitState>({
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
    setPage(1);
  };

  const { menuOptions, startDate, endDate } = appliedFilters;
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  const endpoint =
    isFilterApplied() || search || sort ? "/unit/vacant/list" : "/unit/vacant/lists";

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
      } as RentUnitFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<UnitApiResponse | UnitFilterResponse>(endpoint, config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({ ...x, ...transformRentUnitApiResponse(apiData) }));
      setState((prevState) => ({
        ...prevState,
      }));
    }
  }, [apiData]);
  // Listen for the refetch event
  useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Vacant Units"
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;


  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={pageData.month_vacant}
          total={pageData.total_vacant}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Published Units"
          newData={pageData.published_vacant}
          total={pageData.month_published_vacant}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unpublished Units"
          newData={pageData.unpublished_vacant}
          total={pageData.month_unpublished_vacant}
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Under Moderation"
          newData={34}
          total={657}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Vacant Units"
        aboutPageModalData={{
          title: "Vacant Units",
          description:
            "This page contains a list of Vacant Units on the platform.",
        }}
        searchInputPlaceholder="Search for vacant units"
        handleFilterApply={() => { }}
        isDateTrue={false}
        filterOptionsMenu={listingUnitFilter}
        hasGridListToggle={false}
      />
      <div className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(unit_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
        {pageData.unit.map((item, idx) => (
          <VacantUnitCard
            key={idx}
            unit_data={item}
            status={item.status as "published" | "unpublished"}
          />
        ))}
      </div>
    </div>
  );
};

export default Units;
