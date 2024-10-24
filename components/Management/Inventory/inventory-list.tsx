"use client";

import React, { useState } from "react";

// Types
import type { InventoryListProps } from "./types";

// Images
import ClipboardCheck from "@/public/icons/clipboard-check.svg";

// Imports
import { empty } from "@/app/config";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";

const InventoryList: React.FC<InventoryListProps> = ({ data = {} }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
      className="w-full p-[18px] pb-0 custom-flex-col gap-3 rounded-2xl bg-white dark:bg-darkText-primary overflow-hidden"
    >
      <p className="px-2 text-brand-10 text-base font-bold">Abiola Apartment</p>
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
                images={[empty]}
                onClose={() => setIsOpened(false)}
                currentIndex={0}
              />
            </div>
          </div>
          <KeyValueList
            referenceObject={{
              inventory_id: "",
              edited_date: "",
              property_name: "",
              created_date: "",
              branch_name: "",
              account_officer: "",
            }}
            data={data}
            chunkSize={3}
          />
          <div className="flex-1 flex flex-col gap-4 items-end">
            <Button variant="border" size="xs_medium" className="py-2 px-10">
              manage
            </Button>
            <Button size="xs_medium" className="py-2 px-10">
              preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
