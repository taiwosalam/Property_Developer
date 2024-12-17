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
    created_at: dayjs(data.created_at).format("DD/MM/YYYY") || "",
    edited_date: data.edited_date || "",
    property_name: data.property_name || "",
    branch_name: data.branch_name || "",
    account_officer: data.account_officer || "",
  };

  return (
    <KeyValueList
      referenceObject={inventory_data_props}
      data={inventory_data_props}
      chunkSize={chunkSize}
    />
  );
};

export const InventoryField: React.FC<InventoryFieldProps> = ({ children }) => (
  <div className="flex-1 p-3 rounded-[4px] border border-solid border-[#C1C2C366] bg-white dark:bg-[#3C3D37]">
    <p className="text-xs md:text-sm font-normal dark:text-darkText-1">{children || "---"}</p>
  </div>
);
