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
import { useImageUploader } from "@/hooks/useImageUploader";
import { ImageIcon } from "@/public/icons/icons";
import useDarkMode from "@/hooks/useCheckDarkMode";

const InventoryItem: React.FC<InventoryItemProps> = ({ data, edit }) => {
  const isDarkMode = useDarkMode();
  const { preview, inputFileRef, handleImageChange } = useImageUploader({
    placeholder: data?.image,
  });

  const input_styles: CSSProperties = {
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  const selectImage = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <div
      className="w-full p-[18px] pb-0 flex-1 bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="pb-[18px]">
        <div className="flex flex-wrap-reverse items-center gap-5 2xl:gap-[66px]">
          <div className="custom-flex-col gap-6 flex-1 py-2 min-w-[240px]">
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
                    placeholder="Quantity / Unit"
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
            <Image
              src={preview}
              alt="property"
              fill
              sizes="200px"
              className="object-cover"
            />
            {edit && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              >
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  accept="image/*"
                  ref={inputFileRef}
                  className="hidden pointer-events-none"
                  onChange={handleImageChange}
                />
                <div className="custom-flex-col gap-6">
                  <div className="flex flex-col items-center gap-2 custom-primary-color">
                    <ImageIcon />
                    <p className="text-brand-9 text-sm font-semibold">
                      Set picture
                    </p>
                  </div>
                  <Button
                    onClick={selectImage}
                    size="base_medium"
                    className="py-1 px-6"
                  >
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
