"use client";

import React, { useEffect, useState } from "react";

// Images
import { Check } from "lucide-react";
import DangerIcon from "@/public/icons/danger.svg";
import ImageBlue from "@/public/icons/image-blue.svg";
import SignatureImage from "@/public/accounting/signature.svg";

// Imports
import { industryOptions, titles } from "@/data";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import FundingCard from "@/components/Wallet/AddFunds/funding-card";
import SettingsSection from "@/components/Settings/settings-section";
import { ProfileUpload } from "@/components/Settings/settings-components";
import SettingsPasswordSection from "@/components/Settings/settings-password-section";
import SettingsWalletSection from "@/components/Settings/settings-wallet-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  cleanPhoneNumber,
  objectToFormData,
} from "@/utils/checkFormDataForImageOrAvatar";
import {
  base64ToBlob,
  FormState,
  initialData,
  InitialDataTypes,
  transformProfileData,
  updateDirectorProfile,
  updateUserProfile,
} from "./data";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import SettingsSignature from "@/components/Settings/settings-signature";
import SettingsBank from "@/components/Settings/settings-bank";
import SettingsSmtp from "@/components/Settings/settings-smtp";
import SettingsSMS from "@/components/Settings/settings-sms";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import TextArea from "@/components/Form/TextArea/textarea";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { NameVerification } from "@/components/Settings/name-verification";
import { Avatar } from "@/components/ui/avatar";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import Avatars from "@/components/Avatars/avatars";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Image from "next/image";

