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
import { cleanPhoneNumber, objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { FormState, updateDirectorProfile, updateUserProfile } from "./data";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import SettingsSignature from "@/components/Settings/settings-signature";
import SettingsBank from "@/components/Settings/settings-bank";
import SettingsSmtp from "@/components/Settings/settings-smtp";
import SettingsSMS from "@/components/Settings/settings-sms";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import TextArea from "@/components/Form/TextArea/textarea";

const Security = () => {
  const name = usePersonalInfoStore((state) => state.full_name);
  const title = usePersonalInfoStore((state) => state.title);
  const { preview, inputFileRef, handleImageChange } = useImageUploader();

  const [inputFields, setInputFields] = useState([
    { id: Date.now(), signature: SignatureImage },
  ]);
  const profile_picture = usePersonalInfoStore(
    (state) => state.profile_picture
  );
  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: name || "",
    title: title || "",
  });

  const setUpdateState = (fieldName: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [fieldName]: value }));
  };

  const changeImage = () => {
    inputFileRef?.current?.click();
  };

  const handleUpdateProfile = async (data: FormData) => {
    const payload = {
      full_name: data.get("fullname"),
      personal_title: data.get("personal_title"),
      profile_picture: data.get("picture"),
      years_in_business: data.get("director_experience"),
      about_director: data.get("about_director"),
      phone_number: data.get("phone"),
      email: data.get("director_email"),
    };

    try {
      setReqLoading(true);
      const res = await updateDirectorProfile(objectToFormData(payload));
      if (res && 'status' in res && res.status === 200) {
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
        <AuthForm onFormSubmit={handleUpdateProfile} skipValidation returnType="form-data">
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle
                title="Director Display Picture"
                desc="The profile photo size should be 180 x 180 pixels with a maximum file size of 2MB."
              />
              <div className="custom-flex-col gap-[18px]">
                <ProfileUpload
                  preview={preview || profile_picture || ""}
                  onChange={handleImageChange}
                  inputFileRef={inputFileRef}
                  onClick={changeImage}
                />
               <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <Select
                    id="personal_title"
                    name="title"
                    options={titles}
                    label="personal title"
                    inputContainerClassName="bg-neutral-2"
                    defaultValue={title as string}
                  />
                  <Input
                    id="fullname"
                    name="name"
                    label="full name"
                    placeholder="Write Here"
                    defaultValue={name}
                  />
                  <Select
                    id="director_experience"
                    label="years in business"
                    placeholder="Write here"
                    options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
                    hiddenInputClassName="setup-f"
                  />
                  <Input
                    id="director_email"
                    label="email"
                    type="email"
                    placeholder="example@mail.com"
                    inputClassName="rounded-[8px] setup-f bg-white"
                  />
                  <PhoneNumberInput
                    id="phone"
                    label="phone number"
                    placeholder="800 0000 000"
                    inputClassName="setup-f"
                  />
                </div>
                <TextArea
                  id="about_director"
                  label="About Director"
                  placeholder="Write about the director"
                  hiddenInputClassName="setup-f"
                />
              </div>
            </div>
            <SettingsUpdateButton
              submit
              loading={reqLoading}
              action={handleUpdateProfile as any}
              next={next}
            />
          </div>
        </AuthForm>
      </SettingsSection >
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
