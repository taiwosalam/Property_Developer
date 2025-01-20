"use client";

import { useState } from "react";

// Types
// import type { AddLandlordModalOptions } from "./types";

// Imports
import { useRouter, usePathname } from "next/navigation";
import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import InvitationForm from "../invitation-form";
import {
  addLandlord,
  inviteLandlordEmail,
  multipleCreateLandlord,
  multipleInviteLandlord,
} from "./data";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";

type AddLandlordModalOptions =
  | 'options'
  | 'add-landlord'
  | 'add-multiple-owners'
  | 'invite-owner'
  | 'invite-multiple-owners'
  | 'add-landlord-with-id';


const AddLandlordModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsOpen } = useModal();

  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");
  const [formStep, setFormStep] = useState(1);

  // Modify handleBack to handle both modal and form steps
  const handleBack = () => {
    if (activeStep === "add-landlord" && formStep === 2) {
      setFormStep(1);
    } else {
      setActiveStep("options");
      setFormStep(1);
    }
  };

  const closeModalAndRefresh = () => {
    setIsOpen(false);
    if (pathname !== "/management/landlord") {
      router.push("/management/landlord");
    } else {
      setTimeout(() => {
        window.dispatchEvent(new Event("refetchLandlords"));
      }, 0);
    }
  };

  const handleAddLandlord = async (data: FormData) => {
    const status = await addLandlord(data);
    if (status) {
      closeModalAndRefresh();
    }
  };

  const handleInviteLandlordEmail = async (data: any) => {
    const status = await inviteLandlordEmail(data);
    if (status) {
      closeModalAndRefresh();
    }
  };

  const handleBulkCreateLandlord = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const status = await multipleCreateLandlord(formData);
    if (status) {
      closeModalAndRefresh();
    }
  };

  const handleMultipleInviteLandlord = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const status = await multipleInviteLandlord(formData);
    if (status) {
      closeModalAndRefresh();
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
          method="import"
          submitAction={handleBulkCreateLandlord}
        />
      ),
    },
    "invite-multiple-owners": {
      heading: "Invite Multiple Landlords/Landladies with Email",
      content: (
        <AddMultipleLandlordsOrTenants
          type="landlord"
          method="invite"
          submitAction={handleMultipleInviteLandlord}
        />
      ),
    },
    "invite-owner": {
      heading: "Invite Landlord/Landlady with Email",
      content: (
        <InvitationForm
          method="email"
          submitAction={handleInviteLandlordEmail}
        />
      ),
    },
    "add-landlord-with-id": {
      heading: "Add Landlord/Landlady with ID",
      content: <InvitationForm method="id" submitAction={async () => {}} />,
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
