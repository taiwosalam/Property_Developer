"use client";

import React, { useEffect, useState } from "react";

// Types
import type { InventoryCardDataProps, InventoryCardProps } from "./types";

// Images
import ClipboardCheck from "@/public/icons/clipboard-check.svg";

// Imports
import { empty } from "@/app/config";
import { getBranch } from "./data";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import dayjs from "dayjs";
import Image from "next/image";
import { CameraIcon } from "@/public/icons/icons";

const InventoryCard: React.FC<InventoryCardProps> = ({ data, viewOnly }) => {
  const [isOpened, setIsOpened] = useState(false);

  const images =
    data?.property_image?.map((img) => ({
      src: img?.path || ClipboardCheck,
      isVideo: false,
    })) || [];

  const previewImg = images[0]?.src || ClipboardCheck;

  const inventory_data_props: InventoryCardDataProps = {
    inventory_id: data.id || "--- ---",
    created_date: dayjs(data.created_at).format("MMM DD, YYYY") || "__,__,__",
    last_edited: dayjs(data.updated_at).format("MMM DD, YYYY") || "__,__,__",
    property_name: data.property_name || "--- ---",
    branch_name: data.branch_name || "--- ---",
    account_officer: data?.account_officer?.name || "--- ---",
    imgSrc: previewImg,
  };
  return (
    <div className="custom-flex-col gap-4 pb-5 rounded-lg bg-white dark:bg-darkText-primary overflow-hidden">
      <div
        onClick={() => setIsOpened(true)}
        className="w-full h-[174px] flex items-center justify-center bg-black/20 dark:bg-darkText-2 cursor-pointer relative"
      >
        <Image
          src={inventory_data_props.imgSrc as string}
          alt="clipboard with check mark"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
        <PopupImageModal
          isOpen={isOpened}
          images={images}
          onClose={() => setIsOpened(false)}
          currentIndex={0}
        />
        <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 top-2">
          {images && (
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
                +{images.length}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 custom-flex-col gap-1">
        <p className="text-black dark:text-white text-base font-medium capitalize text-center">
          {data.title}
        </p>
        <SectionSeparator />
        <div className="custom-flex-col gap-6">
          <div className="custom-flex-col gap-2 capitalize">
            {Object.keys(inventory_data_props)
              .filter((key) => key !== "imgSrc")
              .map((key) => {
                const field = key as keyof InventoryCardDataProps;
                const value = inventory_data_props[field] || "---";

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
                href={`/management/inventory/${data.id}/manage`}
                variant="border"
                size="xs_medium"
                className="py-2 px-7"
              >
                manage
              </Button>
              <Button
                href={`/management/inventory/${data.id}/preview`}
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
