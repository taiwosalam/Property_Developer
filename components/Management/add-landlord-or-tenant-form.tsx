"use client";
import { useState, useEffect } from "react";
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
import { useAuthStore } from "@/store/authstrore";
import Picture from "../Picture/picture";
import Avatars from "../Avatars/avatars";

interface AddLandLordOrTenantFormProps {
  type: "landlord" | "tenant";
  submitAction: (data: any) => void;
}

const AddLandLordOrTenantForm: React.FC<AddLandLordOrTenantFormProps> = ({
  type,
  submitAction,
}) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [selectedLGA, setSelectedLGA] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [activeAvatar, setActiveAvatar] = useState("");
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);

  const accessToken = useAuthStore((state) => state.access_token);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  const handleLGAChange = (value: string) => {
    setSelectedLGA(value);
  };

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  useEffect(() => {
    const fetchData = async () => {
      // Update local governments based on selectedState
      if (selectedState) {
        const lgas = getLocalGovernments(selectedState);
        setLocalGovernments(lgas);
      } else {
        setLocalGovernments([]);
      }
      setSelectedLGA("");
    };

    fetchData(); // Call the async function to fetch data
  }, [selectedState, accessToken]); // Run effect when selectedState or accessToken changes

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={submitAction}
      className="custom-flex-col gap-5"
      setValidationErrors={setErrorMsgs}
    >
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          inputClassName="!bg-neutral-2"
          // validationErrors={errorMsgs} validation errors left to you Teni
        />
        <Select
          validationErrors={errorMsgs}
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState ? selectedState : undefined}
          onChange={handleStateChange} // Update handler
        />
        <Select
          validationErrors={errorMsgs}
          options={localGovernments}
          id="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={handleLGAChange} // Update handler
          value={selectedLGA ? selectedLGA : undefined} // Controlled value
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
      <div className="flex justify-between items-center">
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

export default AddLandLordOrTenantForm;
