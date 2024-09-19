"use client";

import Image from "next/image";
import React, { useState } from "react";

// Images
import { GridIcon, ListIcon } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import InventoryCard from "@/components/Management/Inventory/inventory-card";
import InventoryList from "@/components/Management/Inventory/inventory-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";

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
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      <div className="page-title-container">
        <PageTitle title="Inventory" />
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search for Staff and Branch" />
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md",
                state === "list"
                  ? "bg-black text-white"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setListView}
            >
              <ListIcon />
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={clsx(
                "p-1 rounded-md",
                state === "grid"
                  ? "bg-black text-white"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setGridView}
            >
              <GridIcon />
            </button>
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <button>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/icons/sliders.svg"
                  alt="filters"
                  width={20}
                  height={20}
                />
                <p className="text-[#344054] text-base font-medium">Filters</p>
              </div>
            </button>
          </div>
        </div>
      </div>
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
