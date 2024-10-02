"use client";

import { useRouter } from "next/navigation";

import { ChevronLeft } from "@/public/icons/icons";

import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-rental-property-form";

const CreateProperty = () => {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    //change to formdata after integrating with backend
    // e.preventDefault();
    console.log(data);
    // Post data to API
    // router.push("/management/properties/create-rental-property/add-unit");
  };

  return (
    <>
      {/* Back Button & Page Title */}
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          aria-label="Go Back"
          onClick={() => router.back()}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-black font-bold text-lg lg:text-xl">
          Create Rental Property
        </h1>
      </div>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={27}
        className="mb-[52px]"
      />
      <CreateRentalPropertyForm handleSubmit={handleSubmit} />
    </>
  );
};

export default CreateProperty;
