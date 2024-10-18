"use client";
import { useState } from "react";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, genderTypes, titles } from "@/data";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
import { useAuthStore } from "@/store/authstrore";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import TextArea from "@/components/Form/TextArea/textarea";

interface DirectorsFormProps {
  submitAction: (data: any) => void;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

const DirectorsForm: React.FC<DirectorsFormProps> = ({ submitAction }) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;

  const accessToken = useAuthStore((state) => state.access_token);

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setState((prevState) => ({ ...prevState, activeAvatar: avatar }));
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  const handleAddressChange = (field: Address, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={submitAction}
      className="custom-flex-col gap-5"
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prevState) => ({ ...prevState, errorMsgs: errors }))
      }
    >
      <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Select
          options={titles}
          id="title"
          label="Profile Tilte/Qualification"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <Select
          isSearchable={false}
          id="real-estate-title"
          label="real estate title"
          inputContainerClassName="bg-neutral-2"
          options={["realtors", "real estate agent", "attorneys", "investors"]}
        />
        <Input
          id="full_name"
          label="Full Name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
          required
        />
          <Select
            validationErrors={errorMsgs}
            options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
            id="experience"
            label="Years of Experience"
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            value={selectedState}
            onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <PhoneNumberInput
          id="phone_number"
          label="phone number"  
          inputClassName="!bg-neutral-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="flex flex-col gap-4 md:gap-5 md:justify-between">
         <Input
          id="password"
          type="password"
          label="Create password"
          placeholder="Create password"
          validationErrors={errorMsgs}
          required
        />
         <Input
          id="confirm-password"
          type="password"
          label="Confirm password"
          placeholder="Confirm password"
          validationErrors={errorMsgs}
          required
        />
        </div>
            <TextArea
            id="about"
            label="About Director"
            placeholder=""
            inputSpaceClassName="md:!h-[90px]"
        />
          
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or choose an avatar.
          </p>
          <div className="flex items-end gap-3">
            <label htmlFor="picture" className="relative cursor-pointer">
              <Picture src={preview} alt="camera" size={70} rounded />
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="hidden pointer-events-none"
                onChange={handleImageChange}
                ref={inputFileRef}
              />
              <input type="hidden" name="avatar" value={activeAvatar} />
            </label>
            <Avatars type="avatars" onClick={handleAvatarChange} />
          </div>
        </div>
        </div>
        <div className="flex w-full items-end justify-end">
        <Button type="submit" size="base_medium" className="py-2 px-8 ml-auto">
          create
        </Button>
        </div>
    </AuthForm>
  );
};

export default DirectorsForm;
