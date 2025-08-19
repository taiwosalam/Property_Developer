"use client";
// Imports
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  initialState,
  listingUnitFilter,
  RentAndUnitState,
  SponsorValueResponse,
  transformRentUnitApiResponse,
  unit_listing_status,
  UnitApiResponse,
  UnitFilterResponse,
  UnitPageState,
} from "./data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import { useEffect, useMemo, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { RentUnitFilterParams } from "@/app/(nav)/management/rent-unit/data";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import CardsLoading from "@/components/Loader/CardsLoading";
import Pagination from "@/components/Pagination/pagination";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import { PropertyListResponse } from "@/app/(nav)/tasks/inspections/type";

const Units = () => {
  const [pageData, setPageData] = useState<UnitPageState>(initialState);
  const {
    total_vacant,
    month_vacant,
    unit: [],
  } = pageData;

  const [state, setState] = useState<RentAndUnitState>({
    total_pages: 1,
    current_page: parseInt(sessionStorage.getItem("units_page") || "1", 10),
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

  const { menuOptions, startDate, endDate } = appliedFilters;
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(
    parseInt(sessionStorage.getItem("units_page") || "1", 10)
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("units_page", page.toString());
  }, [page]);

  // const endpoint =
  //   isFilterApplied() || search || sort
  //     ? "/unit/vacant/list/filter"
  //     : "/unit/vacant/lists";

  const endpoint = "/unit/vacant/lists";
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
        branch: appliedFilters.menuOptions["Branch"] || [],
        property: appliedFilters.menuOptions["Property"],
        status: appliedFilters.menuOptions["Status"]?.[0] || "",
        sort_by: sort,
      } as RentUnitFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
    setPage(1);
    sessionStorage.setItem("units_page", "1");
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    sessionStorage.setItem("units_page", "1");
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    setPage(1);
    sessionStorage.setItem("units_page", "1");
  };

  // Added a ref to the top of the content section
  const contentTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    sessionStorage.setItem("units_page", pageNumber.toString());
    // Scroll to the top where properties card start
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<UnitApiResponse | UnitFilterResponse>(endpoint, config);

  // console.log("apiData", apiData)
  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({ ...x, ...transformRentUnitApiResponse(apiData) }));
      setState((prevState) => ({
        ...prevState,
        last_page: apiData.data.unit.last_page,
        current_page: apiData.data.unit.current_page,
      }));
    }
  }, [apiData]);
  // Listen for the refetch event
  useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const {
    data: sponsors,
    loading: loadingSponsors,
    error: sponsorsErr,
    refetch: refetchSponsorVal,
  } = useFetch<SponsorValueResponse>("/sponsor/value");

  useRefetchOnEvent("refetchRentSponsors", () =>
    refetchSponsorVal({ silent: true })
  );
  const setSponsorValue = useGlobalStore((s) => s.setGlobalInfoStore);
  const getSponsorValue = useGlobalStore((s) => s.getGlobalInfoStore);
  const availableSponsors = getSponsorValue("sponsorValue");

  useEffect(() => {
    if (!loading && sponsors?.data?.value) {
      const parsed = Number(sponsors.data.value.replace(/,/g, ""));

      if (!isNaN(parsed)) {
        setSponsorValue("sponsorValue", parsed);
      }
    }
  }, [loading, sponsors, setSponsorValue]);

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const properties = propertyData?.data || [];

  const uniqueProperties = properties.filter(
    (property, index, self) =>
      self.findIndex((p) => p.title === property.title) === index
  );

  const rentalProperties = uniqueProperties.filter(
    (property) =>
      property.property_type === "rental" && property.units.length > 0
  );

  // Transform into select options
  const propertyOptions = rentalProperties.map((property) => ({
    value: property.id.toString(),
    label: property.title,
  }));



  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Listing Units"
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-9">
      {/* <div className="hidden md:flex gap-5 flex-wrap" ref={contentTopRef}> */}
      <div className="flex gap-5 overflow-x-auto hide-scrollbar md:flex-wrap" ref={contentTopRef}>
        <ManagementStatistcsCard
          title="Total Units"
          newData={pageData.month_vacant}
          total={pageData.total_vacant}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Published Units"
          newData={pageData.month_published_vacant}
          total={pageData.published_vacant}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unpublished Units"
          newData={pageData.month_unpublished_vacant}
          total={pageData.unpublished_vacant}
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Under Moderation"
          newData={pageData.month_moderation_vacant}
          total={pageData.moderation_vacant}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Listing Units"
        aboutPageModalData={{
          title: "Listing Units",
          description:
            "This page contains a list of Listing Units on the platform.",
        }}
        searchInputPlaceholder="Search for Listing units"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        isDateTrue={false}
        filterOptionsMenu={[
          ...listingUnitFilter,
          ...(branchOptions.length > 0
            ? [
                {
                  label: "Branch",
                  value: branchOptions,
                },
              ]
            : []),
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
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />
      <section className="custom-flex-col gap-8">
        {pageData && pageData?.unit.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-end">
            {Object.entries(unit_listing_status).map(([key, value], idx) => (
              <PropertyListingStatusItem
                key={`${key}(${idx})`}
                text={key}
                color={value}
              />
            ))}
          </div>
        )}
        {pageData.unit.length === 0 && !silentLoading ? (
          isFilterApplied() || search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="You have not created any unit yet"
              body={
                <p>
                  You haven&apos;t created any property units yet, or you
                  don&apos;t have any available rentals at the moment. This page
                  automatically lists all available units for moderation before
                  they are approved by an administrator for display on your
                  company website and third-party platforms for marketing.
                  <br />
                  <br />
                  Property units can be created when adding a rental property. A
                  property unit refers to an individual flat, segment of a
                  building, or an entire property itself. For example, a
                  property with four three-bedroom flats is considered a single
                  property, while each three-bedroom flat within the property is
                  a unit. Once created under the property module, these units
                  will be displayed on this page.
                  <br />
                  <br />
                </p>
              }
            />
          )
        ) : (
          <div className="custom-flex-col gap-4">
            {loading ? (
              <CardsLoading />
            ) : (
              pageData.unit.map((item, idx) => (
                <VacantUnitCard
                  key={idx}
                  unit_data={item}
                  availableSponsors={availableSponsors}
                  status={item.status as "published" | "unpublished"}
                />
              ))
            )}
          </div>
        )}
      </section>
      <Pagination
        totalPages={state.last_page}
        currentPage={state.current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Units;
