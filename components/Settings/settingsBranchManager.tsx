"use client";

import React, { useEffect, useState } from "react";

// Images
import { Check } from "lucide-react";
import DangerIcon from "@/public/icons/danger.svg";
import ImageBlue from "@/public/icons/image-blue.svg";
import SignatureImage from "@/public/accounting/signature.svg";

// Imports
import { genderTypes, industryOptions, titles } from "@/data";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";
import { ProfileUpload } from "@/components/Settings/settings-components";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  cleanPhoneNumber,
  objectToFormData,
} from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  FormState,
  initialData,
  InitialDataTypes,
  transformProfileData,
  updateUserProfile,
} from "@/app/(nav)/settings/security/data";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import TextArea from "@/components/Form/TextArea/textarea";
import { useRole } from "@/hooks/roleContext";
import useFetch from "@/hooks/useFetch";
import Avatars from "@/components/Avatars/avatars";
import CameraCircle from "@/public/icons/camera-circle.svg";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Button from "../Form/Button/button";
import { NameVerification } from "./name-verification";
import { validateAndCleanPhoneNumber } from "@/utils/validatePhoneNumber";
import { useBranchInfoStore } from "@/store/branch-info-store";
import { updateStaffPicture, updateStaffProfile } from "@/app/(nav)/manager/management/branch-staff/[staffId]/edit/data";

