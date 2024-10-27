import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const PreviewInventory = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-4">
        <BackButton>Olalomi Cottage</BackButton>
        <div
          className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <p className="text-brand-10 dark:text-darkText-1 text-base font-medium">
            Details
          </p>
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
            <InventoryListInfo data={{}} chunkSize={2} />
          </div>
        </div>
      </div>
      <div className="custom-flex-col gap-4">
        <h2 className="text-black dark:text-white text-xl font-medium">
          Added Inventory
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InventoryItem />
          <InventoryItem />
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
        <Button
          href={"/management/inventory/1/manage"}
          size="sm_medium"
          className="py-2 px-7"
        >
          Manage inventory
        </Button>
      </FixedFooter>
    </div>
  );
};

export default PreviewInventory;
