"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import UnitPictures from "@/components/Management/Properties/unit-pictures";
import UnitDetails from "@/components/Management/Properties/unit-details";
import UnitFeatures from "@/components/Management/Properties/unit-features";
import UnitBreakdownNewTenant from "@/components/Management/Properties/unit-breakdown-new-tenant";
import UnitBreakdownRenewalTenant from "@/components/Management/Properties/unit-breakdown-renewal-tenants";

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
      <div className="space-y-6 lg:space-y-8">
        <PropertyDetails />
        <PropertySettings />
        <form className="space-y-6 lg:space-y-8 max-w-[970px] relative pb-[80px]">
          <UnitPictures />
          <UnitDetails />
          <UnitFeatures />
          <UnitBreakdownNewTenant />
          <UnitBreakdownRenewalTenant />
          <div className="fixed h-[80px] bottom-0 py-5 px-[60px] bg-white w-[(calc(100%+24px))] flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-bold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
            <button
              type="reset"
              className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
            >
              Add More Unit
            </button>
            <button
              type="submit"
              className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
              onClick={() => {}}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnit;
