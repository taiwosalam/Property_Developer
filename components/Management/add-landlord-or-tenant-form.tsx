"use client";
import { useState } from "react";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, landlordTypes, genderTypes } from "@/data";
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Button from "../Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "../Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
import Picture from "../Picture/picture";
import Avatars from "../Avatars/avatars";

interface AddLandLordOrTenantFormProps {
  type: "landlord" | "tenant";
  submitAction: (data: any) => void;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

const AddLandLordOrTenantForm: React.FC<AddLandLordOrTenantFormProps> = ({
  type,
  submitAction,
}) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    // selectedCity: "", // form not looking for city
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;

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
        <Input
          required
          id="first_name"
          label="first name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          required
          id="last_name"
          label="last name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <PhoneNumberInput
          id="phone_number"
          label="phone number"
          inputClassName="!bg-neutral-2 dark:!bg-transparent"
          // validationErrors={errorMsgs} validation errors left to you Teni!
        />
        <Select
          validationErrors={errorMsgs}
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(value) => handleAddressChange("selectedState", value)}
        />
        <Select
          validationErrors={errorMsgs}
          options={getLocalGovernments(selectedState)}
          id="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={(value) => handleAddressChange("selectedLGA", value)}
          value={selectedLGA}
        />
        <Input
          validationErrors={errorMsgs}
          id="address"
          label="address"
          inputClassName="rounded-[8px]"
        />
        <Select
          validationErrors={errorMsgs}
          options={type === "landlord" ? landlordTypes : tenantTypes}
          id={`${type === "landlord" ? "owner" : "tenant"}_type`}
          label={`${type === "landlord" ? "owner" : "Tenant/Occupant"} Type`}
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
        <Select
          validationErrors={errorMsgs}
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
        <Button type="submit" size="base_medium" className="py-2 px-8 ml-auto">
          create
        </Button>
      </div>
    </AuthForm>
  );
};

export default AddLandLordOrTenantForm;
