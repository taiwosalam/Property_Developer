"use client";
import { useEffect, useMemo, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  initialRentUnitPageData,
  RentAndUnitFilters,
  RentAndUnitFiltersWithDropdown,
  RentAndUnitState,
  RentUnitApiResponse,
  RentUnitFilterParams,
  RentUnitPageData,
  RentUnitRequestParams,
  transformRentUnitApiResponse,
} from "./data";
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

const RentAndUnit = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [pageData, setPageData] = useState<RentUnitPageData>(initialRentUnitPageData);
  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );



  const [state, setState] = useState<RentAndUnitState>({
    gridView: selectedView === "grid",
    total_pages: 5,
    current_page: 1,
  });

  const { gridView, total_pages, current_page } = state;

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

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<RentUnitApiResponse>(endpoint, config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformRentUnitApiResponse(apiData),
      }));
    }
  }, [apiData])
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
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={pageData?.stats?.month_unit}
          total={pageData?.stats?.total_unit}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Occupied Units"
          newData={pageData?.stats?.month_occupied}
          total={pageData?.stats?.total_occupied}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Vacannt Units"
          newData={pageData?.stats?.month_vacant}
          total={pageData?.stats?.total_vacant}
          className="w-[240px]"
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Expired Units"
          newData={pageData?.stats?.month_expired}
          total={pageData?.stats?.total_expired}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Rent & Unit"
        aboutPageModalData={{
          title: "Rent & Unit",
          description:
            "This page contains a list of Rent & Unit on the platform.",
        }}
        searchInputPlaceholder="Search for Rent and Unit"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptions={RentAndUnitFilters}
        filterOptionsMenu={RentAndUnitFiltersWithDropdown}
      />
      <section className="capitalize space-y-4 px-4 w-full">
        <div className="w-full flex items-center justify-end">
          <div className="flex gap-4 flex-wrap">
            <StatusIndicator statusTitle="vacant" />
            <StatusIndicator statusTitle="occupied" />
            <StatusIndicator statusTitle="active" />
            <StatusIndicator statusTitle="expired" />
            <StatusIndicator statusTitle="relocate" />
          </div>
        </div>
        {view === "grid" || gridView ? (
          <AutoResizingGrid minWidth={315}>
            {pageData?.unit_data?.map((unit, index) => (
              <RentalPropertyCard
                key={index}
                propertyType={unit.property_type as 'rental' | 'facility'}
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
                status={unit.is_active}
                property_type={unit.property_type || ""}
              />
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="space-y-4">
            {pageData?.unit_data?.map((unit, index) => (
              <RentalPropertyListCard
                key={index}
                propertyType={unit.property_type as 'rental' | 'facility'}
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
                status={unit.is_active}
                property_type={unit.property_type || ""}
              />
            ))}
          </div>
        )}
      </section>
      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RentAndUnit;
