"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
} from "@/components/Community/ManageRequest";

const CreateMyPropertyRequest = () => {
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
            Create Property Request
          </h1>
        </div>
      </div>

      <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
        <div className="first flex flex-col w-full lg:w-[60%]">
          <PropertyRequestFirstSection
            placeholderText="Please be aware that you are responsible for all posts. Post Real Estate, Property request only."
          />
        </div>
        <div className="second flex flex-col w-full lg:w-[40%]">
          <PropertyRequestSecondSection />
        </div>
      </div>
    </>
  );
};

export default CreateMyPropertyRequest;
