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

const InventoryList: React.FC<InventoryListProps> = ({ data }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [branchName, setBranchName ] = useState<string | null>(null);

    useEffect(() => {
      console.log('data -',data)
    const fetchBranch = async () => {
      if (data.branch_id) {
        const branch = await getBranch(data.branch_id.toString());
        if (branch) {
          setBranchName(branch.data.data.branch.branch_name);
          // console.log("branch name", branch.data.data.branch.branch_name);
        }
      } else {
        console.warn("branch_id is not available in data");
      }
    }
    fetchBranch();
  }, [data]);

    const inventoryData: InventoryCardDataProps = {
    inventory_id: data.id || "",
    created_at: dayjs(data.created_at).format("DD-MM-YYYY") || "",
    edited_date: dayjs(data.edited_date).format("DD-MM-YYYY") || "",
    property_name: data.property_name || "",
    branch_name: branchName || "",
    account_officer: data.account_officer || "",
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
              <Picture
                src={ClipboardCheck}
                alt="clipboard with check mark"
                size={60}
              />
              <PopupImageModal
                isOpen={isOpened}
                images={[{ src: empty, isVideo: false }]}
                onClose={() => setIsOpened(false)}
                currentIndex={0}
              />
            </div>
          </div>
          <KeyValueList
            referenceObject={{
              inventory_id: data.id || "",
              edited_date: "",
              property_name: "",
              created_date: "",
              branch_name: branchName,
              account_officer: "",
            }}
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
