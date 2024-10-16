"use client";

import { useState } from "react";

// Types
import type { AddTenantModalOptions } from "./types";

// Imports
import { addTenant } from "./data";
import InvitationForm from "../invitation-form";
import { useAuthStore } from "@/store/authstrore";
import AddTenantOptions from "./add-tenant-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";

const AddTenantModal = () => {
  const { setIsOpen } = useModal();

  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");

  const accessToken = useAuthStore((state) => state.access_token);

  const handleBack = () => {
    setActiveStep("options");
  };

  const handleAddTenant = async (data: FormData) => {
    // If neither picture nor avatar is valid, show a warning
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or select an avatar.");
      return;
    }

    const success = await addTenant(data, accessToken);

    if (success) {
      setIsOpen(false);
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
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
        <AddMultipleLandlordsOrTenants type="tenant" submitAction={() => { }} />
      ),
    },
    "invite-multiple-users": {
      heading: "Invite Multiple Tenants/Occupants with Email",
      content: (
        <AddMultipleLandlordsOrTenants type="tenant" submitAction={() => { }} />
      ),
    },
    "invite-single-user": {
      heading: "Invite Tenant/Occupant with Email",
      content: <InvitationForm method="email" submitAction={() => { }} />,
    },
    "add-user-with-id": {
      heading: "Add Landlord/Landlady with ID",
      content: <InvitationForm method="id" submitAction={() => { }} />,
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
