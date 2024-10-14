"use client";

// Imports
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import InventoryCard from "@/components/Management/Inventory/inventory-card";
import InventoryList from "@/components/Management/Inventory/inventory-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Inventory = () => {
  const [state, setState] = useState<"grid" | "list">("grid");

  const setGridView = () => {
    setState("grid");
  };
  const setListView = () => {
    setState("list");
  };

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
          />
        </div>

        <Button
          href="/management/inventory/create-inventory"
          className="page-header-button"
        >
          + create new
        </Button>
      </div>
      <FilterBar azFilter gridView={state === "grid"}
        setGridView={setGridView}
        setListView={setListView} onStateSelect={() => { }} pageTitle="Inventory" aboutPageModalData={
          { title: "Inventory", description: "This page contains a list of inventory on the platform." }
        } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptionsWithRadio={[]} filterWithOptionsWithDropdown={inventoryFiltersWithDropdown} />
      {state === "grid" ? (
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
