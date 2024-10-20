import React from "react";

// Types
import type {
  InventoryListInfoProps,
  InventoryCardDataProps,
  InventoryFieldProps,
} from "./types";

// Imports
import { inventory_data_props } from "./data";
import KeyValueList from "@/components/KeyValueList/key-value-list";

// Component
export const InventoryListInfo: React.FC<InventoryListInfoProps> = ({
  data = {},
  chunkSize = 3,
}) => {
  return (
    <KeyValueList
      referenceObject={inventory_data_props}
      data={data}
      chunkSize={chunkSize}
    />
  );
};

export const InventoryField: React.FC<InventoryFieldProps> = ({ children }) => (
  <div className="flex-1 p-3 rounded-[4px] border border-solid border-[#C1C2C366] bg-white dark:bg-[#3C3D37]">
    <p className="text-xs md:text-sm font-normal dark:text-darkText-2">{children || "---"}</p>
  </div>
);
