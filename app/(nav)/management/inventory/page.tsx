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
        } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptionsWithRadio={[]} filterWithOptionsWithDropdown={[]} />
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
