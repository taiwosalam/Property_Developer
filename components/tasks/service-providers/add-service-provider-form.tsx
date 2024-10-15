"use client";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
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

const AddServiceProviderForm = ({
  submitAction,
}: {
  submitAction: (data: any) => void;
}) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
    avatarArray: [] as string[],
  });
  const { selectedState, selectedLGA, avatarArray, errorMsgs, activeAvatar } =
    state;

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setState((prev) => ({ ...prev, activeAvatar: avatar }));
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      selectedLGA: "",
    }));
  }, [selectedState]);

  return (
    <AuthForm
      className="custom-flex-col gap-5"
      onFormSubmit={submitAction}
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prev) => ({ ...prev, errorMsgs: errors }))
      }
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="full_name"
          label="full name"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          required
          id="company_name"
          label="company name"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          required
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="services_rendered"
          label="Services Rendered"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <PhoneNumberInput
          id="company_phone"
          label="Company Phone"
          inputClassName="!bg-neutral-2"
          //   validationErrors={errorMsgs}
        />
        <PhoneNumberInput
          id="personal_phone"
          label="Personal Phone"
          inputClassName="!bg-neutral-2"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="company_address"
          label="Company Address"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Select
          //   validationErrors={errorMsgs}
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(value) => {
            setState((prev) => ({ ...prev, selectedState: value }));
          }}
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
          //   validationErrors={errorMsgs}
        />
      </div>
      <div className="flex justify-between items-end">
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or select an avatar.
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
        <Button type="submit" size="base_medium" className="py-2 px-8">
          create
        </Button>
      </div>
    </AuthForm>
  );
};

export default AddServiceProviderForm;
