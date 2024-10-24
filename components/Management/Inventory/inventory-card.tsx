"use client";

import React, { useState } from "react";

// Types
import type { InventoryCardDataProps, InventoryCardProps } from "./types";

// Images
import ClipboardCheck from "@/public/icons/clipboard-check.svg";

// Imports
import { empty } from "@/app/config";
import { inventory_data_props } from "./data";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";

const InventoryCard: React.FC<InventoryCardProps> = ({ data, viewOnly }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="custom-flex-col gap-4 pb-5 rounded-lg bg-white dark:bg-darkText-primary overflow-hidden">
      <div
        onClick={() => setIsOpened(true)}
        className="w-full h-[174px] flex items-center justify-center bg-black/20 dark:bg-darkText-2 cursor-pointer"
      >
        <Picture
          src={ClipboardCheck}
          alt="clipboard with check mark"
          size={100}
        />
        <PopupImageModal
          isOpen={isOpened}
          images={[empty]}
          onClose={() => setIsOpened(false)}
          currentIndex={0}
        />
      </div>
      <div className="px-4 custom-flex-col gap-1">
        <p className="text-black dark:text-white text-base font-medium capitalize text-center">
          Abiola Apartment
        </p>
        <SectionSeparator />
        <div className="custom-flex-col gap-6">
          <div className="custom-flex-col gap-2 capitalize">
            {Object.keys(inventory_data_props).map((key) => {
              const field = key as keyof InventoryCardDataProps;
              const value = data[field] || "---";

              return (
                <div key={field} className="flex justify-between font-medium">
                  <p className="text-text-tertiary dark:text-darkText-1 text-base">
                    {field.split("_").join(" ")}
                  </p>
                  <p className="text-text-secondary text-sm">{value}</p>
                </div>
              );
            })}
          </div>
          {!viewOnly && (
            <div className="flex gap-2 justify-end">
              <Button
                href={"/management/inventory/1/manage"}
                variant="border"
                size="xs_medium"
                className="py-2 px-7"
              >
                manage
              </Button>
              <Button
                href={"/management/inventory/1/preview"}
                size="xs_medium"
                className="py-2 px-7"
              >
                preview
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
