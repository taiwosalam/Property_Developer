"use client";

import Image from "next/image";
import React, { CSSProperties } from "react";

// Types
import type { InventoryItemProps } from "./types";

// Images
import ImageBlue from "@/public/icons/image-blue.svg";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import { inventory_conditions } from "./data";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { InventoryField } from "./inventory-components";

const InventoryItem: React.FC<InventoryItemProps> = ({ data, edit }) => {
  const input_styles: CSSProperties = {
    backgroundColor: "white",
  };

  return (
    <div
      className="w-full p-[18px] pb-0 flex-1 bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="pb-[18px] overflow-x-auto custom-round-scrollbar">
        <div className="flex items-center gap-5 2xl:gap-[66px] min-w-[500px]">
          <div className="custom-flex-col gap-6 flex-1 py-2">
            <div className="custom-flex-col gap-2 flex-1">
              {edit ? (
                <Input
                  id="inventory-name"
                  label="Inventory name"
                  className="flex-1"
                  style={input_styles}
                />
              ) : (
                <InventoryField>{data?.name}</InventoryField>
              )}
            </div>
            <div className="flex gap-4">
              {edit ? (
                <>
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
                    options={inventory_conditions}
                    className="flex-1"
                    isSearchable={false}
                  />
                </>
              ) : (
                <>
                  <InventoryField>{data?.quantity}</InventoryField>
                  <InventoryField>{data?.condition}</InventoryField>
                </>
              )}
            </div>
          </div>
          <div className="relative h-full min-h-[165px] aspect-square rounded-2xl overflow-hidden">
            {data?.image && (
              <Image src={data.image} alt="property" fill sizes="200px" />
            )}
            {edit && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="custom-flex-col gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Picture src={ImageBlue} size={40} />
                    <p className="text-brand-9 text-sm font-semibold">
                      Set picture
                    </p>
                  </div>
                  <Button size="base_medium" className="py-1 px-6">
                    select
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
