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
    inputFileRef.current?.click();
  };

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      { id: Date.now(), signature: SignatureImage },
    ]);
  };

  const removeInputField = (id: number) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
    console.log("Input Fields after removing:", updatedFields);
  };

  const changeSignatureImage = (index: number) => {
    document.getElementById(`signature_input_${index}`)?.click();
  };

  const handleSignatureChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const newSignature = URL.createObjectURL(e.target.files[0]);
        setInputFields(
          inputFields.map((inputField) =>
            inputField.id === inputFields[index].id
              ? { ...inputField, signature: newSignature }
              : inputField
          )
        );
      }
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
      <SettingsSection title="Bank Details">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Bank Account Withdrawal Details"
            desc="The registered name must match your bank details, and you can only link one bank to your account."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
            <Select
              id="bank_name"
              label="bank name"
              options={["sterling bank"]}
              inputContainerClassName="w-full bg-neutral-2"
            />
            <Input
              id="account_number"
              label="account number"
              className="w-full"
            />
            <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-success-1">
              <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-status-success-primary">
                <Check size={10} color="white" />
              </div>
              <p className="text-status-success-primary text-xs font-normal capitalize truncate">
                David Adekunle Ajala
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="custom-flex-col max-w-[436px]  gap-4">
              <FundingCard
                type="sterling"
                title="0068190063"
                desc="David Ajala"
                cta="Sterling Bank"
                notRounded
              />
              <div className="flex items-center gap-2">
                <Picture src={DangerIcon} alt="danger" size={24} />
                <p className="text-text-label text-xs font-normal">
                  You can only update or modify your bank details after 7 days,
                  and they must match your verified name.
                </p>
              </div>
            </div>
          </div>
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
      <SettingsSection title="Customized SMS name">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch.  replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
          <div className="flex gap-5">
            <Input
              id="desired_name"
              label="input desired name"
              className="w-[277px]"
            />
          </div>
          <SettingsUpdateButton type="otp" />
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
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
    </>
  );
};

export default Security;
