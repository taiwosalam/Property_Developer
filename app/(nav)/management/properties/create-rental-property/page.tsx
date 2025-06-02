"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "./data";
import { useTourStore } from "@/store/tour-store";
import { useEffect } from "react";

const CreateProperty = () => {
  const router = useRouter();
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();
  const handleSubmit = async (data: Record<string, any>) => {
    const propertyId = await addProperty(data);
    if (propertyId) {
      router.push(
        `/management/properties/create-rental-property/${propertyId}/add-unit`
      );
    }
  };

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("CreatePropertyTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  return (
    <>
      <BackButton className="mb-1">Create Rental Property</BackButton>
      <div className="progress-overview-wrapper">
        <PageProgressBar
          breakpoints={[25, 50, 75]}
          percentage={27}
          className="mb-[52px]"
        />
      </div>
      <div className="pb-[100px]">
        <CreateRentalPropertyForm
          handleSubmit={handleSubmit}
          formType="rental"
        />
      </div>
    </>
  );
};

export default CreateProperty;
