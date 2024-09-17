"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft } from "@/public/icons/icons";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import UnitPictures from "@/components/Management/Properties/unit-pictures";
import UnitDetails from "@/components/Management/Properties/unit-details";
import UnitFeatures from "@/components/Management/Properties/unit-features";
import UnitBreakdownNewTenant from "@/components/Management/Properties/unit-breakdown-new-tenant";
import UnitBreakdownRenewalTenant from "@/components/Management/Properties/unit-breakdown-renewal-tenants";
import { useAddUnitStore } from "@/store/add-unit-store";
import { getFormData } from "@/utils/getFormData";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import FooterModal from "./footer-modal";
import UnitCard from "@/components/Management/Properties/unit-card";

const AddUnit = () => {
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const removeUnit = useAddUnitStore((s) => s.removeUnit);
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  // Handle "No" click in the first popup
  const handleNoClick = () => {
    const form = formRef.current;
    if (form) {
      const unitData = getFormData(form);
      addUnit(unitData); // Add unit to the Zustand store
      form.reset();
    }
  };

  // Handle add units from second popup
  const handleAddUnits = () => {
    // setShowUnitCountPopup(false);
    // console.log(`Adding ${unitCount} more units...`);
    // // Perform logic to add the specified number of units
  };

  //   useeffect to fetch property info from API with the Property ID.Change True/False Values to Yes/No. Set Unit Store Values.
  useEffect(() => {}, []);
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
        {addedUnits.length > 0 &&
          addedUnits.map((unit, index) => (
            <UnitCard
              key={index}
              data={{ caution_deposit: "500kdols" }}
              handleRemove={() => removeUnit(index)}
            />
          ))}
        <form
          ref={formRef}
          className="space-y-6 lg:space-y-8 max-w-[970px] relative pb-[70px] lg:pb-[80px]"
        >
          <UnitPictures />
          <UnitDetails />
          <UnitFeatures />
          <UnitBreakdownNewTenant />
          <UnitBreakdownRenewalTenant />
          <div className="fixed w-screen left-0 h-[70px] lg:h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-bold text-sm lg:text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
            <Modal>
              <ModalTrigger asChild>
                <button
                  type="button"
                  className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
                >
                  Add More Unit
                </button>
              </ModalTrigger>
              <ModalContent>
                <FooterModal handleNoClick={handleNoClick} />
              </ModalContent>
            </Modal>
            <button
              type="submit"
              className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
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
