"use client";

import React from "react";
import type { InventoryCardDataProps, InventoryCardProps } from "./types";
import ClipboardCheck from "@/public/icons/clipboard-check.svg";
import { empty } from "@/app/config";
import { getBranch } from "./data";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import dayjs from "dayjs";
import ImageSlider from "@/components/ImageSlider/image-slider";
import { CameraIcon } from "@/public/icons/icons";

const InventoryCard: React.FC<InventoryCardProps> = ({
  data,
  viewOnly,
  page,
}) => {
  const images =
    data?.property_image?.map((img) =>
      img?.path ? img.path : ClipboardCheck
    ) || [];
  const previewImg = images[0] || ClipboardCheck;

  const inventory_data_props: InventoryCardDataProps = {
    inventory_id: data.id || "--- ---",
    created_date: dayjs(data.created_at).format("MMM DD, YYYY") || "__,__,__",
    last_edited: dayjs(data.updated_at).format("MMM DD, YYYY") || "__,__,__",
    branch_name: data.branch_name || "--- ---",
    account_manager:
      data?.account_officer?.name === "N/A"
        ? "--- ---"
        : data?.account_officer?.name || "--- ---",
    imgSrc: previewImg,
    total_unit: data?.total_unit || 0,
  };

  const getManageLink = () => {
    switch (page) {
      case "manager":
        return `/manager/management/inventory/${data.property_id}`;
      case "account":
        return `/accountant/management/inventory/${data.property_id}`;
      default:
        return `/management/inventory/${data.property_id}`;
    }
  };

  return (
    <div className="custom-flex-col gap-4 pb-5 rounded-lg bg-white dark:bg-darkText-primary overflow-hidden">
      <div className="relative">
        <ImageSlider
          images={images}
          default_image={images?.[0] || empty}
          showImageIndexOnHover
          className="h-[200px] rounded-t-2xl"
        >
          <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 top-2">
            {images?.length > 0 && (
              <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
                  +{images.length}
                </p>
              </div>
            )}
          </div>
        </ImageSlider>
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
                    <p className="text-text-secondary dark:text-darkText-1 text-sm">
                      {value}
                    </p>
                  </div>
                );
              })}
          </div>
          {!viewOnly && (
            <div className="flex gap-2 justify-end">
              <Button
                href={getManageLink()}
                variant="border"
                size="xs_medium"
                className="py-2 px-7"
              >
                manage
              </Button>
              {/* <Button
                href={`/management/inventory/${data.id}/preview`}
                size="xs_medium"
                className="py-2 px-7"
              >
                preview
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
