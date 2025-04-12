"use client";
import { useEffect, useMemo, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
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
} from "../rent-unit/data";
import ServerError from "@/components/Error/ServerError";

const ExpiredUnits = () => {
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
    isFilterApplied() || search || sort
      ? "/unit/filter"
      : `/branch/${branch.branch_id}/vacant_units`;

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
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Rent & Units" />
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9 mt-8">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Expired"
          newData={10}
          total={323}
          className="w-[240px]"
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Expired Units"
        noExclamationMark
        searchInputPlaceholder="Search for expired units"
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
              title="There are no expired units in this branch."
              body={
                <p>
                  This could mean that all units are currently active, there are
                  no outstanding tenant or occupant payments, or no units have
                  been created yet.
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
                    <RentalPropertyCard key={index} {...unit} />
                  ))}
                </AutoResizingGrid>
              ) : (
                <div className="space-y-4">
                  {pageData?.unit.map((unit, index) => (
                    <RentalPropertyListCard key={index} {...unit} />
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

export default ExpiredUnits;
