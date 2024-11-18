"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Comment from "../../../threads/[threadId]/preview/comment";
import ThreadComments from "@/components/Community/ThreadComments";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { toast } from "sonner";

const desc =
  "#Commercial and retail real estate fundamentals are expected to remain strong due to the scarcity of new construction deliveries, prompting compelling opportunities for investors amid high interest rates and inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic headwinds and challenges with obtaining building permits, experts predict that the demand for housing will remain strong, and the market will see a steady increase in property values this year. There are also opportunities available for high-quality properties that meet the needs of investors and tenants, while low mortgage rates and government incentives will likely contribute to this optimistic outlook as inflation may remain a concern in 2024, affecting both home prices and mortgage rates.";

const ManageMyArticle = () => {
  const { minBudget, maxBudget, resetBudgets } = usePropertyRequestStore();

  const handleCreateClick = () => {
    // Validate budgets here when the create button is clicked
    if (minBudget !== null && maxBudget !== null && minBudget > maxBudget) {
      toast.error("Maximum budget cannot be less than minimum budget.");
      resetBudgets(); // Reset inputs to 0 or null
    } else {
      // Proceed with the request creation logic
      console.log("Property request created successfully");
    }
  };
  const router = useRouter();
  return (
    <div className="wra mb-16">
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

      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestFirstSection
            placeholderText="Rent Increase & Maintenance"
            desc={desc}
          />
          <ThreadComments />
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
        <button
          onClick={handleCreateClick}
          type="button"
          className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
        >
          Update
        </button>
      </FixedFooter>
    </div>
  );
};

export default ManageMyArticle;
