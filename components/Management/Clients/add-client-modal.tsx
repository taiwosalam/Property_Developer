"use client";

import { useState } from "react";

// Imports
import InvitationForm from "../invitation-form";
import AddTenantOptions from "./add-client-options";
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
import { AddClientModalOptions } from "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/clients/types";
import AddClientOptions from "./add-client-options";

const AddClientModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsOpen } = useModal();
  const { role } = useRole();
  const { isMobile } = useWindowWidth();
  const [activeStep, setActiveStep] =
    useState<AddClientModalOptions>("options");
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
    // setIsOpen(false);
    // window.dispatchEvent(new Event("refetchTenants"));
    // if (pathname !== switchPathname()) {
    //   router.push(switchPathname());
    // } else {
    //   setTimeout(() => {
    //     cacheManager.deleteCacheByUrl('tenants')
    //     window.dispatchEvent(new Event("refetchTenants"));
    //   }, 0);
    // }
  };

  // Modify handleBack to handle both modal and form steps
  const handleBack = () => {
    if (activeStep === "add-client" && formStep === 2) {
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

  const handleAddClient = async (data: Record<string, any>) => {
    // const success = await addClient(data);
    // if (success) {
    //   closeModalAndRefresh();
    // }
  };

  const handleInviteClientEmail = async (data: any) => {
    // const success = await inviteClientEmail(data);
    // if (success) {
    //   closeModalAndRefresh();
    // }
  };

  const handleAddClientWithEmailOrID = async (data: any) => {
    // const payload = {
    //   identifier: data,
    // };
    // const success = await addClientWithEmail(objectToFormData(payload));
    // if (success) {
    //   closeModalAndRefresh();
    // }
  };

  const handleMultipleInviteClients = async (file: File) => {
    // const formData = new FormData();
    // formData.append("file", file);
    // const status = await multipleInviteClients(formData);
    // if (status) {
    //   closeModalAndRefresh();
    // }
  };

  const handleBulkCreateClients = async (file: File) => {
    // const formData = new FormData();
    // formData.append("file", file);
    // const status = await multipleCreateClients(formData);
    // if (status) {
    //   closeModalAndRefresh();
    // } else {
    //   setIsOpen(false);
    // }
  };

  const modal_states: Record<
    AddClientModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Client Profile",
      content: <AddClientOptions showForm={setActiveStep} />,
    },
    "add-client": {
      heading: formStep === 2 ? "Choose Avatar" : "Add Client Profile",
      content: (
        <AddLandLordOrTenantForm
          type="client"
          submitAction={handleAddClient}
          formStep={formStep}
          setFormStep={setFormStep}
        />
      ),
    },
    "add-multiple-users": {
      heading: "Import bulk Clients list",
      content: (
        <AddMultipleLandlordsOrTenants
          type="client"
          method="import"
          submitAction={handleAddClient}
        />
      ),
    },
    "invite-multiple-users": {
      heading: "Invite Multiple Clients with Email",
      content: (
        <AddMultipleLandlordsOrTenants
          type="client"
          method="invite"
          submitAction={handleMultipleInviteClients}
        />
      ),
    },
    "invite-single-user": {
      heading: "Invite Client with Email",
      content: (
        <InvitationForm method="email" submitAction={handleInviteClientEmail} />
      ),
    },
    "add-user-with-email": {
      heading:
        formStep === 3 ? "Adding Warning!" : "Add Client with Email",
      content: (
        <InvitationForm
          method="id"
          page="client"
          formStep={formStep}
          setFormStep={setFormStep}
          identifier={identifier}
          setIdentifier={setIdentifier}
          submitAction={() => handleAddClientWithEmailOrID(identifier)}
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

export default AddClientModal;
