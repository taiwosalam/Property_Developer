"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "@/components/Form/Button/button";
import {
  FirstSection,
  ManagePropertiesComments,
  SecondSection,
} from "@/components/Community/ManageRequest";

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

      <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
        <div className="first flex flex-col w-full lg:w-[60%]">
          <FirstSection
            inputValue="Rent Increase & Maintenance"
            showTextAreaPlaceholder={false}
          />
          <ManagePropertiesComments />
        </div>

        <div className="second flex flex-col w-full lg:w-[40%]">
          <SecondSection />
        </div>
      </div>
    </>
  );
};

export default ManagePropertyRequest;
