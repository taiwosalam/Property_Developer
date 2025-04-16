"use client";
import { useState } from "react";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, genderTypes, titles, industryOptions } from "@/data";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
import {
  CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";
import Avatars from "@/components/Avatars/avatars";
import TextArea from "@/components/Form/TextArea/textarea";
import Image from "next/image";

interface DirectorsFormProps {
  submitAction: (data: any) => void;
  chooseAvatar: () => void;
  isProcessing?: boolean
  avatar: string | null;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  // setFormStep: React.Dispatch<React.SetStateAction<number>>;
  // formStep: number;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

const DirectorsForm: React.FC<DirectorsFormProps> = ({
  submitAction,
  chooseAvatar,
  avatar,
  setAvatar,
  isProcessing
}) => {
  const {
    preview: imagePreview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader();

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(null); // Clear the avatar when an image is selected
    originalHandleImageChange(e);
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
          name="title"
          label="Profile Title/Qualification"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <Select
          isSearchable={false}
          id="professional_title"
          label="real estate title"
          inputContainerClassName="bg-neutral-2"
          options={industryOptions}
        />
        <Input
          id="full_name"
          label="Full Name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
          required
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
          id="years_in_business"
          label="Years of Experience"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          //value={selectedState}
          //onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <PhoneNumberInput
          id="phone_number"
          label="phone number"
          inputClassName="!bg-neutral-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* <div className="flex flex-col gap-4 md:gap-5 md:justify-between">
          <Input
            id="password"
            type="password"
            label="Create password"
            placeholder="Create password"
            validationErrors={errorMsgs}
            required
          />
          <Input
            id="password_confirmation"
            type="password"
            label="Confirm password"
            placeholder="Confirm password"
            validationErrors={errorMsgs}
            required
          />
        </div> */}
        <div className="md:col-span-3 w-full">
          <TextArea
            id="about_director"
            label="About Director"
            placeholder=""
            inputSpaceClassName="md:!h-[120px]"
          />
        </div>
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
              onClick={chooseAvatar}
              className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
             { avatar && <input hidden  name="avatar" value={avatar}/>}
              {avatar ? (
                <div>
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
                </div>
              ) : (
                <PersonIcon />
              )}
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={inputFileRef}
          id="profile_picture"
          name="profile_picture"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button type="submit" size="base_medium" className={`py-2 px-8 ml-auto ${isProcessing ? 'opacity-70' : 'opacity-100'}`}
        disabled={isProcessing}>
         { isProcessing ? "Creating..." : "Create"} 
        </Button>
      </div>
    </AuthForm>
  );
};

export default DirectorsForm;
