"use client";

import Image from "next/image";
import React, { CSSProperties } from "react";

// Images
import ImageBlue from "@/public/icons/image-blue.svg";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

const InventoryItem = () => {
  const input_styles: CSSProperties = {
    backgroundColor: "white",
  };

  const conditions = ["good", "fair", "bad"];

  return (
    <div
      className="p-[18px] flex items-center gap-[66px] flex-1 bg-white rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-6 flex-1 py-2">
        <div className="custom-flex-col gap-2">
          <Input
            id="inventory-name"
            label="Inventory name"
            className="flex-1"
            style={input_styles}
          />
        </div>
        <div className="flex gap-4">
          <Input
            id="inventory-quantity"
            placeholder="Quantity"
            type="number"
            className="flex-1"
            style={input_styles}
          />
          <Select
            id="inventory-condition"
            placeholder="Condition"
            options={conditions}
            className="flex-1"
            isSearchable={false}
          />
        </div>
      </div>
      <div className="relative h-full aspect-square rounded-2xl overflow-hidden">
        <Image src={SampleProperty6} alt="property" fill sizes="200px" />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <div className="custom-flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Picture src={ImageBlue} size={40} />
              <p className="text-brand-9 text-sm font-semibold">Set picture</p>
            </div>
            <Button size="base_medium" className="py-1 px-6">
              select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
