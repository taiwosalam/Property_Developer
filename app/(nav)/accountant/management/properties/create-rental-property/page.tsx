"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "./data";
import { useTourStore } from "@/store/tour-store";
import { useEffect } from "react";
import { ExclamationMark } from "@/public/icons/icons";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const landlordId = searchParams.get("landlord") || "";
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
      // router.push(
      //   `/accountant/management/properties/create-rental-property/${propertyId}/add-unit`
      // );
      window.location.href = `/accountant/management/properties/create-rental-property/${propertyId}/add-unit`;
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
      <BackButton className="mb-1">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg lg:text-xl capitalize font-normal">
            Create Rental Property
          </h1>
          <button
            onClick={() => restartTour(pathname)}
            type="button"
            className="text-orange-normal"
          >
            <ExclamationMark />
          </button>
        </div>
      </BackButton>
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
          landlordId={landlordId} 
        />
      </div>
    </>
  );
};

export default CreateProperty;
