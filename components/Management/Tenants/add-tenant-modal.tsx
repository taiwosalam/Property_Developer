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
import { useModal } from "@/components/Modal/modal";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import Avatars from "@/components/Avatars/avatars";

const AddTenantModal = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { setIsOpen } = useModal();

  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const handleAddTenant = async (data: FormData) => {
    // If neither picture nor avatar is valid, show a warning
    console.log('Data -',data);
    console.log('Data instanceof FormData -',data instanceof FormData);

    const success = await addTenant(data)

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
        chooseAvatar={() => setActiveStep("choose-avatar")}
        type="tenant"
        submitAction={handleAddTenant}
        avatar={selectedAvatar}
        setAvatar={setSelectedAvatar} 
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
    "choose-avatar": {
      heading: "Choose Avatar",
      content: (
        <Avatars
          onClick={(avatarUrl) => {
            setSelectedAvatar(avatarUrl);
            setActiveStep("add-tenant");
          }}
        />
      ),
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
