"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import { ChevronLeft } from "@/public/icons/icons";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";

const CreateGatedEstate = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Post data to API
    router.push(
      "/management/properties/create-gated-estate-property/1/add-unit"
    );
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
