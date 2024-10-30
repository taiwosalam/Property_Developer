"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "@/components/Form/Button/button";
import {
  PropertyRequestFirstSection,
  ManagePropertiesComments,
  PropertyRequestSecondSection,
} from "@/components/Community/ManageRequest";
import { textareaValue } from "../../../data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const ManagePropertyRequest = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            Manage Property Request
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start mb-20">
        <div className="lg:w-[60%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestFirstSection
            placeholderText="Rent Increase & Maintenance"
            inputValue="Rent Increase & Maintenance"
            desc={textareaValue}
          />
          <ManagePropertiesComments />
        </div>

        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestSecondSection />
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
        <button
          type="button"
          className="py-2 px-7 bg-[#FDE9EA] text-[#E9212E] rounded-[4px] text-sm font-medium"
        >
          Delete
        </button>
      </FixedFooter>
    </>
  );
};

export default ManagePropertyRequest;
