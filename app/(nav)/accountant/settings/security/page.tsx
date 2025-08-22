"use client";

import React, { useEffect, useState } from "react";

// Images
import SignatureImage from "@/public/accounting/signature.svg";

// Imports
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsPasswordSection from "@/components/Settings/settings-password-section";

import { usePersonalInfoStore } from "@/store/personal-info-store";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { FormState, updateUserProfile } from "./data";
import { toast } from "sonner";
import ManagerProfile from "@/components/Settings/settingsBranchManager";

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
      <ManagerProfile />
      <SettingsPasswordSection />
    </>
  );
};

export default Security;
