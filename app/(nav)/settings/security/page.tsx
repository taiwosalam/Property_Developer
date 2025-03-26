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

const Security = () => {
  const name = usePersonalInfoStore((state) => state.full_name);
  const title = usePersonalInfoStore((state) => state.title);
  const { preview, inputFileRef, handleImageChange } = useImageUploader();
  const [pageData, setPageData] = useState<InitialDataTypes>(initialData);

  const yearsOptions = Array.from({ length: 10 }, (_, i) => {
    const yearValue = i + 1;
    return { label: `${yearValue} years +`, value: `${yearValue}+` };
  });

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

  const { data, loading, error } = useFetch("/user/full-profile");
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
  };

  const handleUpdateProfile = async (data: FormData) => {
    const payload = {
      full_name: data.get("fullname"),
      personal_title: data.get("personal_title"),
      profile_picture: data.get("picture"),
      // years_in_business: data.get("director_experience"),
      about_director: data.get("about_director"),
      phone_number: data.get("phone"),
      email: data.get("director_email"),
    };

    try {
      setReqLoading(true);
      const res = await updateDirectorProfile(objectToFormData(payload));
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
                    defaultValue={pageData?.personal_title}
                  />
                  
                  <Select
                    id="professional_title"
                    name="professional_title"
                    options={titles}
                    label="professional title"
                    inputContainerClassName="bg-neutral-2"
                    // defaultValue={pageData?.personal_title}
                  />

                  <Input
                    id="fullname"
                    name="name"
                    label="full name"
                    placeholder="Write Here"
                    defaultValue={pageData?.fullname}
                  />

                  <Input
                    id="director_email"
                    label="email"
                    type="email"
                    placeholder="write here"
                    inputClassName="rounded-[8px] setup-f bg-white"
                    defaultValue={pageData?.email}
                  />

                   <Select
                    id="experience"
                    label="years of experience"
                    placeholder="Write here"
                    options={yearsOptions}
                    hiddenInputClassName="setup-f"
                    // defaultValue={year}
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
              next={next}
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
