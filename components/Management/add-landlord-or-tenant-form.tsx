"use client";
import { useState } from "react";
import Image from "next/image";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, landlordTypes, genderTypes } from "@/data";
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Button from "../Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "../Auth/auth-components";
import {
  CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";
import Avatars from "@/components/Avatars/avatars";

interface AddLandLordOrTenantFormProps {
  type: "landlord" | "tenant";
  submitAction: (data: any) => void;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  formStep: number;
}

const AddLandLordOrTenantForm: React.FC<AddLandLordOrTenantFormProps> = ({
  type,
  submitAction,
  setFormStep,
  formStep,
}) => {
  const {
    preview: imagePreview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [address, setAddress] = useState({
    selectedState: "",
    selectedLGA: "",
    // selectedCity: "", // form not looking for city
  });

  const { selectedState, selectedLGA } = address;
  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(null); // Clear the avatar when an image is selected
    originalHandleImageChange(e);
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setAvatar(avatarUrl);
    setFormStep(1);
  };

  return formStep === 1 ? (
    <AuthForm
      // returnType="form-data"
      skipValidation
      onFormSubmit={submitAction}
      className="custom-flex-col gap-5"
    >
      <input type="hidden" name="avatar" value={avatar || ""} />

      <input type="hidden" name="agent" value="web" />

      <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="first_name"
          label="first name"
          inputClassName="rounded-[8px]"
        />
        <Input
          required
          id="last_name"
          label="last name"
          inputClassName="rounded-[8px]"
        />
        <Input
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
        />
        <PhoneNumberInput
          id="phone_number"
          label="phone number"
          inputClassName="!bg-neutral-2 dark:!bg-transparent"
        />
        <Select
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <Select
          options={getLocalGovernments(selectedState)}
          id="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={(value) => handleAddressChange("selectedLGA", value)}
          value={selectedLGA}
        />
        <Input id="address" label="address" inputClassName="rounded-[8px]" />
        <Select
          options={type === "landlord" ? landlordTypes : tenantTypes}
          id={`${type === "landlord" ? "owner" : "tenant"}_type`}
          label={`${type === "landlord" ? "owner" : "Tenant/Occupant"} Type`}
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
        <Select
          options={genderTypes}
          id="gender"
          label="Gender"
          isSearchable={false}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
      </div>
      <div className="flex justify-between items-end flex-wrap gap-4 md:gap-5">
        <div className="custom-flex-col gap-3">
          <p className="text-black dark:text-darkText-1 text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <div className="flex items-end gap-3">
            <button
              type="button"
              className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
              aria-label="upload picture"
              onClick={() => inputFileRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="avatar"
                    width={70}
                    height={70}
                    className="object-cover object-center w-[70px] h-[70px] rounded-full"
                  />
                  <div
                    role="button"
                    aria-label="remove image"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImageSelection();
                    }}
                  >
                    <DeleteIconOrange size={20} />
                  </div>
                </>
              ) : (
                <CameraIcon2 />
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormStep(2)}
              className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
              {avatar ? (
                <>
                  <Image
                    src={avatar}
                    alt="selected avatar"
                    width={70}
                    height={70}
                    className="object-cover object-center w-[70px] h-[70px] rounded-full bg-brand-9"
                  />
                  <div
                    role="button"
                    aria-label="remove avatar"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAvatar(null);
                    }}
                  >
                    <DeleteIconOrange size={20} />
                  </div>
                </>
              ) : (
                <PersonIcon />
              )}
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={inputFileRef}
          name="picture"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button type="submit" size="base_medium" className="py-2 px-8 ml-auto">
          create
        </Button>
      </div>
    </AuthForm>
  ) : (
    <Avatars onClick={handleAvatarSelection} />
  );
};

export default AddLandLordOrTenantForm;
