import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
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
        <div className="grid grid-cols-2 gap-8">
          <InventoryItem />
          <InventoryItem />
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button
          href={"/management/inventory/1/manage"}
          size="sm_medium"
          className="py-2 px-7"
        >
          Manage inventory
        </Button>
      </div>
    </div>
  );
};

export default PreviewInventory;
