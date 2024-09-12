"use client";

import React, { CSSProperties } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import Select from "@/components/Form/Select/select";

const CreateInventory = () => {
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: "white",
  };

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-4">
        <h1 className="text-black text-2xl font-medium capitalize">
          Create Inventory
        </h1>
        <div className="flex gap-8">
          <Input
            id="inventory-title"
            placeholder="Add Title"
            className="flex-1"
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
            className="bg-white flex-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <InventoryItem edit />
        <InventoryItem edit />
      </div>
      <div className="sticky bottom-0 right-0 w-full bg-white py-5 px-[60px] flex justify-between">
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
