"use client";

import { useState } from "react";
import Image from "next/image";

// Types
import type { AddLandlordModalOptions } from "./types";

// Images
import CloseCircle from "@/public/icons/close-circle.svg";
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import { ModalTrigger } from "@/components/Modal/modal";
import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import InvitationForm from "../invitation-form";

const AddLandlordModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const modal_states: Record<
    AddLandlordModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Landlord/Landlady Profile",
      content: <AddLandlordOptions showForm={setActiveStep} />,
    },
    "add-landlord": {
      heading: "Add landlord/landlady Profile",
      content: (
        <AddLandLordOrTenantForm type="landlord" submitAction={() => {}} />
      ),
    },
    "add-multiple-owners": {
      heading: "Import bulk landlord/landlady list.",
      content: (
        <AddMultipleLandlordsOrTenants
          type="landlord"
          submitAction={() => {}}
        />
      ),
    },
    "invite-multiple-owners": {
      heading: "Invite Multiple Landlords/Landladies with Email",
      content: (
        <AddMultipleLandlordsOrTenants
          type="landlord"
          submitAction={() => {}}
        />
      ),
    },
    "invite-owner": {
      heading: "Invite Landlord/Landlady with Email",
      content: <InvitationForm method="email" submitAction={() => {}} />,
    },
    "add-landlord-with-id": {
      heading: "Add Landlord/Landlady with ID",
      content: <InvitationForm method="id" submitAction={() => {}} />,
    },
  };

  return (
    <div className="w-[900px] max-w-[80%] max-h-[85%] rounded-[20px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <div className="flex items-center gap-2">
          {activeStep !== "options" && (
            <button type="button" onClick={handleBack}>
              <Image
                src={ChevronLeft}
                alt="back"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          )}
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            {modal_states[activeStep].heading}
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button">
          <Image
            src={CloseCircle}
            alt="close"
            width={34}
            height={34}
            className="min-w-[34px] min-h-[34px]"
          />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="px-[30px] pt-10 pb-[24px] md:pb-[36px]">
        {modal_states[activeStep].content}
      </div>
    </div>
  );
};

export default AddLandlordModal;
