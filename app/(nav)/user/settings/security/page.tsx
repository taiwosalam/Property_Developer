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
      <SettingsSection title="Change Wallet Pin">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Change Pin"
            desc="Use this section to reset your wallet pin."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3 gap-5">
            <Input id="email" label="Current Pin" className="w-full" />
            <Input id="password" label="New Pin" className="w-full" />
            <Input
              id="smtp_server"
              label="Re-enter New Pin"
              className="w-full"
            />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      <SettingsSection title="Change Email">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Change Email"
            desc="Use this section to change your email."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3 gap-5">
            <Input id="email" label="Current Email" className="w-full" />
            <Input id="password" label="New Email" className="w-full" />
            <Input
              id="smtp_server"
              label="Re-enter New Email"
              className="w-full"
            />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      <SettingsSection title="Link BVN">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="BVN"
            desc="Your BVN is linked solely for account verification purposes. We do not have access to any of your personal details; it is used only to confirm the authenticity of your name and facilitate the withdrawal of funds from your wallet to your bank account."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3 gap-5">
            <Input id="email" className="w-full" />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      <SettingsSection title="Signature">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Authorize Signature "
            desc="This will be attached to all electronic documents issued to you or by you. You are required to sign on a plain white sheet of paper, take a clear photo of the signed area, and upload it. For better quality, you may remove the background if possible."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3 gap-5">
            <Input id="email" className="w-full" />
          </div>

          {/* need the add image component */}
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Security;
