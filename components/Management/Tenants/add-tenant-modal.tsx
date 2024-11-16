"use client";

import { useState } from "react";

// Types
import type { AddTenantModalOptions } from "./types";

// Imports
import { addTenant } from "./data";
import InvitationForm from "../invitation-form";
import AddTenantOptions from "./add-tenant-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import Avatars from "@/components/Avatars/avatars";

const AddTenantModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");

  const handleBack = () => {
    if (activeStep === "add-tenant" && formStep === 2) {
      setFormStep(1);
    } else {
      setActiveStep("options");
      setFormStep(1);
    }
  };

  const [formStep, setFormStep] = useState(1);
  const handleAddTenant = async (data: FormData) => {
    // If neither picture nor avatar is valid, show a warning
    // const success = await addTenant(data);
    // if (success) {
    //   setIsOpen(false);
    //   setTimeout(() => {
    //     location.reload();
    //   }, 1500);
    // }
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
        <AddLandLordOrTenantForm
          type="tenant"
          submitAction={handleAddTenant}
          formStep={formStep}
          setFormStep={setFormStep}
        />
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
