"use client";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Button from "@/components/Form/Button/button";
import type { ValidationErrors } from "@/utils/types";
import {
  checkFormDataForImageOrAvatar,
  cleanPhoneNumber,
} from "@/utils/checkFormDataForImageOrAvatar";
import { PersonIcon, DeleteIconOrange } from "@/public/icons/icons";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { usePersonalInfoStore } from "@/store/personal-info-store";

interface IAddServiceProviderFormProps {
  submitAction: (data: any) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  stepForm: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}
const AddServiceProviderForm = ({
  submitAction,
  isLoading,
  setIsLoading,
  stepForm,
  setFormStep,
}: IAddServiceProviderFormProps) => {
  const {
    preview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: {
      unit: "MB",
      value: 2,
    },
  });

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
    avatarArray: [] as string[],
  });
  const [avatar, setAvatar] = useState("");
  const { selectedState, selectedLGA, avatarArray, errorMsgs, activeAvatar } =
    state;

  // const handleAvatarChange = (avatar: string) => {
  //   setPreview(avatar);
  //   setState((prev) => ({ ...prev, activeAvatar: avatar }));
  //   inputFileRef.current?.value && (inputFileRef.current.value = "");
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar("");
    originalHandleImageChange(e);
  };

  const handleAvatarSelection = (avatar: string) => {
    clearImageSelection();
    setAvatar(avatar);
    setFormStep(1);
  };

  const handleSubmit = async (data: FormData) => {
    if (!checkFormDataForImageOrAvatar(data, "avatar", "avatar_url")) {
      toast.warning("Please upload a picture or select an avatar");
      return;
    }
    setIsLoading(true);
    cleanPhoneNumber(data);
    if (!data.get("phone_number")) {
      data.append("phone_number", "");
    }
    console.log(avatar);
    await submitAction(data);
    setIsLoading(false);
  };

  const companyId = usePersonalInfoStore((state) => state.company_id);

  return (
    <div className="relative">
      <AuthForm
        returnType="form-data"
        skipValidation
        className={`custom-flex-col gap-5 transition-opacity duration-150 ${
          stepForm === 2 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onFormSubmit={handleSubmit}
        setValidationErrors={(errors: ValidationErrors) =>
          setState((prev) => ({ ...prev, errorMsgs: errors }))
        }
      >
        <input type="hidden" name="avatar_url" value={avatar} id="avatar_url" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            required
            id="first_name"
            name="name"
            label="full name"
            inputClassName="rounded-[8px]"
            validationErrors={errorMsgs}
          />
          <Input
            required
            id="company_name"
            name="company_name"
            label="company name"
            inputClassName="rounded-[8px]"
            validationErrors={errorMsgs}
          />
          <Input
            required
            id="email"
            name="email"
            label="email"
            type="email"
            inputClassName="rounded-[8px]"
            validationErrors={errorMsgs}
          />
          <Input
            id="service_render"
            name="service_render"
            label="Services Rendered"
            inputClassName="rounded-[8px]"
            validationErrors={errorMsgs}
          />
          <PhoneNumberInput
            id="company_phone"
            label="Company Phone"
            inputClassName="!bg-neutral-2 dark:!bg-transparent"
            //  validationErrors={errorMsgs}
          />
          <PhoneNumberInput
            id="phone"
            label="Personal Phone"
            inputClassName="!bg-neutral-2 dark:!bg-transparent"
            //  validationErrors={errorMsgs}
          />
          <Input
            id="address"
            name="address"
            label="Company Address"
            inputClassName="rounded-[8px]"
            validationErrors={errorMsgs}
          />
          <input
            type="hidden"
            name="company_id"
            id="company_id"
            defaultValue={companyId as string}
          />
          <Select
            options={getAllStates()}
            id="state"
            label="state"
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            value={selectedState}
            onChange={(value) => {
              setState((prev) => ({
                ...prev,
                selectedState: value,
                selectedLGA: "",
              }));
            }}
            validationErrors={errorMsgs}
          />
          <Select
            options={getLocalGovernments(selectedState)}
            value={selectedLGA}
            id="local_government"
            label="local government"
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            onChange={(value) => {
              setState((prev) => ({ ...prev, selectedLGA: value }));
            }}
            validationErrors={errorMsgs}
          />
        </div>
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="custom-flex-col gap-3">
            <p className="text-black text-base font-medium">
              Upload picture or select an avatar.
            </p>
            <div className="flex items-end gap-3">
              <label htmlFor="avatar" className="cursor-pointer relative">
                <div className="flex justify-start items-start">
                  <p className="text-red-500 text-lg">*</p>
                  <Picture src={preview} alt="Camera" size={70} rounded />
                </div>
                {preview && preview !== CameraCircle && (
                  <div
                    role="button"
                    aria-label="remove image"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.preventDefault();
                      clearImageSelection();
                    }}
                  >
                    <DeleteIconOrange size={20} />
                  </div>
                )}

                <input
                  required
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className="hidden pointer-events-none"
                  onChange={handleImageChange}
                  ref={inputFileRef}
                />
              </label>
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
                        setAvatar("");
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
          <Button
            type="submit"
            size="base_medium"
            className="ml-auto py-2 px-8"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </AuthForm>
      {stepForm === 2 && (
        <div className="bg-white absolute top-0 left-0 right-0 pb-[20px]">
          <Avatars onClick={handleAvatarSelection} />
        </div>
      )}
    </div>
  );
};

export default AddServiceProviderForm;
