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
  addLandlordWithEmail,
  inviteLandlordEmail,
  multipleCreateLandlord,
  multipleInviteLandlord,
} from "./data";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useRole } from "@/hooks/roleContext";
import useWindowWidth from "@/hooks/useWindowWidth";
import { cacheManager } from "@/hooks/cacheManager";

type AddLandlordModalOptions =
  | "options"
  | "add-landlord"
  | "add-multiple-owners"
  | "invite-owner"
  | "invite-multiple-owners"
  | "add-landlord-with-email";

const AddLandlordModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsOpen } = useModal();
  const { role } = useRole();
  const { isMobile } = useWindowWidth();

  const [identifier, setIdentifier] = useState("");

  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");
  const [formStep, setFormStep] = useState(1);

  // Modify handleBack to handle both modal and form steps
  const handleBack = () => {
    if (activeStep === "add-landlord" && formStep === 2) {
      setFormStep(1);
    } else if (activeStep === "add-landlord-with-email" && formStep === 3) {
      setFormStep(1);
      setIdentifier("");
    } else {
      setActiveStep("options");
      setFormStep(1);
      setIdentifier("");
    }
  };

  // switch the pathname based on the role
  const switchPathname = () => {
    switch (role) {
      case "manager":
        return `/manager/management/landlord`;
      case "account":
        return `/accountant/management/landlord`;
      default:
        return `/management/landlord`;
    }
  };

  const closeModalAndRefresh = () => {
    setIsOpen(false);
    if (pathname !== switchPathname()) {
      router.push(switchPathname());
    } else {
      setTimeout(() => {
        cacheManager.deleteCacheByUrl('landlords')
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

  const handleAddLandlordWithEmmailOrID = async (data: any) => {
    const payload = {
      identifier: data,
    };
    const status = await addLandlordWithEmail(objectToFormData(payload));
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
    "add-landlord-with-email": {
      heading:
        formStep === 3 ? "Adding Warning!" : "Add Landlord/Landlady with Email",
      content: (
        <InvitationForm
          method="id"
          page="landlord"
          formStep={formStep}
          setFormStep={setFormStep}
          identifier={identifier}
          setIdentifier={setIdentifier}
          submitAction={() => handleAddLandlordWithEmmailOrID(identifier)}
        />
      ),
    },
  };

  return (
    <LandlordTenantModalPreset
      heading={modal_states[activeStep].heading}
      style={{ overflow: "hidden", maxWidth: isMobile ? "100%" : "50%" }}
      back={activeStep !== "options" ? { handleBack } : undefined}
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddLandlordModal;
