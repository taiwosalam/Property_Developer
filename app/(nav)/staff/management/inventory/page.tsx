"use client";

// Imports
import { useEffect, useState, useMemo, useRef } from "react";
import Button from "@/components/Form/Button/button";
import InventoryCard from "@/components/Management/Inventory/inventory-card";
import InventoryList from "@/components/Management/Inventory/inventory-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { InventoryCardDataProps } from "@/components/Management/Inventory/types";
import Pagination from "@/components/Pagination/pagination";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import getBranches from "@/hooks/getBranches";
import { AxiosRequestConfig } from "axios";
import { InventoryRequestParams } from "./type";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import useStaffRoles from "@/hooks/getStaffs";
import { inventoryFIltersOptionsWithDropdown } from "./data";
import ServerError from "@/components/Error/ServerError";
import CustomLoader from "@/components/Loader/CustomLoader";
import { usePersonalInfoStore } from "@/store/personal-info-store";

//  Expected structure of apiData
interface InventoryApiData {
  current_page: number;
  total: number;
  new_inventory_this_month: number;
  data: {
    last_page: number;
    total: number;
    current_page: number;
    new_inventory_this_month: number;
    used_inventory: number;
    unused_inventory: number;
    month_used_inventory: number;
    month_unused_inventory: number;
    data: InventoryCardDataProps[];
  };
  searchQuery: string;
}

const Inventory = () => {
  const view = useView();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const {
    getManagers,
    getStaffs,
    getAccountOfficers,
    loading: loadingStaffs,
    error: staffsError,
  } = useStaffRoles();
  const accountOfficers = getAccountOfficers();

  const [selectedView, setSelectedView] = useState<string>(
    selectedOptions.view || "grid"
  );

  const initialState = {
    gridView: selectedView === "grid",
    inventoryPageData: {
      total_pages: 1,
      last_page: 1,
      current_page: 1,
      total_inventory: 0,
      new_inventory_this_month: 0,
      used_inventory: 0,
      unused_inventory: 0,
      month_used_inventory: 0,
      month_unused_inventory: 0,
      inventory: [] as any[],
    },
  };

  const accountOfficersOptions =
    accountOfficers?.map((o) => ({
      label: o.name,
      value: `${o.id}`,
    })) || [];

  const [state, setState] = useState(initialState);
  const {
    gridView,
    inventoryPageData: {
      total_pages,
      last_page,
      current_page,
      total_inventory,
      new_inventory_this_month,
      used_inventory,
      unused_inventory,
      month_used_inventory,
      month_unused_inventory,
      inventory,
    },
    // searchQuery,
  } = state;

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

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      sort: "asc",
    } as InventoryRequestParams,
  });

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  // Added a ref to the top of the content section
  const contentTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
    // Scroll to the top where inventories start
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order },
    });
  };

  const {
    data: apiData,
    loading,
    error,
    refetch,
    isNetworkError,
    silentLoading,
  } = useFetch<InventoryApiData>("/inventories", config);
  useRefetchOnEvent("refetchInventory", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        inventoryPageData: {
          ...x.inventoryPageData,
          inventory: apiData.data.data,
          total_pages: apiData.data.last_page,
          current_page: apiData.data.current_page,
          last_page: apiData.data.last_page,
          total_inventory: apiData.data.total,
          used_inventory: apiData.data.used_inventory,
          unused_inventory: apiData.data.unused_inventory,
          month_used_inventory: apiData.data.month_used_inventory,
          month_unused_inventory: apiData.data.month_unused_inventory,
          new_inventory_this_month: apiData.data.new_inventory_this_month,
        },
      }));
    }
    if (error) {
    }
  }, [apiData, error]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const accountOfficerArray = menuOptions["Account Officer"] || [];
    const status = menuOptions["Status"]?.[0];

    const queryParams: InventoryRequestParams = {
      page: 1,
      sort: "asc",
      search: "",
    };
    if (accountOfficerArray.length > 0) {
      queryParams.accountOfficer_id = accountOfficerArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    if (status) {
      queryParams.status = status === "used" ? "used" : "unused";
    }
    setConfig({
      params: queryParams,
    });
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Inventory" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-9">
      <div className="page-header-container mt-4 md:mt-0" ref={contentTopRef}>
        <div className="flex overflow-x-auto md:overflow-hidden gap-3 no-scrollbar flex-nowrap md:flex-wrap w-full px-2">
          <ManagementStatistcsCard
            title="Total Records"
            newData={new_inventory_this_month}
            total={total_inventory}
            colorScheme={1}
          />
        </div>
      </div>
      <FilterBar
        azFilter
        gridView={selectedView === "grid"}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Inventory"
        searchInputPlaceholder="Search"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsMenu={[
          ...inventoryFIltersOptionsWithDropdown,
          ...(accountOfficersOptions.length > 0
            ? [
                {
                  label: "Account Officer",
                  value: accountOfficersOptions,
                },
              ]
            : []),
        ]}
        appliedFilters={appliedFilters}
        handleSearch={handleSearch}
        onSort={handleSort}
      />

      <section className="capitalize">
        {inventory.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              buttonLink="/accountant/management/inventory/create-inventory"
              title="You have not created any inventory yet"
              body={
                <p>
                  This section consists of records of all items in the property
                  before renting it out to tenants.
                  <br />
                  <br />
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={350}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  inventory.map((item, idx) => (
                    <InventoryCard key={idx} data={item} page="account" />
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <>
                {silentLoading ? (
                  <TableLoading />
                ) : (
                  inventory.map((item, idx) => (
                    <div key={idx} className="mb-4">
                      <InventoryList data={item} page="account" />
                    </div>
                  ))
                )}
              </>
            )}
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

export default Inventory;
