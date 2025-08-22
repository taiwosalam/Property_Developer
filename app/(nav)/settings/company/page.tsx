"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

// Images
import Transparent from "@/public/empty/transparent.png";
// Imports
import { industryOptions } from "@/data";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
  SettingsVerifiedBadge,
} from "@/components/Settings/settings-components";
import DateInput from "@/components/Form/DateInput/date-input";
import FileInput from "@/components/Form/FileInput/file-input";
import CompanyMobileNumber from "@/components/Setup/company-mobile-number";
import CompanyLogo from "./company-logo";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  cleanStringtoArray,
  companyData,
  CompanyDataApiResponse,
  initialPageData,
  ProfileSettingsPageState,
  safeParse,
  transformFormCompanyData,
  transformProfileApiResponse,
  updateCompanyDetails,
  userData,
} from "./data";
import NetworkError from "@/components/Error/NetworkError";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import CompanySocials from "@/components/Settings/settings-company-social";
import SettingsWebsiteDomain from "@/components/Settings/settings-website-domain";
import WebsiteColor from "@/components/Settings/website-color";
import { AuthForm } from "@/components/Auth/auth-components";
import { toast } from "sonner";
import WebsitePages from "@/components/Settings/website-pages";
import WebsiteTypography from "@/components/Settings/website-custom-typography";
import Button from "@/components/Form/Button/button";
import { StaticImageData } from "next/image";
import clsx from "clsx";
import { usePermission } from "@/hooks/getPermission";
import { useRole } from "@/hooks/roleContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const [requestLoading, setRequestLoading] = useState(false);
  const { role, setRole } = useRole();
  const router = useRouter();

  // PERMISSIONS TO RENDER COMPONENTS
  // 💀😈👿 BE CAREFUL NOT TO SPOIL THE BELOW PERMISSIONS 💀😈👿
  const IS_COMPANY_OWNER = usePersonalInfoStore((state) => state.is_owner);
  const canViewThisPage =
    usePermission("director", "Change Company Module") || IS_COMPANY_OWNER;
  // 💀😈👿 BE CAREFUL NOT TO SPOIL THE BELOW PERMISSIONS 💀😈👿

  // Redirect if user doesn't have permission
  useEffect(() => {
    console.log("canViewThisPage", canViewThisPage);
    if (!canViewThisPage) {
      router.push("/settings/security");
    }
  }, [canViewThisPage]);

  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  //
  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });

  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

  const [state, setState] = useState<ProfileSettingsPageState>(initialPageData);

  const { verifications, companyData, directorsData } = state;

  // FETCH API DATA
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch(`/companies/${company_id}`);
  useRefetchOnEvent("refetchProfile", () => refetch({ silent: true }));

  const [companyLogo, setCompanyLogo] = useState<{
    light: string | StaticImageData | null;
    dark: string | StaticImageData | null;
  }>({
    light: state.companyData.company_logo,
    dark: state.companyData?.dark_logo,
  });

  useEffect(() => {
    if (apiData) {
      const transformedData: ProfileSettingsPageState =
        transformProfileApiResponse(apiData as CompanyDataApiResponse);
      setState(transformedData);
    }
  }, [apiData]);

  useEffect(() => {
    if (state) {
      setCompanyLogo({
        light: state.companyData.company_logo,
        dark: state.companyData.dark_logo,
      });
    }
  }, [state]);

  //
  const { preview, handleImageChange } = useImageUploader({
    placeholder: Transparent,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [uploadingUtility, setUploadingUtility] = useState(false);
  const [uploadingMembership, setUploadingMembership] = useState(false);

  const handleUploadUtility = (file: File | null) => {
    if (file) {
      setUploadingUtility(true);
    } else {
      setUploadingUtility(false);
    }
  };

  const handleUploadMembership = (file: File | null) => {
    if (file) {
      setUploadingMembership(true);
    } else {
      setUploadingMembership(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isNetworkError) return <NetworkError />;

  //  if (error)
  //    return <p className="text-base text-red-500 font-medium">{error}</p>;
  const handleSubmit = async (formData: FormData) => {
    setRequestLoading(true);
    const data = transformFormCompanyData(formData);

    try {
      const res = await updateCompanyDetails(data, company_id as string);
      if (res) toast.success("Company Details Updated Successfully");
    } catch (err) {
      toast.error("Failed to Update Company Details");
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <>
      <SettingsSection title="profile & details">
        <AuthForm
          skipValidation
          onFormSubmit={handleSubmit}
          returnType="form-data"
        >
          <div className="custom-flex-col  gap-8">
            <div className="">
              <div className="flex w-full items-start gap-4 md:flex-row flex-col">
                <div className="flex-1 w-full gap-1 flex items-end">
                  <Input
                    required
                    id="company_name"
                    label="company name"
                    placeholder={companyData.company_name}
                    className="w-full"
                    value={companyData?.company_name}
                    disabled
                  />
                  <div className="flex mt-2 sm:mt-0 sm:ml-2">
                    <SettingsVerifiedBadge status="verified" />
                  </div>
                </div>
                <div className="flex-1 w-full gap-1 flex items-end">
                  <Input
                    className="w-full"
                    required
                    label="company mail"
                    id="company_mail"
                    placeholder="ourtenantsdeveloper@gmail.com"
                    inputClassName="rounded-[8px] bg-white w-full"
                    value={companyData.email}
                    disabled
                  />
                  <div className="flex mt-2 sm:mt-0 sm:ml-2">
                    <SettingsVerifiedBadge status="verified" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full items-center justify-between">
                <DateInput
                  required
                  id="cac_date"
                  label="date of registration"
                  value={dayjs(companyData.date_of_registration)}
                  onChange={() => {}}
                  disabled={verifications.cac_status === "verified"}
                />
                <Input
                  required
                  label="CAC Registration Number"
                  id="cac_number"
                  placeholder="Write here"
                  inputClassName="rounded-[8px] setup-f bg-white"
                  value={companyData.cac_registration_number}
                  disabled={verifications.cac_status === "verified"}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                  <FileInput
                    className="w-[350px]"
                    required
                    id="cac_certificate"
                    label="CAC document"
                    placeholder=""
                    noUpload={verifications.cac_status === "verified"}
                    buttonName="Document"
                    fileType="pdf"
                    size={2}
                    sizeUnit="MB"
                    hiddenInputClassName="setup-f required w-full sm:w-[250px]"
                    settingsPage={true}
                    defaultValue={companyData.cac_certificate}
                  />
                  <div className="flex pt-2 sm:pt-7">
                    <SettingsVerifiedBadge
                      status={
                        verifications.cac_status === "unverified"
                          ? "pending"
                          : "verified"
                      }
                    />
                  </div>
                </div>
                <Select
                  id="industry"
                  label="industry"
                  options={industryOptions}
                  disabled={
                    verifications.membership_status === "verified" ||
                    verifications.membership_status === "approved"
                  }
                  inputContainerClassName="bg-neutral-2 w-full"
                  defaultValue={companyData.industry || ""}
                />
                <Input
                  id="membership_number"
                  label="membership number"
                  placeholder="write here"
                  className="w-full"
                  disabled={
                    verifications.membership_status === "verified" ||
                    verifications.membership_status === "approved"
                  }
                  defaultValue={companyData.membership_number || ""}
                />
<<<<<<< HEAD
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full">
=======
                <div className="flex  flex-col sm:flex-row items-start sm:items-end gap-3 w-full">
>>>>>>> upstream/main
                  <FileInput
                    required
                    noUpload={
                      verifications.membership_status === "verified" ||
                      verifications.membership_status === "approved"
                    }
                    className="w-[450px]"
                    id="membership_certificate"
                    label="Membership document"
                    placeholder="Upload Membership File"
                    buttonName="Document"
                    fileType="pdf"
                    size={2}
                    sizeUnit="MB"
                    hiddenInputClassName="setup-f required w-full sm:w-[250px]"
                    settingsPage={true}
                    defaultValue={companyData.membership_certificate}
                    membership_status={verifications.membership_status}
                  />
                  {/* {companyData.membership_certificate && (
                    <div className="flex pt-2 sm:pt-7">
                      <SettingsVerifiedBadge
                        status={verifications.membership_status}
                      />
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <SettingsSectionTitle
              title="company address"
              desc="Provide your complete head office address for the verification process. Please select your state, local government area, city, and upload a utility bill that is no older than 3 months."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Select
                options={getAllStates()}
                id="state"
                label="state"
                value={address.state}
                hiddenInputClassName="setup-f"
                defaultValue={state.companyData.state}
                onChange={(value) => handleAddressChange("state", value)} // Update handler
                required
                disabled={verifications?.utility_status === "verified"}
              />

              {/* Local Government Selector */}
              <Select
                options={getLocalGovernments(address.state)}
                id="local_government"
                label="local government"
                hiddenInputClassName="setup-f"
                onChange={(value) => handleAddressChange("lga", value)} // Update handler
                value={address.lga} // Controlled value
                required
                disabled={verifications?.utility_status === "verified"}
                defaultValue={state.companyData.local_government}
              />

              {/* City Selector */}
              <Select
                options={getCities(address.state, address.lga)}
                id="city"
                label="City / Area"
                allowCustom={true}
                hiddenInputClassName="setup-f"
                onChange={(value) => handleAddressChange("city", value)} // Update handler
                value={address.city} // Controlled value
                required
                disabled={verifications?.utility_status === "verified"}
                defaultValue={state.companyData.city}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-4">
              <Input
                id="head_office_address"
                label="Street/Office Number"
                placeholder=""
                disabled={verifications?.utility_status === "verified"}
                className="w-full lg:w-[500px]"
                defaultValue={state.companyData.head_office_address}
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full lg:w-auto">
                <FileInput
                  required
                  className="w-[450px]"
                  noUpload={verifications?.utility_status === "verified"}
                  id="utility_document"
                  label="utility document"
                  placeholder="Upload Utility File"
                  buttonName="Document"
                  fileType="pdf"
                  size={2}
                  sizeUnit="MB"
                  hiddenInputClassName="setup-f required w-full sm:w-[250px]"
                  settingsPage={true}
                  defaultValue={companyData.utility_document}
                  membership_status={
                    verifications.utility_status === "unverified"
                      ? "pending"
                      : "verified"
                  }
                  // onChange={handleUploadUtility}
                />
              </div>
            </div>
            <CompanyMobileNumber
              phoneNumbers={safeParse<string[]>(
                state.companyData.phone_number as string,
                []
              )}
            />
            <CompanyLogo
              lightLogo={companyLogo.light}
              darkLogo={companyLogo.dark}
              onChangeLogo={setCompanyLogo}
            />
          </div>
          <div className="flex self-end mt-4 justify-end w-full">
            <Button
              disabled={requestLoading}
              type="submit"
              className="px-8 py-2"
              size="base_medium"
            >
              {requestLoading ? "Please wait..." : "Update"}
            </Button>
          </div>
        </AuthForm>
      </SettingsSection>
      <CompanySocials companyData={companyData} />
      <SettingsWebsiteDomain />
      <WebsitePages />
      {/* <WebsiteColor /> */}
      <WebsiteTypography />
    </>
  );
};

export default Profile;
