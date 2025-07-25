"use client";

import { usePathname, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "../create-rental-property/data";
import { useTourStore } from "@/store/tour-store";
import { useEffect } from "react";
import { ExclamationMark } from "@/public/icons/icons";

const CreateGatedEstate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  const handleSubmit = async (data: Record<string, any>) => {
    const propertyId = await addProperty(data);
    if (propertyId) {
      router.push(
        `/manager/management/properties/create-gated-estate-property/${propertyId}/add-unit`
      );
    }
  };

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("CreateFacilityTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  return (
    <>
      {/* Back Button & Page Title */}
      <div className="flex gap-2 items-center">
        <BackButton className="mb-1">
          Create Estate/Facility Property
        </BackButton>

        <button
          onClick={() => restartTour(pathname)}
          type="button"
          className="text-orange-normal"
        >
          <ExclamationMark />
        </button>
      </div>
      <div className="progress-overview-wrapper">
        <PageProgressBar
          breakpoints={[25, 50, 75]}
          percentage={27}
          className="mb-[52px]"
        />
      </div>

      <div className="pb-[100px]">
        <CreatePropertyForm handleSubmit={handleSubmit} formType="facility" />
      </div>
    </>
  );
};

export default CreateGatedEstate;
