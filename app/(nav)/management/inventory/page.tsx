"use client";

// Imports
import { useEffect, useState, useCallback, useMemo } from "react";
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

//  Expected structure of apiData
interface InventoryApiData {
  total_pages: number;
  total: number;
  new_inventory_this_month: number;
  data: {
    total: number;
    new_inventory_this_month: number;
    data: InventoryCardDataProps[];
  };
  searchQuery: string;
}

const Inventory = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string>(selectedOptions.view || "grid");

  const initialState = {
    gridView: selectedView === "grid",
    searchQuery: "",
    inventoryPageData: {
      total_pages: 1,
      current_page: 1,
      total_inventory: 0,
      new_inventory_this_month: 0,
      inventory: [] as any[],
    },
  };

  const [state, setState] = useState(initialState);
  const {
    gridView,
    inventoryPageData: {
      total_pages,
      current_page,
      total_inventory,
      new_inventory_this_month,
      inventory,
    },
    searchQuery,
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

  const config = useMemo(
    () => ({
      params: { 
        page: current_page,
        search: searchQuery 
      },
    }),
    [current_page, searchQuery]
  );

  const handleSearch = async (query: string) => {
    if (!query && !searchQuery) return;
    setState((prevState) => ({
      ...prevState,
      searchQuery: query,
    }));
  };

  const {
    data: apiData,
    loading,
    error,
    refetch,
    isNetworkError,
    silentLoading
  } = useFetch<InventoryApiData>(`inventories`, config);
  useRefetchOnEvent("refetchInventory", () => refetch({ silent: true }));

    useEffect(() => {
      console.log("Fetching inventory data...");
      if (apiData) {
        console.log("Inventory data received here - :", apiData);
        setState((x) => ({
          ...x,
          inventoryPageData: {
            ...x.inventoryPageData,
            inventory: apiData.data.data,
            total_pages: apiData.total_pages,
            total_inventory: apiData.data.total,
            new_inventory_this_month: apiData.data.new_inventory_this_month,
          },
        }));
      }
      if (error) {
        console.error("Error fetching inventory data:", error);
      }
    }, [apiData, error]);


  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter 
  };

  const handlePageChange = (page: number) => {
    setState((prevState) => ({
      ...prevState,
      inventoryPageData: {
        ...prevState.inventoryPageData,
        current_page: page,
      },
    }));
  };

  if (loading) return( <div className="min-h-[80vh] flex justify-center items-center">
    <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
    </div>
  )

  if (isNetworkError) return <NetworkError />;

  // if (inventory.length === 0) {
  //   return <EmptyList title="You have not created any inventory yet" buttonText="+ create inventory" buttonLink="/management/inventory/create-inventory" />;
  // }

  const inventoryFiltersWithDropdown = [
    {
      label: "Account Officer",
      value: [
        { label: "Account Officer 1", value: "account_officer1" },
        { label: "Account Officer 2", value: "account_officer2" },
        { label: "Account Officer 3", value: "account_officer3" },
      ],
    },
    {
      label: "Branch",
      value: [
        { label: "Branch 1", value: "branch1" },
        { label: "Branch 2", value: "branch2" },
        { label: "Branch 3", value: "branch3" },
      ],
    },
  ]
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
          href="/management/inventory/create-inventory"
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
        onStateSelect={() => {}}
        pageTitle="Inventory"
        aboutPageModalData={{
          title: "Inventory",
          description:
            "This page contains a list of inventory on the platform.",
        }}
        searchInputPlaceholder="Search inventory"
        handleFilterApply={() => {}}
        handleSearch={handleSearch}
        isDateTrue
        filterOptionsWithRadio={[]}
        filterWithOptionsWithDropdown={inventoryFiltersWithDropdown}
      />

      <section className="capitalize">
        {inventory.length === 0 && !silentLoading ? (
          searchQuery ? (
            "No Search Found"
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
                  records by clicking on the &quot;Create New&quot; button. To learn more
                  about this page later, you can click on this icon. <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span> at the top left of the dashboard page.
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
                    <InventoryList key={idx} data={item} />
                  ))
                )}
              </>
            )}
            <Pagination
              totalPages={total_pages}
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