const ManagerProfile = () => {
  const { role } = useRole();
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
  const [picture, setPicture] = useState(pageData?.profile_picture || "");
  const [reqLoading, setReqLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [closeVerificationModal, setCloseVerificationModal] = useState(false);
  const managerID = useBranchInfoStore((s) => s.manager.id);
  const staffID = role === "manager" ? managerID : 0; //TODO: get staff id for account officer and staff later
  const branchId = useBranchInfoStore((s) => s.branch_id);

  const { data, loading, error, refetch } = useFetch("/user/profile");
  useRefetchOnEvent("fetch-profile", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      setPageData((x) => ({
        ...x,
        ...transformProfileData(data, true),
      }));
    }
  }, [data]);

  useEffect(() => {
    if (pageData?.profile_picture) {
      // setAvatar(pageData?.profile_picture);
      setPicture(pageData?.profile_picture);
    }
  }, [pageData?.profile_picture]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleImageChange(e);
    setPicture("");
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection(); // Clear any selected image
    setAvatar(avatarUrl);
    if (avatarUrl) {
      setPicture("");
      setIsOpen(false);
      setPageData((prev) => ({
        ...prev,
        profile_picture: "", // Clear the profile picture
      }));
    }
  };

  const handleUpdateProfile = async (data: Record<string, string | File>) => {
    console.log("data", data);
    const phoneNumber = data.phone_number as string;
    // Validate phone number
    const cleanedPhoneNumber = validateAndCleanPhoneNumber(phoneNumber) || "";
    if (!cleanedPhoneNumber && phoneNumber) {
      toast.warning("Please enter a valid phone number.");
      return;
    }

    // Construct user payload
    const payload: Record<string, string | File> = {
      name: data.full_name,
      title: data.personal_title,
      gender: data.gender,
      bio: data.about,
      professional_title: data.professional_title,
      email: data.email || "",
    };

    // Construct staff payload
    const staffPayload = {
      full_name: data.full_name,
      title: data.personal_title,
      gender: data.gender,
      bio: data.about,
      professional_title: data.professional_title,
      phone_number: "",
    };

    // Only include phone number if it has changed
    if (cleanedPhoneNumber !== pageData.phone) {
      payload.phone = cleanedPhoneNumber;
      staffPayload.phone_number = cleanedPhoneNumber;
    }

    // Prepare picture or avatar for both user and staff
    let imageChanged = false;
    const pictureFormData = new FormData();

    if (data.picture instanceof File && data.picture.size > 0) {
      if (pageData.profile_picture !== preview) {
        payload.picture = data.picture;
        pictureFormData.append("picture", data.picture);
        imageChanged = true;
      }
    } else if (avatar && avatar !== pageData.profile_picture) {
      payload.avatar = avatar;
      pictureFormData.append("avatar", avatar);
      imageChanged = true;
    }


    try {
      setReqLoading(true);

      // Update user profile
      const userRes = await updateUserProfile(objectToFormData(payload));
      if (userRes) {
        let success = true;

        // Update staff profile if staffID exists
        if (staffID) {
          const staffRes = await updateStaffProfile(staffID.toString(), objectToFormData(staffPayload));
          if (!staffRes) {
            success = false;
          }
          // Update staff picture if changed
          if (imageChanged) {
            const pictureRes = await updateStaffPicture(staffID.toString(), pictureFormData);
            if (!pictureRes) {
              success = false;
            }
          }
        }

        // Show single success toast if all operations succeeded
        if (success) {
          toast.success("Profile updated successfully");
          window.dispatchEvent(new Event("fetch-profile"));
        }
      } else {
        throw new Error("User profile update failed");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setReqLoading(false);
    }
  };

  const [fullName, setFullName] = useState<string>(pageData?.fullname || "");

  useEffect(() => {
    setFullName(pageData?.fullname || "");
  }, [pageData?.fullname]);

  const onChangeFullName = (value: string) => {
    setFullName(value);
  };

  return (
    <>
      <SettingsSection
        title={role === "manager" ? "Manager profile" : "My profile"}
      >
        <AuthForm onFormSubmit={handleUpdateProfile} skipValidation>
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle
                title="Profile Picture"
                desc="The profile photo size should be 180 x 180 pixels with a maximum file size of 2MB."
              />
              <div className="custom-flex-col gap-[18px]">
                <div className="flex items-center gap-4">
                  <label htmlFor="picture" className="cursor-pointer relative">
                    <Picture
                      src={picture || preview}
                      alt="Camera"
                      size={70}
                      rounded
                      className="bg-[rgba(42,42,42,0.63)]"
                    />
                    {preview && picture && preview !== CameraCircle && (
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Select
                    id="personal_title"
                    options={titles}
                    label="personal title"
                    inputContainerClassName="bg-neutral-2"
                    defaultValue={pageData?.personal_title}
                  />
                  <Select
                    isSearchable={false}
                    id="professional_title"
                    label="real estate title"
                    inputContainerClassName="bg-neutral-2"
                    options={industryOptions}
                    defaultValue={pageData?.professional_title}
                  />
                  <div className="relative">
                    <Input
                      disabled={pageData?.is_bvn_verified}
                      inputClassName="capitalize"
                      id="full_name"
                      name="full_name"
                      label="full name"
                      placeholder="Write Here"
                      readOnly={pageData?.is_bvn_verified}
                      value={fullName ? fullName.toLowerCase() : ""}
                      onChange={onChangeFullName}
                    />
                    <Modal
                      state={{
                        setIsOpen: setCloseVerificationModal,
                        isOpen: closeVerificationModal,
                      }}
                    >
                      <ModalTrigger>
                        <Button
                          size="sm_medium"
                          disabled={pageData?.is_bvn_verified}
                          className="text-white flex items-center justify-center text-center absolute top-9 right-2 py-2 px-4 h-9"
                        >
                          {pageData?.is_bvn_verified ? "Verified" : "Verify"}
                        </Button>
                      </ModalTrigger>
                      <ModalContent>
                        <NameVerification
                          fullName={fullName}
                          setFullName={setFullName}
                          setCloseVerification={setCloseVerificationModal}
                        />
                      </ModalContent>
                    </Modal>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    label="email"
                    disabled
                    // defaultValue={pageData?.email}
                    value={pageData?.email}
                  />
                  <Select
                    id="gender"
                    label="gender"
                    isSearchable={false}
                    options={genderTypes}
                    inputContainerClassName="bg-neutral-2"
                    defaultValue={pageData?.gender}
                  />
                  <PhoneNumberInput
                    id="phone_number"
                    label="WhatsApp number"
                    required
                    defaultValue={pageData?.phone}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full my-4">
                <TextArea
                  inputSpaceClassName="bg-white dark:bg-darkText-primary"
                  id="about"
                  defaultValue={pageData?.bio}
                  label="About"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                size="base_bold"
                type="submit"
                className="py-[10px] px-8"
                disabled={reqLoading}
              >
                {reqLoading ? "Please ..." : "Update"}
              </Button>
            </div>
          </div>
        </AuthForm>
      </SettingsSection>
    </>
  );
};

export default ManagerProfile;
