"use client";

import { useState } from "react";

// Types
import type { AddTenantModalOptions } from "./types";

// Imports
import {
  addTenant,
  inviteTenantEmail,
  multipleCreateTenants,
  multipleInviteTenants,
} from "./data";
import InvitationForm from "../invitation-form";
import AddTenantOptions from "./add-tenant-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";
import { useRouter, usePathname } from "next/navigation";
import { addTenantWithEmail } from "../Landlord/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useRole } from "@/hooks/roleContext";
import useWindowWidth from "@/hooks/useWindowWidth";
import { cacheManager } from "@/hooks/cacheManager";

const AddTenantModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsOpen } = useModal();
  const { role } = useRole();
  const { isMobile } = useWindowWidth();
  const [activeStep, setActiveStep] =
    useState<AddTenantModalOptions>("options");
  const [identifier, setIdentifier] = useState("");

  // switch the pathname based on the role
  const switchPathname = () => {
    switch (role) {
      case "manager":
        return `/manager/management/tenants`;
      case "director":
        return `/management/tenants`;
      case "account": 
        return `/accountant/management/tenants`;
      default:
        return `/management/tenants`;
    }
  };
  
  const closeModalAndRefresh = () => {
    setIsOpen(false);
    window.dispatchEvent(new Event("refetchTenants"));
    if (pathname !== switchPathname()) {
      router.push(switchPathname());
    } else {
      setTimeout(() => {
        cacheManager.deleteCacheByUrl('tenants')
        window.dispatchEvent(new Event("refetchTenants"));
      }, 0);
    }
  };

  // Modify handleBack to handle both modal and form steps
  const handleBack = () => {
    if (activeStep === "add-tenant" && formStep === 2) {
      setFormStep(1);
    } else if (activeStep === "add-user-with-email" && formStep === 3) {
      setFormStep(1);
      setIdentifier("");
    } else {
      setActiveStep("options");
      setFormStep(1);
      setIdentifier("");
    }
  };

  const [formStep, setFormStep] = useState(1);

  const handleAddTenant = async (data: Record<string, any>) => {
    const success = await addTenant(data);
    if (success) {
      closeModalAndRefresh();
    } else {
      setIsOpen(false);
    }
  };

  const handleInviteTenantEmail = async (data: any) => {
    const success = await inviteTenantEmail(data);
    if (success) {
      closeModalAndRefresh();
    } else {
      setIsOpen(false);
    }
  };

  const handleAddTenantWithEmmailOrID = async (data: any) => {
    const payload = {
      identifier: data,
    };
    const success = await addTenantWithEmail(objectToFormData(payload));
    if (success) {
      closeModalAndRefresh();
    } else {
      setIsOpen(false);
    }
  };

  const handleMultipleInviteTenants = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const status = await multipleInviteTenants(formData);
    if (status) {
      closeModalAndRefresh();
    } else {
      setIsOpen(false);
    }
  };

  const handleBulkCreateTenants = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const status = await multipleCreateTenants(formData);
    if (status) {
      closeModalAndRefresh();
    } else {
      setIsOpen(false);
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
      heading: formStep === 2 ? "Choose Avatar" : "Add Tenant/Occupant Profile",
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
        <AddMultipleLandlordsOrTenants
          type="tenant"
          method="import"
          submitAction={handleBulkCreateTenants}
        />
      ),
    },
    "invite-multiple-users": {
      heading: "Invite Multiple Tenants/Occupants with Email",
      content: (
        <AddMultipleLandlordsOrTenants
          type="tenant"
          method="invite"
          submitAction={handleMultipleInviteTenants}
        />
      ),
    },
    "invite-single-user": {
      heading: "Invite Tenant/Occupant with Email",
      content: (
        <InvitationForm method="email" submitAction={handleInviteTenantEmail} />
      ),
    },
    "add-user-with-email": {
      heading:
        formStep === 3 ? "Adding Warning!" : "Add Landlord/Landlady with Email",
      content: (
        <InvitationForm
          method="id"
          page="tenant"
          formStep={formStep}
          setFormStep={setFormStep}
          identifier={identifier}
          setIdentifier={setIdentifier}
          submitAction={() => handleAddTenantWithEmmailOrID(identifier)}
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

export default AddTenantModal;
