import React from "react";

// Types
import type { InventoryListInfoProps, InventoryCardDataProps } from "./types";

// Imports
import { inventory_data_props } from "./data";

// Function to split an array into chunks of a specified size
const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// Component
export const InventoryListInfo: React.FC<InventoryListInfoProps> = ({
  data = {},
}) => {
  const keys = Object.keys(inventory_data_props);
  const chunkedKeys = chunkArray(keys, 3); // Split keys into chunks of 3

  return (
    <>
      {chunkedKeys.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className="flex-1 flex gap-10 text-base font-medium capitalize"
        >
          <div className="custom-flex-col gap-4">
            {chunk.map((key) => (
              <p key={`${chunkIndex}-${key}`} className="text-[#747474]">
                {key.split("_").join(" ")}
              </p>
            ))}
          </div>
          <div className="custom-flex-col gap-4">
            {chunk.map((key) => (
              <p key={`${chunkIndex}-${key}`} className="text-black">
                {data[key as keyof InventoryCardDataProps] || "---"}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
