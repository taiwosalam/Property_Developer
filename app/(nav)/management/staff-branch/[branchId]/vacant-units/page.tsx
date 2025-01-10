

"use client";
import { useEffect, useMemo, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  initialState,
  RentAndUnitFilters,
  RentAndUnitFiltersWithDropdown,
  RentAndUnitState,
  RentUnitFilterParams,
  transformRentUnitApiResponse,
  UnitApiResponse,
  UnitFilterResponse,
  UnitPageState,
} from "../../../rent-unit/data";
import StatusIndicator from "@/components/Management/status-indicator";
import Pagination from "@/components/Pagination/pagination";
import RentalPropertyCard from "@/components/Management/Rent And Unit/rental-property-card";
import RentalPropertyListCard from "@/components/Management/Rent And Unit/rental-property-list";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import { FilterResult } from "@/components/Management/Landlord/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark, LocationIcon } from "@/public/icons/icons";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import BackButton from "@/components/BackButton/back-button";
import useBranchStore from "@/store/branch-store";

const RentAndUnit = () => {
  const view = useView();
  const { branch } = useBranchStore();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [pageData, setPageData] = useState<UnitPageState>(initialState);

  const {
    total_unit,
    total_occupied,
    total_vacant,
    total_active,
    total_expired,
    total_relocate,
    month_unit,
    month_occupied,
    month_vacant,
    month_active,
    month_expired,
    month_relocate,
    unit: [],
  } = pageData;

  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );
  const [state, setState] = useState<RentAndUnitState>({
    gridView: selectedView === "grid",
    total_pages: 1,
    current_page: 1,
    last_page: 1,
  });


  const { gridView, total_pages, current_page, last_page } = state;

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
  const statesArray = menuOptions["State"] || [];
  const agent = menuOptions["Landlord Type"]?.[0];
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  const endpoint =
    isFilterApplied() || search || sort ? "/unit/filter" : "/unit/list";

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

  // console.log("config", config)

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  // console.log("Braches", branchOptions)
// endpoint - /branch/8/vacant_units
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

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      gridView: selectedView === "grid",
    }));
  }, [selectedView]);

  const setGridView = () => {
    setSelectedOption("view", "grid");
    setSelectedView("grid");
  };

  const setListView = () => {
    setSelectedOption("view", "list");
    setSelectedView("list");
  };

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Rent & Units"
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9 mt-8">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {branch.branch_name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">{branch.address}</p>
          </div>
        </BackButton>
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Vacant Units"
        aboutPageModalData={{
          title: "Vacant Units",
          description:
            "This page contains a list of vacant units on the platform.",
        }}
        searchInputPlaceholder="Search for vacant units"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptions={RentAndUnitFilters}
        filterOptionsMenu={[
          ...RentAndUnitFiltersWithDropdown,
          ...(branchOptions.length > 0
            ? [
              {
                label: "Branch",
                value: branchOptions,
              },
            ]
            : []),
        ]}
      />
      <section className="capitalize">
        {pageData?.unit.length === 0 && !silentLoading ? (
          isFilterApplied() || search ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No Search/Filter Result Found
            </div>
          ) : (
            <EmptyList
              buttonText="Create New Unit"
              buttonLink="/management/rent-unit/create"
              title="No Unit Found"
              body={
                <p>
                  You can create a Unit by clicking on the &quot;Add
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
          <>
            <section className="capitalize space-y-4 px-4 w-full">
              {view === "grid" || gridView ? (
                <AutoResizingGrid minWidth={315}>
                  {pageData?.unit.map((unit, index) => (
                    <RentalPropertyCard
                      key={index}
                      propertyType={unit.propertyType as 'rental' | 'facility'}
                      unitId={unit.unitId || ""}
                      images={unit.images}
                      unit_title={unit.unit_title}
                      unit_name={unit.unit_name}
                      unit_type={unit.unit_type}
                      tenant_name={unit.tenant_name || ""}
                      expiry_date={unit.expiry_date || ""}
                      rent={unit.rent || ""}
                      caution_deposit={unit.caution_deposit || ""}
                      service_charge={unit.service_charge}
                      status={unit.status || ""}
                      property_type={unit.propertyType || ""}
                    />
                  ))}
                </AutoResizingGrid>
              ) : (
                <div className="space-y-4">
                  {pageData?.unit.map((unit, index) => (
                    <RentalPropertyListCard
                      key={index}
                      propertyType={unit.propertyType as 'rental' | 'facility'}
                      unitId={unit.unitId || ""}
                      images={unit.images}
                      unit_title={unit.unit_title}
                      unit_name={unit.unit_name}
                      unit_type={unit.unit_type}
                      tenant_name={unit.tenant_name || ""}
                      expiry_date={unit.expiry_date || ""}
                      rent={unit.rent || ""}
                      caution_deposit={unit.caution_deposit || ""}
                      service_charge={unit.service_charge}
                      status={unit.status || ""}
                      property_type={unit.propertyType || ""}
                    />
                  ))}
                </div>
              )}
            </section>
            <Pagination
              totalPages={last_page}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default RentAndUnit;
