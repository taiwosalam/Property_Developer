"use client";

import React, { CSSProperties } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import useDarkMode from "@/hooks/useCheckDarkMode";

const CreateInventory = () => {
  const isDarkMode = useDarkMode();
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-4">
        <BackButton>Create Inventory</BackButton>
        <div className="flex flex-col md:flex-row gap-8">
          <Input
            id="inventory-title"
            placeholder="Add Title"
            className="flex-1 dark:bg-darkText-primary"
            style={input_styles}
          />
          <Input
            id="video-link"
            placeholder="Video Link"
            className="flex-1"
            style={input_styles}
          />
          <Select
            id="branch-name"
            placeholder="Branch Name"
            options={["branch 1", "branch 2", "branch 3"]}
            isSearchable={false}
            className="bg-white dark:bg-darkText-primary flex-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InventoryItem edit />
        <InventoryItem edit />
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white dark:bg-darkText-primary py-5 px-[60px] flex gap-6 justify-end">
        <Button
          size="sm_medium"
          variant="blank"
          className="py-2 px-7 text-brand-9 bg-brand-1"
        >
          Cler all
        </Button>
        <div className="flex gap-6">
          <Button
            size="sm_medium"
            variant="blank"
            className="py-2 px-7 text-brand-9 bg-brand-1"
          >
            Add more to inventory
          </Button>
          <Button size="sm_medium" className="py-2 px-7">
            save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateInventory;
