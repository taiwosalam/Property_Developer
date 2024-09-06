"use client";

import React, { useState } from "react";
import Image from "next/image";

// Types
import type { AddTenantModalOptions } from "./types";

// Images
import CloseCircle from "@/public/icons/close-circle.svg";
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import { ModalTrigger } from "@/components/Modal/modal";
import AddTenantOptions from "./add-tenant-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import InvitationForm from "../invitation-form";

const AddTenantModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const modal_states: Record<
    AddTenantModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Tenant/Occupant Profile",
      content: <AddTenantOptions showForm={setActiveStep} />,
    },
    "add-tenant": {
      heading: "Add Tenant/Occupant Profile",
      content: (
        <AddLandLordOrTenantForm type="tenant" submitAction={() => {}} />
      ),
    },
    "add-multiple-users": {
      heading: "Import bulk Tenants/Occupants list",
      content: (
        <AddMultipleLandlordsOrTenants type="tenant" submitAction={() => {}} />
      ),
    },
    "invite-multiple-users": {
      heading: "Invite Multiple Tenants/Occupants with Email",
      content: (
        <AddMultipleLandlordsOrTenants type="tenant" submitAction={() => {}} />
      ),
    },
    "invite-single-user": {
      heading: "Invite Tenant/Occupant with Email",
      content: <InvitationForm method="email" submitAction={() => {}} />,
    },
    "add-user-with-id": {
      heading: "Add Landlord/Landlady with ID",
      content: <InvitationForm method="id" submitAction={() => {}} />,
    },
  };

  return (
    <div className="w-[900px] rounded-[20px] bg-white p-[30px] custom-flex-col gap-10">
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8]">
        <button onClick={handleBack} className="flex items-center gap-2">
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

export default AddTenantModal;
