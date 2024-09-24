"use client";

import { useState } from "react";

// Types
import type { AddLandlordModalOptions } from "./types";

// Imports

import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import InvitationForm from "../invitation-form";
import { addLandlord } from "./data";
import { useAuthStore } from "@/store/authstrore";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

const AddLandlordModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const accessToken = useAuthStore((state) => state.access_token);

  const handleAddLandlord = async (data: FormData) => {
    console.log("clicked");
    const response = await addLandlord(data, accessToken);
    console.log(response);
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
        <AddLandLordOrTenantForm
          type="landlord"
          submitAction={handleAddLandlord}
        />
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
    <LandlordTenantModalPreset
      heading={modal_states[activeStep].heading}
      back={activeStep !== "options" ? { handleBack } : undefined}
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddLandlordModal;
