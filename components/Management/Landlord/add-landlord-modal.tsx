"use client";

import { useState } from "react";

// Types
import type { AddLandlordModalOptions } from "./types";

// Imports
import { useRouter, usePathname } from "next/navigation";
import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import InvitationForm from "../invitation-form";
import { addLandlord } from "./data";
import { useAuthStore } from "@/store/authstrore";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { toast } from "sonner";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
import { useModal } from "@/components/Modal/modal";
// import { useNavCreateNewContext } from "@/components/Nav/nav-create-new-context";

const AddLandlordModal = () => {
  const { setIsOpen } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  // const { changeStep } = useNavCreateNewContext();

  const [activeStep, setActiveStep] =
    useState<AddLandlordModalOptions>("options");

  // const handleBack = () => {
  //   if (changeStep && activeStep === "options") {
  //     return {
  //       handleBack: () => changeStep("prev"),
  //     };
  //   } else if (activeStep !== "options") {
  //     return () => setActiveStep("options");
  //   }
  //   return undefined;
  // };

  const handleBack = () => setActiveStep("options");

  const navigateToLandlordPage = () => {
    if (pathname !== "/management/landlord") {
      router.push("/management/landlord");
    }
  };

  const accessToken = useAuthStore((state) => state.access_token);

  const handleAddLandlord = async (data: FormData) => {
    // If neither picture nor avatar is valid, show a warning
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or select an avatar.");
      return;
    }

    // Get the value of "local_government" from the FormData
    const localGovernmentValue = data.get("local_government");

    // Add the new field "local_govt" with the value from "local_government"
    if (localGovernmentValue) {
      data.append("local_govt", localGovernmentValue.toString());
    }

    const success = await addLandlord(data, accessToken);

    if (success) {
      setIsOpen(false);
      navigateToLandlordPage();
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
      // back={handleBack()}
      back={activeStep !== "options" ? { handleBack } : undefined}
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddLandlordModal;
