import { useModal } from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { createNewBranch } from "./Branch/data";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import Picture from "@/components/Picture/picture";
import CameraCircle from "@/public/icons/camera-circle.svg";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import {
  CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";
import Image from "next/image";
import { AddLandlordModalOptions, CreateBranchModalOptions } from "../Landlord/types";
import CreateBranchForm from "./createBranchModal";

interface CreateBranchFormProps {
  chooseAvatar: () => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

const CreateBranchModal:React.FC = () => {
  const [activeStep, setActiveStep] = useState<CreateBranchModalOptions>("options");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const handleBack = () => setActiveStep("options");

  const handleSubmit = async (data: FormData) => {
    const res = await createNewBranch(data);

    // if (res) {
    //   setIsOpen(false);
    // }
  };

  type CreateBranchModalOptions =
    | "options"
    | "choose-avatar" 

  const modal_states: Record<
  CreateBranchModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Branch",
      content: <CreateBranchForm
        submitAction={handleSubmit}
        chooseAvatar={() => setActiveStep("choose-avatar")}
        avatar={selectedAvatar}
        setAvatar={setSelectedAvatar}
      />,
    },
    "choose-avatar": {
      heading: "Choose Avatar",
      content: (
        <Avatars
          onClick={(avatarUrl) => {
            setSelectedAvatar(avatarUrl);
            setActiveStep("options");
          }}
        />
      ),
    },
  }
  return (
    <LandlordTenantModalPreset 
    heading={modal_states[activeStep].heading} star
    back={
      activeStep === "choose-avatar"
        ? { handleBack: () => setActiveStep("options") }
        : activeStep !== "options"
        ? { handleBack }
        : undefined
    }
    >
 {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default CreateBranchModal;
