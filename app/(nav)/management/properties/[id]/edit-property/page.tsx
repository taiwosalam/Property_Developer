"use client";

// Imports
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { SectionSeparator } from "@/components/Section/section-components";
import BackButton from "@/components/BackButton/back-button";

const EditProperty = () => {
  const handleSubmit = () => {};

  return (
    <div className="space-y-7 pb-[100px]">
      <BackButton>Edit Property</BackButton>
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
