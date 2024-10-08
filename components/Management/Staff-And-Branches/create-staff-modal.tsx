"use client";

import React, { useState } from "react";

// Types
import type { ValidationErrors } from "@/utils/types";
import type { CreateStaffModalProps } from "./types";

// Images
import PlusAvatar from "@/public/global/plus-avatar.svg";

// Imports
import { toast } from "sonner";
import { addStaff } from "./data";
import { useAuthStore } from "@/store/authstrore";
import Input from "@/components/Form/Input/input";
import Avatars from "@/components/Avatars/avatars";
import Picture from "@/components/Picture/picture";
import { useModal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({ branchId }) => {
  const { setIsOpen } = useModal();

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: PlusAvatar,
    });

  const [activeAvatar, setActiveAvatar] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  const accessToken = useAuthStore((state) => state.access_token);

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  const handleCreateStaff = async (data: FormData) => {
    // Check if "picture" or "avatar" is valid
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or select an avatar.");
      return;
    }

    // Get password fields from FormData
    const newPassword = data.get("new-password") as string | null;
    const confirmPassword = data.get("confirm_password") as string | null;

    // Check if passwords are provided and match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    // If passwords match, add a new field "password" with the value of create_password
    if (newPassword) {
      data.set("password", newPassword);
    }

    // Proceed with form submission if validation passes
    const isSuccess = await addStaff(data, accessToken);

    if (isSuccess) {
      setIsOpen(false);
    }
  };

  return (
    <LandlordTenantModalPreset star heading="Create New Staff">
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleCreateStaff}
        className="custom-flex-col gap-5"
        setValidationErrors={setErrorMsgs}
      >
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="branch_id" value={branchId} />
          <Select
            isSearchable
            id="personal_title"
            validationErrors={errorMsgs}
            label="personal title / qualifiction"
            inputContainerClassName="bg-neutral-2"
            options={["prince", "princess", "alhaji", "alhaja"]}
          />
          <Select
            isSearchable
            id="real_estate_title"
            label="real estate title"
            inputContainerClassName="bg-neutral-2"
            options={[
              "realtors",
              "real estate agent",
              "attorneys",
              "investors",
            ]}
            validationErrors={errorMsgs}
          />
          <Input
            required
            id="full_name"
            label="full name"
            validationErrors={errorMsgs}
            inputClassName="rounded-[8px]"
          />
          <Input
            required
            id="email"
            label="email"
            type="email"
            validationErrors={errorMsgs}
            inputClassName="rounded-[8px]"
          />
          <Select
            id="position"
            label="position"
            validationErrors={errorMsgs}
            inputContainerClassName="bg-neutral-2"
            options={[
              { value: "branch", label: "branch manager" },
              { value: "account", label: "account officer" },
              { value: "staff", label: "staff" },
            ]}
          />
          <Select
            id="gender"
            label="Gender"
            options={["male", "female"]}
            validationErrors={errorMsgs}
            inputContainerClassName="bg-neutral-2"
          />
          <Input
            id="phone_number"
            label="phone number"
            validationErrors={errorMsgs}
            inputClassName="rounded-[8px]"
          />
          <Input
            id="new-password"
            label="create password"
            validationErrors={errorMsgs}
            inputClassName="rounded-[8px]"
          />
          <Input
            id="confirm_password"
            label="confirm password"
            validationErrors={errorMsgs}
            inputClassName="rounded-[8px]"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="custom-flex-col gap-3">
            <p className="text-black text-base font-medium">
              Upload staff picture or choose an avatar.
            </p>
            <div className="flex gap-3 items-center">
              <label htmlFor="picture" className="cursor-pointer">
                <Picture
                  src={preview}
                  alt="plus"
                  size={40}
                  className="rounded-[4px] bg-[#D9D9D9] border border-solid border-neutral-4"
                />
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  accept="image/*"
                  className="hidden pointer-events-none"
                  onChange={handleImageChange}
                />
                <input type="hidden" name="avatar" value={activeAvatar} />
              </label>
              <Avatars
                type="avatars"
                maxSize={4}
                onClick={handleAvatarChange}
              />
            </div>
          </div>
          <Button type="submit" size="base_medium" className="py-2 px-8">
            create
          </Button>
        </div>
      </AuthForm>
    </LandlordTenantModalPreset>
  );
};

export default CreateStaffModal;
