"use client";
// Imports
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  initialState,
  listingUnitFilter,
  RentAndUnitState,
  transformRentUnitApiResponse,
  unit_listing_status,
  UnitApiResponse,
  UnitFilterResponse,
  UnitPageState,
} from "./data";
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
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import { ITransformUnitListing, transformUnitApiResponse } from "./pageData";
import { UnitListingApiResponse, UnitListingRequestParams } from "./type";

interface unitListingFilter {
  options: string[];
  menuOptions: { [key: string]: string[] };
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  property: string[] | null;
}

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

  const [appliedFilters, setAppliedFilters] = useState<unitListingFilter>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
    status: null,
    property: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null || status !== null
    );
  };

  const { menuOptions, startDate, endDate } = appliedFilters;
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");
  const [branchId, setBranchId] = useState("");
  const [unitData, setUnitData] = useState<ITransformUnitListing | null>(null);

  const { data: userProfile } = useFetch<{
    data: { branch: { branch_id: number } };
  }>(`/user/profile`);

  const endpoint =
    isFilterApplied() || search || sort
      ? "/unit/vacant/list/filter"
      : "/unit/vacant/lists";

  useEffect(() => {
    if (userProfile) {
      setBranchId(userProfile.data.branch.branch_id.toString());
    }
  }, [userProfile]);

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
        status: appliedFilters.menuOptions["Status"] || [],
        property: appliedFilters.menuOptions["Property"] || [],
        sort_by: sort,
      } as RentUnitFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilterApply = (filters: unitListingFilter) => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const {
    data: unitListingData,
    silentLoading,
    isNetworkError,
    loading,
    error,
    refetch,
  } = useFetch<UnitListingApiResponse>(
    `branch-data/listing/${branchId}`,
    config
  );

  useEffect(() => {
    if (unitListingData) {
      setUnitData(transformUnitApiResponse(unitListingData));
    }
  }, [unitListingData]);

  // const {
  //   data: apiData,
  //   loading,
  //   silentLoading,
  //   isNetworkError,
  //   error,
  //   refetch,
  // } = useFetch<UnitApiResponse | UnitFilterResponse>(endpoint, config); // endpoint // 'branch-data/listing/11'

  //console.log(apiData);

  // useEffect(() => {
  //   if (apiData) {
  //     setPageData((x) => ({ ...x, ...transformRentUnitApiResponse(apiData) }));
  //     setState((prevState) => ({
  //       ...prevState,
  //     }));
  //   }
  // }, [apiData]);
  // // Listen for the refetch event
  useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

  if (loading)
    return (
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Vacant Units" />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={unitData?.total_unit || 0}
          total={0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Published Units"
          newData={unitData?.published_unit || 0}
          total={0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unpublished Units"
          newData={unitData?.unpublished_unit || 0}
          total={0}
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Under Moderation"
          newData={unitData?.under_moderation || 0}
          total={0}
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
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        isDateTrue={false}
        filterOptionsMenu={listingUnitFilter}
        hasGridListToggle={false}
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />
      <section className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(unit_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
        {unitData && unitData.units.length === 0 && !silentLoading ? (
          isFilterApplied() || search ? (
            "No Search/Filter Found"
          ) : (
            <EmptyList
              buttonText="+ Add Unit"
              title="You have not created any unit yet"
              body={
                <p>
                  You can create a property by clicking on the &quot;Add
                  Property&quot; button. You can create two types of properties:
                  rental and facility properties. Rental properties are mainly
                  tailored for managing properties for rent, including landlord
                  and tenant management processes. Facility properties are
                  designed for managing occupants in gated estates, overseeing
                  their due payments, visitor access, and vehicle records.{" "}
                  <br />
                  <br />
                  Once a property is added to this page, this guide will
                  disappear. To learn more about this page in the future, you
                  can click on this icon{" "}
                  <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "}
                  at the top left of the dashboard page.
                  <br />
                  <br />
                  Property creation involves several segments: property
                  settings, details, what to showcase on the dashboard or user
                  app, unit creation, permissions, and assigning staff.
                </p>
              }
            />
          )
        ) : (
          <div className="custom-flex-col gap-4">
            {unitData &&
              unitData.units?.map((item, idx) => (
                <VacantUnitCard
                  key={idx}
                  unit_data={item}
                  status={item.status as "published" | "unpublished"}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Units;
