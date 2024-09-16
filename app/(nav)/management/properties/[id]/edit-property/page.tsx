"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Images
import { ChevronLeft } from "@/public/icons/icons";

// Imports
import CreateProperty from "../../create-rental-property/page";
import UnitCard from "@/components/Management/Properties/unit-card";

const EditProperty = () => {
  const router = useRouter();

  return (
    <div className="custom-flex-col gap-7 pb-[100px]">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="back"
          onClick={() => router.back()}
          className="py-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">Edit Property</p>
      </div>
      <CreateProperty editMode />
      <div className="custom-flex-col gap-10">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <UnitCard key={index} data={{}} />
          ))}
      </div>
    </div>
  );
};

export default EditProperty;
