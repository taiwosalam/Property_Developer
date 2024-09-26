"use client";

import CreateGatedEstateForm from "@/components/Management/Properties/create-gated-estate-form";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";

const CreateGatedEstate = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Post data to API
    router.push("/management/properties/create-gated-estate-property/add-unit");
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
          Create Gated Estate Property
        </h1>
      </div>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={27}
        className="mb-[52px]"
      />
      <CreateGatedEstateForm handleSubmit={handleSubmit} />
    </>
  );
};

export default CreateGatedEstate;
