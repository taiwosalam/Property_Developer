"use client";

import { useState } from "react";

// Types
import type { AddLandlordModalOptions } from "./types";

// Imports
import { useRouter, usePathname } from "next/navigation";
import AddLandlordOptions from "./add-landlord-options";
import AddLandLordOrTenantForm from "../add-landlord-or-tenant-form";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import Avatars from "@/components/Avatars/avatars";
import InvitationForm from "../invitation-form";
import { addLandlord } from "./data";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
// import { useNavCreateNewContext } from "@/components/Nav/nav-create-new-context";

const AddLandlordModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
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

  const handleAddLandlord = (data: Record<string, any>) => {
    console.log(data);
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
          chooseAvatar={() => setActiveStep("choose-avatar")}
          type="landlord"
          submitAction={handleAddLandlord}
          avatar={selectedAvatar}
          setAvatar={setSelectedAvatar}
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
    "choose-avatar": {
      heading: "Choose Avatar",
      content: (
        <Avatars
          onClick={(avatarUrl) => {
            setSelectedAvatar(avatarUrl);
            setActiveStep("add-landlord");
          }}
        />
      ),
    },
  };

  return (
    <LandlordTenantModalPreset
      heading={modal_states[activeStep].heading}
      // back={handleBack()}
      back={
        activeStep === "choose-avatar"
          ? { handleBack: () => setActiveStep("add-landlord") }
          : activeStep !== "options"
          ? { handleBack }
          : undefined
      }
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddLandlordModal;
