"use client";

import { useState } from "react";

// Types
import type { AddLandlordModalOptions } from "./types";

// Imports
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import Avatars from "@/components/Avatars/avatars";
import InvitationForm from "../invitation-form";
import { addLandlord } from "./data";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";

const AddLandlordModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");
  const [formStep, setFormStep] = useState(1);

  const navigateToLandlordPage = () => {
    if (pathname !== "/management/landlord") {
      router.push("/management/landlord");
    }
  };

  // Modify handleBack to handle both modal and form steps
  const handleBack = () => {
    if (activeStep === "add-landlord" && formStep === 2) {
      setFormStep(1);
    } else {
      setActiveStep("options");
      setFormStep(1);
    }
  };

  const handleAddLandlord = (data: Record<string, any>) => {
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or choose an avatar.");
      return;
    }
  };

  const modal_states: Record<
    AddLandlordModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add landlord/landlady Profile",
      content: <AddLandlordOptions showForm={setActiveStep} />,
    },
    "add-landlord": {
      heading:
        formStep === 2 ? "Choose Avatar" : "Add landlord/landlady Profile",
      content: (
        <AddLandLordOrTenantForm
          type="landlord"
          submitAction={handleAddLandlord}
          setFormStep={setFormStep}
          formStep={formStep}
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
