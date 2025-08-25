"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-property-form";
// import { addProperty } from "./data";
import { useTourStore } from "@/store/tour-store";
import { useEffect, useState } from "react";
import { ExclamationMark } from "@/public/icons/icons";
import ProgressCardLoader from "@/components/Loader/setup-card-loader";
import CreateOutrightPropertyForm from "@/components/Management/Properties/create-outright-property";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const landlordId = searchParams.get("landlord") || "";
  const [requestLoading, setRequestLoading] = useState(false);
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  const propertyId = 12;

  const handleSubmit = async (data: Record<string, any>) => {
    // try {
    //   setRequestLoading(true);
    //   const propertyId = await addProperty(data);
    //   if (propertyId) {
    //     window.location.href = `/management/properties/create-rental-property/${propertyId}/add-unit`;
    //   }
    // } catch (error) {
    //   console.error("Failed to create property", error);
    // } finally {
    //   setRequestLoading(false);
    // }
    router.push(`/management/properties/create-outright-property/${propertyId}/add-unit`);
  };

  return (
    <>
      <BackButton className="mb-1">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg lg:text-xl capitalize font-normal">
            Create Outright Sales Property
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
        <CreateOutrightPropertyForm
          handleSubmit={handleSubmit}
          formType="rental"
          landlordId={landlordId}
        />
      </div>
    </>
  );
};

export default CreateProperty;
