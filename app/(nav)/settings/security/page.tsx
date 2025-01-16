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
import { FormState, updateUserProfile } from "./data";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import SettingsSignature from "@/components/Settings/settings-signature";
import SettingsBank from "@/components/Settings/settings-bank";

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
      name: data.get("name"),
      title: data.get("title"),
      picture: data.get("picture"),
    };

    try {
      setReqLoading(true);
      const res = await updateUserProfile(objectToFormData(payload));
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
                <div className="flex flex-col lg:flex-row gap-5">
                  <Select
                    id="personal_title"
                    name="title"
                    options={titles}
                    label="personal title"
                    inputContainerClassName="w-[277px] bg-neutral-2"
                    defaultValue={title as string}
                  />
                  <Input
                    id="fullname"
                    name="name"
                    label="full name"
                    placeholder="Write Here"
                    className="w-[277px]"
                    defaultValue={name}
                  />
                </div>
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
      </SettingsSection>
      <SettingsSignature />
      <SettingsWalletSection />
      <SettingsPasswordSection />
      <SettingsBank />
      <SettingsSection title="Customized SMS name">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch.  replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
          <div className="flex gap-5">
            <Input
              id="desired_name"
              label="input desired name"
              className="w-[277px]"
              maxLength={11}
            />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="SMTP Settings">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Set up email alias"
            desc="Choose how you intend to utilize your SMTP: for private and business correspondence, updates, notifications, mobile messages, transactional messages, marketing communications, or other purposes. This feature enables you to utilize your own domain email address to send messages to your users."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input id="email" label="email address" className="w-full" />
            <Input id="password" label="password" className="w-full" />
            <Input id="smtp_server" label="SMTP Server" className="w-full" />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Security;
