"use client";
import { useEffect, useState } from "react";
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
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs from "dayjs";
import { deleteDirector } from "./data";
import { toast } from "sonner";

interface DirectorsFormProps {
  submitAction: (data: any) => void;
  chooseAvatar: () => void;
  isProcessing?: boolean;
  avatar: string | null;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCloseUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  formData?: Record<string, string>;
  onFormChange?: (field: string, value: string) => void;
  isEditing?: boolean;
  initialImage?: string | null;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

const DirectorsForm: React.FC<DirectorsFormProps> = ({
  submitAction,
  chooseAvatar,
  avatar,
  setAvatar,
  isProcessing,
  formData,
  onFormChange,
  isEditing,
  initialImage,
  setIsCloseUpdate
}) => {
  const {
    preview: imagePreview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
    setPreview,
  } = useImageUploader();

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage, setPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(null); // Clear the avatar when an image is selected
    originalHandleImageChange(e);
  };

  const handleAvatarSelect = () => {
    clearImageSelection(); // Clear the image preview when choosing avatar
    chooseAvatar();
  };

  useEffect(() => {
    if (avatar) {
      clearImageSelection();
    }
  }, [avatar]);


  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddressChange = (field: Address, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };

  const handleDeleteDirector = async () => {
    try {
      setIsDeleting(true);
      if (isEditing && formData?.id) {
        const res = await deleteDirector(formData?.id || "");
        if (res) {
          toast.success("Director deleted");
          setIsCloseUpdate?.(false);
        }
      }
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
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
          value={formData?.title || ""}
          onChange={(value) => onFormChange?.("title", value)}
        />
        <Select
          isSearchable={false}
          id="professional_title"
          label="real estate title"
          inputContainerClassName="bg-neutral-2"
          options={industryOptions}
          value={formData?.professional_title || ""}
          onChange={(value) => onFormChange?.("professional_title", value)}
        />

        <Input
          id="full_name"
          label="Full Name"
          value={formData?.full_name || ""}
          onChange={(value) => onFormChange?.("full_name", value)}
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
          required
        />
        <Input
          id="email"
          label="email"
          type="email"
          value={formData?.email || ""}
          onChange={(value) => onFormChange?.("email", value)}
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
          required
        />
        <DateInput
          id="years_in_business"
          label=" Years of Experience (Since)"
          onChange={(value) =>
            onFormChange?.("years_in_business", value ? value.toString() : "")
          }
          value={
            formData?.years_in_business
              ? dayjs(formData.years_in_business)
              : null
          }
        />
       
        <PhoneNumberInput
          disabled={formData?.phone_number ? true : false}
          id="phone_number"
          label="phone number"
          inputClassName="!bg-neutral-2"
          value={formData?.phone_number || ""}
          onChange={(value) => onFormChange?.("phone_number", value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
       
        <div className="md:col-span-3 w-full">
          <TextArea
            id="about_director"
            label="About Director"
            placeholder=""
            inputSpaceClassName="md:!h-[120px]"
            value={formData?.about_director || ""}
            onChange={(value) => onFormChange?.("about_director", value)}
          />
        </div>
      </div>
      <div className="flex justify-between items-end flex-wrap gap-4 md:gap-5">
        <div className="custom-flex-col gap-3">
          <div className="flex gap-1">
            <span className="text-red-600">*</span>
            <p className="text-black dark:text-darkText-1 text-base font-medium">
              Upload picture or select an avatar.
            </p>
          </div>
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
              onClick={() => handleAvatarSelect()}
              className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
              {avatar && <input hidden name="avatar" value={avatar} />}
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
        {isEditing ? (
          <div className="flex gap-4">
            <Button
              onClick={handleDeleteDirector}
              size="base_medium"
              className={`py-2 px-8 ml-auto text-white bg-opacity-90 font-semibold ${
                isDeleting ? "opacity-70" : "opacity-100"
              }`}
              variant="red"
              disabled={isDeleting}
            >
              {isDeleting ? "Please wait..." : "Delete"}
            </Button>
            <Button
              type="submit"
              size="base_medium"
              className={`py-2 px-8 ml-auto ${
                isProcessing ? "opacity-70" : "opacity-100"
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Please wait..." : "Update"}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            size="base_medium"
            className={`py-2 px-8 ml-auto ${
              isProcessing ? "opacity-70" : "opacity-100"
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? "Creating..." : "Create"}
          </Button>
        )}
      </div>
    </AuthForm>
  );
};
export default DirectorsForm;
