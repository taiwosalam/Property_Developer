"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import PropertyDetails from "@/components/Management/Properties/property-details";

const AddUnit = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div>
      {/* Back Button & Page Title */}
      <div className="flex items-center gap-1 mb-5 lg:mb-8">
        <button
          type="button"
          aria-label="Go Back"
          onClick={goBack}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">Add Units</p>
      </div>
      <PropertyDetails />
    </div>
  );
};

export default AddUnit;
