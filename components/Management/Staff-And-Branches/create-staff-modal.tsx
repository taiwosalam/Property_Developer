"use client";

import { useState } from "react";
import type { CreateStaffModalProps } from "./types";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Image from "next/image";
import { toast } from "sonner";
import { addStaff, isValidEmail } from "./data";
import Input from "@/components/Form/Input/input";
import Avatars from "@/components/Avatars/avatars";
import Picture from "@/components/Picture/picture";
import { useModal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import {
  checkFormDataForImageOrAvatar,
  cleanPhoneNumber,
} from "@/utils/checkFormDataForImageOrAvatar";
import { titles, genderTypes, industryOptions } from "@/data";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import useBranchStore from "@/store/branch-store";
import { validateAndCleanPhoneNumber } from "@/utils/validatePhoneNumber";
import useWindowWidth from "@/hooks/useWindowWidth";

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  branchId,
  hasManager,
}) => {
  const { setIsOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const { branch } = useBranchStore();
  const { isMobile } = useWindowWidth();

  const { staffs } = branch;
  // console.log("Branch data", branch.isManagerAvailable)

  const {
    preview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
  });

  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setSelectedAvatar(avatarUrl);
    setFormStep(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar("");
    originalHandleImageChange(e);
  };

  const handleCreateStaff = async (data: FormData) => {
    const email = data.get("email")?.toString() || "";
    const phoneNumber = data.get("phone_number")?.toString() || "";

    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or select an avatar.");
      return;
    }

    const isEmailValid = await isValidEmail(email);
    if (!isEmailValid) {
      toast.warning("Invalid email address!");
      return;
    }

    // Validate phone number
    const cleanedPhoneNumber = validateAndCleanPhoneNumber(phoneNumber);
    if (!cleanedPhoneNumber && phoneNumber) {
      toast.warning("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    // Replace the original phone number with the cleaned version
    data.set("phone_number", cleanedPhoneNumber || "");

    const status = await addStaff(data, branchId);
    if (status) {
      setIsOpen(false);
      window.dispatchEvent(new Event("refetch_staff"));
    } else {
      setIsLoading(false);
    }
  };

  const STAFF_ROLE_OPTIONS = [
    ...(hasManager ? [] : [{ value: "manager", label: "branch manager" }]),
    // { value: "account_officer", label: "account officer" },
    { value: "account officer", label: "account manager" },
    { value: "staff", label: "Other Staff" },
  ];

  return (
    <LandlordTenantModalPreset
      star={formStep === 1}
      heading={formStep === 2 ? "Choose Avatar" : "Create New Staff"}
      back={formStep === 2 ? { handleBack: () => setFormStep(1) } : undefined}
      className="w-[92%] sm:w-[90%] md:w-[85%] max-md:h-[70vh]"
    >
      <div className="relative">
        <AuthForm
          skipValidation
          returnType="form-data"
          onFormSubmit={handleCreateStaff}
          className={`custom-flex-col gap-5 transition-opacity duration-150 ${
            formStep === 2 ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <input type="hidden" name="avatar" value={selectedAvatar} />
          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Select
              id="title"
              label="personal title / qualifiction"
              inputContainerClassName="bg-neutral-2"
              options={titles}
            />
            <Select
              id="professional_title"
              label="real estate title"
              required
              inputContainerClassName="bg-neutral-2"
              options={industryOptions}
            />
            <Input
              required
              id="full_name"
              label="full name"
              inputClassName="rounded-[8px]"
            />
            <Input
              required
              id="email"
              label="email"
              type="email"
              inputClassName="rounded-[8px]"
            />
            <Select
              id="position"
              required
              label="Staff Role"
              inputContainerClassName="bg-neutral-2"
              options={STAFF_ROLE_OPTIONS}
            />
            <Select
              id="gender"
              label="Gender"
              options={genderTypes}
              inputContainerClassName="bg-neutral-2"
              isSearchable={false}
            />
            <PhoneNumberInput
              id="phone_number"
              label="WhatsApp number"
              required
              inputContainerClassName="bg-neutral-2"
            />
          </div>
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div className="custom-flex-col gap-3">
              <p className="text-black dark:text-white text-base font-medium">
                <span className="text-status-error-primary">*</span>
                Upload staff picture or choose an avatar.
              </p>
              <div className="flex gap-3 items-end">
                <label htmlFor="picture" className="relative cursor-pointer">
                  <Picture
                    src={preview}
                    alt="plus"
                    size={isMobile ? 40 : 70}
                    rounded
                  />
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
                      <DeleteIconOrange size={isMobile ? 16 : 20} />
                    </div>
                  )}
                  <input
                    type="file"
                    id="picture"
                    name="picture"
                    accept="image/*"
                    className="hidden pointer-events-none"
                    onChange={handleImageChange}
                    ref={inputFileRef}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="bg-[rgba(42,42,42,0.63)] w-[40px] md:w-[70px] h-[40px] md:h-[70px] rounded-full flex items-center justify-center text-white relative"
                  aria-label="choose avatar"
                >
                  {selectedAvatar ? (
                    <>
                      <Image
                        src={selectedAvatar}
                        alt="selected avatar"
                        width={isMobile ? 40 : 70}
                        height={isMobile ? 40 : 70}
                        className="object-cover object-center w-[40px] md:w-[70px] h-[40px] md:h-[70px] rounded-full bg-brand-9"
                      />
                      <div
                        role="button"
                        aria-label="remove avatar"
                        className="absolute top-0 right-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAvatar("");
                        }}
                      >
                        <DeleteIconOrange size={isMobile ? 16 : 20} />
                      </div>
                    </>
                  ) : (
                    <PersonIcon size={isMobile ? 16 : 20} />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="base_medium"
              className="py-2 px-8 ml-auto"
              disabled={isLoading}
            >
              {isLoading ? "creating..." : "create"}
            </Button>
          </div>
        </AuthForm>
        {formStep === 2 && (
          <div className="absolute top-0 left-0 right-0 pb-[20px]">
            <Avatars onClick={handleAvatarSelection} />
          </div>
        )}
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateStaffModal;
