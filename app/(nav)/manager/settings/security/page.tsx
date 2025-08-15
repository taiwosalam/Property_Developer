"use client";

import React, { useEffect, useState } from "react";

// Images
import SignatureImage from "@/public/accounting/signature.svg";

// Imports
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsPasswordSection from "@/components/Settings/settings-password-section";
import SettingsWalletSection from "@/components/Settings/settings-wallet-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { FormState, updateUserProfile } from "./data";
import { toast } from "sonner";
import ManagerProfile from "@/components/Settings/settingsBranchManager";
import BranchBankSettings from "@/components/Settings/branch-bank";
import { updateBranch } from "@/app/(nav)/management/staff-branch/[branchId]/edit-branch/data";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SingleBranchResponseType } from "@/app/(nav)/management/staff-branch/[branchId]/types";
import { transformSingleBranchAPIResponseToEditBranchFormDetails } from "@/app/(nav)/management/staff-branch/[branchId]/data";
import { useRouter } from "next/navigation";
import { useBranchInfoStore } from "@/store/branch-info-store";

const Security = () => {
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const router = useRouter();
  const name = usePersonalInfoStore((state) => state.full_name);
  const title = usePersonalInfoStore((state) => state.title);
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);

  const ManagerWalletPinStatus = branchWallet?.pin_status;
  const ManagerWalletIsActive = branchWallet?.is_active;
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

  // =========== BRANCH BANK DETAILS ==========

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl = BRANCH_ID && BRANCH_ID !== 0 ? `/branch/${BRANCH_ID}` : null;
  const { data, error, loading, refetch } =
    useFetch<SingleBranchResponseType>(fetchUrl);
  useRefetchOnEvent("refectch-branch", () => refetch({ silent: true }));

  const branchData = data
    ? transformSingleBranchAPIResponseToEditBranchFormDetails(data)
    : null;

  // Function to update branch bank details
  const updateBranchBankDetails = async (details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_code: string;
  }) => {
    const branchID = branchData?.id;
    if (!branchID) return toast.error("Cannot Find Branch ID");
    const payload = {
      bank_name: details.bank_name,
      account_name: details.account_name,
      account_number: details.account_number,
      bank_code: details.bank_code,
    };
    try {
      setUpdateRequestLoading(true);
      const status = await updateBranch(
        objectToFormData(payload),
        branchData.id
      );
      if (status) {
        // toast.success("Branch Bank Details Updated Successfully");
        window.dispatchEvent(new Event("refectch-branch"));
        // router.push(`/management/staff-branch/${branchID}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateRequestLoading(false);
    }
  };

  return (
    <>
      <ManagerProfile />
      <SettingsPasswordSection />
      {ManagerWalletPinStatus && <SettingsWalletSection />}
      <BranchBankSettings
        branch_account_name={branchData?.account_name}
        branch_account_number={branchData?.account_number}
        branch_bank_name={branchData?.bank_name}
        action={updateBranchBankDetails}
      />
    </>
  );
};

export default Security;
