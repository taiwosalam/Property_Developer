"use client";

// Imports
import { useEffect, useState } from "react";
import Button from "@/components/Form/Button/button";
import InventoryCard from "@/components/Management/Inventory/inventory-card";
import InventoryList from "@/components/Management/Inventory/inventory-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";
import { toast } from "sonner";
import { createInventory } from "../data";

const Inventory = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();

  const [selectedView, setSelectedView] = useState<string>(selectedOptions.view || "grid");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsCreating(true);
    try {
      const success = await createInventory(data);
      if (success) {
        toast.success("Inventory created successfully");
      }
    } catch (error) {
      toast.error("Failed to create inventory");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    // Sync selectedView with selectedOptions.view on mount
    setSelectedView(selectedOptions.view || "grid");
  }, [selectedOptions.view]);

  const setGridView = () => {
    setSelectedOption("view", "grid");
    setSelectedView("grid"); // Update local state
  };

  const setListView = () => {
    setSelectedOption("view", "list");
    setSelectedView("list"); // Update local state
  };

  // const [state, setState] = useState<"grid" | "list">("grid");

  // useEffect(() => {
  //   setState(selectedView === "grid" ? "grid" : "list");
  // }, [selectedView]);

  // const setGridView = () => {
  //   setSelectedOption("view", "grid");
  // };

  // const setListView = () => {
  //   setSelectedOption("view", "list");
  // };

  // const setGridView = () => {
  //   setState("grid");
  // };
  // const setListView = () => {
  //   setState("list");
  // };

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
            title="Total Records"
            newData={20}
            total={100}
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
      <FilterBar azFilter gridView={selectedView === "grid"}
        setGridView={setGridView}
        setListView={setListView}
        onStateSelect={() => { }}
        pageTitle="Inventory"
        aboutPageModalData={{ title: "Inventory", description: "This page contains a list of inventory on the platform." }}
        searchInputPlaceholder="Search inventory"
        handleFilterApply={() => { }}
        isDateTrue
        filterOptionsWithRadio={[]}
        filterWithOptionsWithDropdown={inventoryFiltersWithDropdown} />
      {selectedView === "grid" ? (
        <AutoResizingGrid gap={28} minWidth={330}>
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <InventoryCard key={idx} data={{}} />
            ))}
        </AutoResizingGrid>
      ) : (
        <div className="custom-flex-col gap-[18px]">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <InventoryList key={idx} data={{}} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
