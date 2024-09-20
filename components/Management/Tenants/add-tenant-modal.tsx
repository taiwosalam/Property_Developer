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
import { addTenant } from "./data";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

const AddTenantModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const handleAddTenant = async (data: FormData) => {
    const response = await addTenant(data);
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
        <AddLandLordOrTenantForm type="tenant" submitAction={handleAddTenant} />
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
    <LandlordTenantModalPreset
      heading={modal_states[activeStep].heading}
      back={activeStep !== "options" ? { handleBack } : undefined}
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddTenantModal;