const Security = () => {
  const name = usePersonalInfoStore((state) => state.full_name);
  const title = usePersonalInfoStore((state) => state.title);
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
  const [pageData, setPageData] = useState<InitialDataTypes>(initialData);
  const [avatar, setAvatar] = useState("");

  const [fullName, setFullName] = useState<string>(pageData?.fullname || "");

  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleImageChange(e);
    setAvatar("");
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection(); // Clear any selected image
    setAvatar(avatarUrl);
    if (avatarUrl) {
      setIsOpen(false);
      setPageData((prev) => ({
        ...prev,
        profile_picture: "", // Clear the profile picture
      }));
    }
  };

  useEffect(() => {
    setFullName(pageData?.fullname || "");
  }, [pageData?.fullname]);

  const onChangeFullName = (value: string) => {
    setFullName(value);
  };

  const yearsOptions = Array.from({ length: 10 }, (_, i) => {
    const yearValue = i + 1;
    return { label: `${yearValue} years +`, value: `${yearValue}` };
  });

  const [inputFields, setInputFields] = useState([
    { id: Date.now(), signature: SignatureImage },
  ]);
 
  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: name || "",
    title: title || "",
  });

  const { data, loading, error } = useFetch("/user/profile");

  // console.log("data", pageData)
  useEffect(() => {
    if (data) {
      setPageData((x) => ({
        ...x,
        ...transformProfileData(data),
      }));
    }
  }, [data]);

  const setUpdateState = (fieldName: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [fieldName]: value }));
  };

  const changeImage = () => {
    inputFileRef?.current?.click();
    setAvatar("");
  };

  const handleUpdateProfile = async (formData: FormData) => {
    const payload = new FormData();

    // Append all form fields
    payload.append("full_name", (formData.get("full_name") as string) || "");
    payload.append("title", (formData.get("title") as string) || "");
    payload.append(
      "professional_title",
      (formData.get("professional_title") as string) || ""
    );
    payload.append(
      "years_in_business",
      (formData.get("years_in_business") as string) || ""
    );
    payload.append(
      "about_director",
      (formData.get("about_director") as string) || ""
    );
    payload.append("phone_number", (formData.get("phone") as string) || "");
    payload.append("alt_email", (formData.get("alt_email") as string) || "");

    // const payload = {
    //   full_name: data.get("full_name"),
    //   title: data.get("title"),
    //   professional_title: data.get("professional_title"),
    //   profile_picture: data.get("picture"),
    //   avatar:  data.get("avatar"),
    //   years_in_business: data.get("years_in_business"),
    //   about_director: data.get("about_director"),
    //   phone_number: data.get("phone"),
    //   alt_email: data.get("alt_email"),
    // };
    if (avatar) {
      // If avatar is selected, use it

      payload.append("avatar_url", avatar);
    } else if (formData.get("picture")) {
      // If a file was uploaded, use that
      payload.append("profile_picture", formData.get("picture") as Blob);
    }

    try {
      setReqLoading(true);
      const res = await updateDirectorProfile(payload);
      if (res && "status" in res && res.status === 200) {
        // console.log(res);
        toast.success("Profile updated successfully");
        setNext(true);
        window.dispatchEvent(new Event("fetch-profile"));
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <>
      <SettingsSection title="directors profile">
        <AuthForm
          onFormSubmit={handleUpdateProfile}
          skipValidation
          returnType="form-data"
        >
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle
                title="Director Display Picture"
                desc="The profile photo size should be 180 x 180 pixels with a maximum file size of 2MB."
              />
              <div className="custom-flex-col gap-[18px]">
                <p className="text-black dark:text-darkText-1 text-base font-medium">
                  <span className="text-status-error-primary">*</span> Upload
                  picture or select an avatar.
                </p>
                <div className="flex items-center gap-4">
                  <label htmlFor="picture" className="cursor-pointer relative">
                    <Picture
                      src={preview || avatar || pageData?.profile_picture}
                      alt="Camera"
                      size={70}
                      rounded
                      className="bg-[rgba(42,42,42,0.63)]"
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
                        <DeleteIconOrange size={20} />
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
                  <Modal state={{ isOpen, setIsOpen }}>
                    <ModalTrigger>
                      <button
                        type="button"
                        className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
                        aria-label="choose avatar"
                      >
                        {avatar ? (
                          <>
                            <input
                              hidden
                              value={avatar}
                              name="avatar"
                              id="avatar"
                            />
                            <Image
                              src={avatar}
                              width={70}
                              height={70}
                              alt="selected avatar"
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
                    </ModalTrigger>

                    <ModalContent className="relative">
                      <LandlordTenantModalPreset heading="Choose Avatar">
                        <Avatars onClick={handleAvatarSelection} />
                      </LandlordTenantModalPreset>
                    </ModalContent>
                  </Modal>
                </div>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <Select
                    id="title"
                    name="title"
                    options={titles}
                    label="personal title"
                    inputContainerClassName="bg-neutral-2"
                    defaultValue={pageData?.personal_title}
                  />

                  <Select
                    id="professional_title"
                    name="professional_title"
                    options={industryOptions}
                    label="professional title"
                    inputContainerClassName="bg-neutral-2"
                    defaultValue={pageData?.professional_title}
                  />
                  <div className="relative">
                    <Input
                      id="full_name"
                      name="full_name"
                      label="full name"
                      placeholder="Write Here"
                      value={fullName}
                      onChange={onChangeFullName}
                    />
                    <Modal>
                      <ModalTrigger>
                        <Button className="bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-500/70 dark:hover:bg-blue-500/70 text-white absolute top-9 right-2 py-2 h-9">
                          Verify
                        </Button>
                      </ModalTrigger>
                      <ModalContent>
                        <NameVerification fullName={fullName} />
                      </ModalContent>
                    </Modal>
                  </div>

                  <Input
                    id="alt_email"
                    label="email"
                    type="email"
                    placeholder="write here"
                    inputClassName="rounded-[8px] setup-f bg-white"
                    defaultValue={pageData?.director_email}
                  />

                  <Select
                    id="years_in_business"
                    label="years of experience"
                    placeholder="Write here"
                    options={yearsOptions}
                    hiddenInputClassName="setup-f"
                    defaultValue={pageData?.director_experience}
                  />

                  <PhoneNumberInput
                    id="phone"
                    label="phone number"
                    placeholder="800 0000 000"
                    inputClassName="setup-f"
                    defaultValue={pageData?.phone}
                  />
                </div>
                <TextArea
                  id="about_director"
                  label="About Director"
                  placeholder="Write about the director"
                  hiddenInputClassName="setup-f"
                  defaultValue={pageData?.about_director}
                />
              </div>
            </div>
            <SettingsUpdateButton
              submit
              loading={reqLoading}
              action={handleUpdateProfile as any}
            />
          </div>
        </AuthForm>
      </SettingsSection>
      <SettingsSignature />
      <SettingsWalletSection />
      <SettingsPasswordSection />
      <SettingsBank />
      <SettingsSMS />
      <SettingsSmtp />
    </>
  );
};

export default Security;
