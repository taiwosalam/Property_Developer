"use client";

// Imports
import { useEffect, useState, useCallback } from "react";
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
}

const Inventory = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string>(selectedOptions.view || "grid");

  const initialState = {
    gridView: selectedView === "grid",
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
  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<InventoryApiData>(`/inventories?page=${current_page}`);
  
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

  useRefetchOnEvent("refetchInventory", () => refetch({ silent: true }));

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((prevState) => ({
      ...prevState,
      inventoryPageData: {
        ...prevState.inventoryPageData,
        current_page: page,
      },
    }));
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center">
    <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
    </div>;

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
          description: "This page contains a list of inventory on the platform.",
        }}
        searchInputPlaceholder="Search inventory"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsWithRadio={[]}
        filterWithOptionsWithDropdown={inventoryFiltersWithDropdown}
      />
      {selectedView === "grid" ? (
        <AutoResizingGrid gap={28} minWidth={330}>
          {inventory && inventory.map((item, idx) => (
            <InventoryCard key={idx} data={item} />
          ))}
        </AutoResizingGrid>
      ) : (
        <div className="custom-flex-col gap-[18px]">
          {inventory && inventory.map((item, idx) => (
            <InventoryList key={idx} data={item} />
          ))}
        </div>
      )}
      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Inventory;
