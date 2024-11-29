"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "./data";

const CreateProperty = () => {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    const propertyId = await addProperty(data);
    if (propertyId) {
      router.push(
        `/management/properties/create-rental-property/${propertyId}/add-unit`
      );
    }
  };

  return (
    <Fragment>
      <BackButton className="mb-1">Create Rental Property</BackButton>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={27}
        className="mb-[52px]"
      />
      <CreateRentalPropertyForm handleSubmit={handleSubmit} formType="rental" />
    </Fragment>
  );
};

export default CreateProperty;
