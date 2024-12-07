"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "../create-rental-property/data";

const CreateGatedEstate = () => {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    const propertyId = await addProperty(data);
    if (propertyId) {
      router.push(
        `/management/properties/create-gated-estate-property/${propertyId}/add-unit`
      );
    }
  };

  return (
    <>
      {/* Back Button & Page Title */}
      <BackButton className="mb-1">Create Facility Property</BackButton>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={27}
        className="mb-[52px]"
      />
      <CreatePropertyForm handleSubmit={handleSubmit} formType="facility" />
    </>
  );
};

export default CreateGatedEstate;
