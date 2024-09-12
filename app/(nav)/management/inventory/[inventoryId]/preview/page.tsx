import React from "react";

// Imports
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";

const PreviewInventory = () => {
  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-4">
        <h1 className="text-black text-2xl font-medium capitalize">
          Olalomi Cottage
        </h1>
        <div
          className="p-6 bg-white rounded-lg custom-flex-col gap-4"
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <p className="text-brand-10 text-base font-medium">Details</p>
          <div className="flex items-center">
            <InventoryListInfo data={{}} chunkSize={2} />
          </div>
        </div>
      </div>
      <div className="custom-flex-col gap-4">
        <h2 className="text-black text-xl font-medium">Added Inventory</h2>
        <div className="flex gap-8"></div>
      </div>
    </div>
  );
};

export default PreviewInventory;
