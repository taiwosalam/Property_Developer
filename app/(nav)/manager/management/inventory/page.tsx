"use client";

// Imports
import { useEffect, useState, useMemo } from "react";
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

//  Expected structure of apiData
interface InventoryApiData {
  total_pages: number;
  total: number;
  new_inventory_this_month: number;
  data: {
    last_page: number;
    total: number;
    new_inventory_this_month: number;
    data: InventoryCardDataProps[];
  };
  searchQuery: string;
}

const Inventory = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string>(
    selectedOptions.view || "grid"
  );
  // const { branches } = getBranches();
  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const initialState = {
    gridView: selectedView === "grid",
    inventoryPageData: {
      total_pages: 1,
      last_page: 1,
      current_page: 1,
      total_inventory: 0,
      new_inventory_this_month: 0,
      inventory: [] as any[],
    },
  };

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
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

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
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
  } = useFetch<InventoryApiData>(`inventories`, config);
  useRefetchOnEvent("refetchInventory", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      // console.log("apiData", apiData);
      setState((x) => ({
        ...x,
        inventoryPageData: {
          ...x.inventoryPageData,
          inventory: apiData.data.data,
          total_pages: apiData.total_pages,
          last_page: apiData.data.last_page,
          total_inventory: apiData.data.total,
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
    // const agent = menuOptions["Landlord Type"]?.[0];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: InventoryRequestParams = {
      page: 1,
      sort: "asc",
      search: "",
    };
    if (branchIdsArray.length > 0) {
      queryParams.branch_id = branchIdsArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({
      params: queryParams,
    });
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  const inventoryFiltersWithDropdown = [
    {
      label: "Account Officer",
      value: [
        { label: "Account Officer 1", value: "account_officer1" },
        { label: "Account Officer 2", value: "account_officer2" },
        { label: "Account Officer 3", value: "account_officer3" },
      ],
    },
  ];


  return (
    <div className="custom-flex-col gap-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Inventory"
            newData={new_inventory_this_month}
            total={total_inventory}
            colorScheme={1}
          />
        </div>

        <Button
          href="/manager/management/inventory/create-inventory"
          className="page-header-button"
        >
          + create new
        </Button>
      </div>
      <FilterBar
        azFilter
        gridView={selectedView === "grid"}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Inventory"
        aboutPageModalData={{
          title: "Inventory",
          description:
            "This page contains a list of inventory on the platform.",
        }}
        searchInputPlaceholder="Search inventory"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsMenu={inventoryFiltersWithDropdown}
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
              buttonText="+ create new"
              buttonLink="/management/inventory/create-inventory"
              title="You have not created any inventory yet"
              body={
                <p>
                  This section consists of records of all items in the property
                  before renting it out to tenants. These records should be
                  created before creating the property itself. You can create
                  records by clicking on the &quot;Create New&quot; button. To
                  learn more about this page later, you can click on this icon.{" "}
                  <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "}
                  at the top left of the dashboard page.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  inventory.map((item, idx) => (
                    <InventoryCard key={idx} data={item} />
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
                      <InventoryList data={item} />
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
