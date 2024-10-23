"use client";

import { useRouter } from "next/navigation";

// Images
import { ChevronLeft } from "@/public/icons/icons";

// Imports
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { SectionSeparator } from "@/components/Section/section-components";

const EditProperty = () => {
  const router = useRouter();
  const handleSubmit = () => {};

  return (
    <div className="space-y-7 pb-[100px]">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="back"
          onClick={() => router.back()}
          className="py-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black dark:text-white font-bold text-lg lg:text-xl">
          Edit Property
        </p>
      </div>
      <SectionSeparator className="!my-2.5" />
      {/* Check for type of Property in your fetched property info. Also set the property info and added unit in unit store (zustand). property type determines formType */}
      <CreatePropertyForm
        editMode
        handleSubmit={handleSubmit}
        formType="rental" //to be dynamic
      />

      <div className="custom-flex-col gap-10">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <AddUnitFormCard
              key={index}
              data={{ images: ["", "", ""] }}
              index={index}
              handleRemove={() => {}}
            />
          ))}
      </div>
    </div>
  );
};

export default EditProperty;
