"use client";

import React, { useEffect, useState } from "react";

// Types
import type { InventoryCardDataProps, InventoryListProps } from "./types";

// Images
import ClipboardCheck from "@/public/icons/clipboard-check.svg";

// Imports
import { empty } from "@/app/config";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { getBranch } from "./data";
import dayjs from "dayjs";
import Image from "next/image";
import { CameraIcon } from "@/public/icons/icons";

const InventoryList: React.FC<InventoryListProps> = ({ data }) => {
  const [isOpened, setIsOpened] = useState(false);
  // const [branchName, setBranchName ] = useState<string | null>(null);
  const images =
    data?.property_image?.map((img) => ({
      src: img?.path || ClipboardCheck,
      isVideo: false,
    })) || [];

  const previewImg = images[0]?.src || ClipboardCheck;
  const inventoryData: InventoryCardDataProps = {
    inventory_id: data.id || "--- ---",
    created_date: dayjs(data.created_at).format("MMM DD, YYYY") || "--- ---",
    last_edited: dayjs(data.updated_at).format("MMM DD, YYYY") || "--- ---",
    property_name: data.property_name || "--- ---",
    branch_name: data.branch_name || "--- ---",
    account_officer: data?.account_officer?.name || "--- ---",
  };

  // Ensure data is not null or undefined
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
      className="w-full p-[18px] pb-0 custom-flex-col gap-3 rounded-2xl bg-white dark:bg-darkText-primary overflow-hidden"
    >
      <p className="px-2 text-brand-10 text-base font-bold"> {data.title}</p>
      <SectionSeparator />
      <div className="pb-[18px] overflow-x-auto custom-round-scrollbar">
        <div className="flex items-center min-w-[800px]">
          <div className="flex-1 flex justify-start">
            <div
              onClick={() => setIsOpened(true)}
              style={{ backgroundColor: "#CCCCCC" }}
              className="p-8 rounded-lg dark:bg-white cursor-pointer"
            >
              <Image
                src={previewImg as string}
                alt="clipboard with check mark"
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
              <PopupImageModal
                isOpen={isOpened}
                images={images}
                onClose={() => setIsOpened(false)}
                currentIndex={0}
              />
            </div>
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
          <KeyValueList
            referenceObject={inventoryData}
            data={inventoryData}
            chunkSize={3}
          />
          <div className="flex-1 flex flex-col gap-4 items-end">
            <Button
              variant="border"
              size="xs_medium"
              className="py-2 px-10"
              href={`/management/inventory/${data.id}/manage`}
            >
              manage
            </Button>
            <Button
              size="xs_medium"
              className="py-2 px-10"
              href={`/management/inventory/${data.id}/preview`}
            >
              preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
