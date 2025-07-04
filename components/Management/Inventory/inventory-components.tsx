"use client";
// Imports
import React, { useState, useEffect } from "react";

// Types
import type {
  InventoryListInfoProps,
  InventoryCardDataProps,
  InventoryFieldProps,
} from "./types";

// Imports
import { getBranch } from "./data";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import dayjs from "dayjs";

// Component
export const InventoryListInfo: React.FC<InventoryListInfoProps> = ({
  data,
  chunkSize = 3,
}) => {
  const inventory_data_props: InventoryCardDataProps = {
    inventory_id: data.inventory_id || "",
    created_date: dayjs(data.created_at).format("DD/MM/YYYY") || "",
    last_edited: dayjs(data.last_edited).format("DD/MM/YYYY") || "",
    // property_name: data.property_name || "",
    branch_name: data.branch_name || "",
    account_officer: data.account_officer || "",
    total_unit: data.total_unit || 0,
  };

  return (
    <KeyValueList
      referenceObject={inventory_data_props}
      data={inventory_data_props}
      chunkSize={chunkSize}
    />
  );
};

export const InventoryField: React.FC<InventoryFieldProps> = ({
  children,
  heading,
}) => (
  <>
    {heading && <p className="mb-2">{heading}</p>}
    <div className="flex-1 p-3 rounded-[4px] border border-solid border-[#C1C2C366] bg-white dark:bg-darkText-primary dark:border dark:border-gray-600">
      <p className="text-xs md:text-sm font-normal dark:text-darkText-1">
        {children || "---"}
      </p>
    </div>
  </>
);
