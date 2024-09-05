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
      content: <AddMultipleLandlordsOrTenants />,
    },
    "invite-multiple-owners": {
      heading: "Invite Multiple Landlords/Landladies with Email",
      content: <AddMultipleLandlordsOrTenants />,
    },
    "invite-owner": {
      heading: "Invite Landlord/Landlady with Email",
      content: <InvitationForm />,
    },
    "add-landlord-with-id": {
      heading: "Add Landlord/Landlady with ID",
      content: <InvitationForm />,
    },
  };

  return (
    <div className="w-[900px] rounded-[20px] bg-white p-[30px] custom-flex-col gap-10">
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8]">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          {activeStep !== "options" && (
            <Image
              src={ChevronLeft}
              alt="back"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          )}
          <p className="text-primary-navy text-xl font-bold capitalize">
            {modal_states[activeStep].heading}
          </p>
        </button>
        <ModalTrigger close className="p-2">
          <Image
            src={CloseCircle}
            alt="close"
            width={34}
            height={34}
            className="min-w-[34px] min-h-[34px]"
          />
        </ModalTrigger>
      </div>
      {modal_states[activeStep].content}
    </div>
  );
};

export default AddLandlordModal;
