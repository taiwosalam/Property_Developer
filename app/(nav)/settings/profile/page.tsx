"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";

// Images
import { UploadImageIcon } from "@/public/icons/icons";
import Transparent from "@/public/empty/transparent.png";
import WebsiteTemplate1 from "@/public/website template/template-1.svg";
import WebsiteTemplate2 from "@/public/website template/template-2.svg";
import WebsiteTemplate3 from "@/public/website template/template-3.svg";

// Imports
import { industryOptions } from "@/data";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";

import {
  CustomColorPicker,
  SettingsColorScheme,
  SettingsSectionTitle,
  SettingsUpdateButton,
  WebsiteColorSchemes,
  SettingsVerifiedBadge,
  SettingsOthersCheckBox,
  ThemeCard,
} from "@/components/Settings/settings-components";

import TextArea from "@/components/Form/TextArea/textarea";
import { website_color_schemes } from "@/components/Settings/data";
import { ModalContent } from "@/components/Modal/modal";
import { ModalTrigger } from "@/components/Modal/modal";
import { Modal } from "@/components/Modal/modal";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { rgbToHex } from "@/utils/rgbaToHex";
import Link from "next/link";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import DateInput from "@/components/Form/DateInput/date-input";
import FileInput from "@/components/Form/FileInput/file-input";
import CompanyMobileNumber from "@/components/Setup/company-mobile-number"; 
import CompanyLogo from "./company-logo";
import CopyText from "@/components/CopyText/copy-text";
import useGoogleFonts from "@/hooks/useFonts";
import Picture from "@/components/Picture/picture";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { companyData, CompanyDataApiResponse, initialPageData, ProfileSettingsApiResponse, ProfileSettingsPageState, transformProfileApiResponse, userData } from "./data";
import NetworkError from "@/components/Error/NetworkError";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useBranchStore from "@/store/branch-store";

const websiteOptions = [
  {
    title: "About Us and Reviews Display",
    desc: "Easily toggle the About Us page on or off in your website menu.",
  },
  {
    title: "Services and Contact Page",
    desc: "Control services and contact page display in your website menu by toggling it on or off.",
  },
  {
    title: "Staffs and Branch Options",
    desc: "Toggle staff and branch pages on or off in your website menu",
  },
  {
    title: "Social Link Visibility",
    desc: "Toggle on or off to display social links or icons in your website menu",
  },
  {
    title: "Sponsored Logo",
    desc: "Toggle to activate or deactivate the sponsored logo. Deactivation requires a monthly fee.",
  },
];

const Profile = () => {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const company_id = usePersonalInfoStore((state) => state.company_id)
  
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

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

  useEffect(() => {
    if (apiData) {
      console.log(apiData);
      const transformedData: ProfileSettingsPageState = transformProfileApiResponse(apiData as CompanyDataApiResponse);
      setState(transformedData);
    }
  }, [apiData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  const { preview, handleImageChange } = useImageUploader({
    placeholder: Transparent,
  });

  const [socialInputs, setSocialInputs] = useState({
    instagram: companyData.instagram || "https://instagram.com/",
    facebook: companyData.facebook || "https://facebook.com/",
    twitter: companyData.x || "https://x.com/",
    linkedin: companyData.linkedin || "https://www.linkedin.com/company/",
    tiktok: companyData.tiktok || "https://tiktok.com/",
    youtube: companyData.youtube || "https://www.youtube.com/@",
  });

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleSocialInputChange = (platform: string, value: string) => {
    setSocialInputs((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelect = (type: string, value: string) => {
    setSelectedTemplate(value);
  };

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
  };

  const googleFonts = useGoogleFonts();

  const handleFontSelect = (fontName: string) => {
    setSelectedFont(fontName);
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      "+"
    )}:wght@400;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };

  const [uploadingUtility, setUploadingUtility] = useState(false);
  const [uploadingMembership, setUploadingMembership] = useState(false);

  const handleUploadUtility = (file: File | null) => {
    console.log(file);
    if (file) {
      setUploadingUtility(true);
    } else {
      setUploadingUtility(false);
    }
  };

  const handleUploadMembership = (file: File | null) => {
    console.log(file);
    if (file) {
      setUploadingMembership(true);
    } else {
      setUploadingMembership(false);
    }
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

   if (isNetworkError) return <NetworkError />;

   if (error)
     return <p className="text-base text-red-500 font-medium">{error}</p>;


  return (
    <>
      <SettingsSection title="company profile and details">
        <div className="custom-flex-col gap-8">
          <div className="">
            <div className="flex w-full items-start gap-4 md:flex-row flex-col">
              <div className="md:w-2/3 w-full gap-1 flex items-end">
                <Input
                  required
                  id="company_name"
                  label="company name"
                  placeholder={companyData.company_name}
                  className="w-full"
                  disabled
                />
                <div className="flex mt-2 sm:mt-0 sm:ml-2">
                  <SettingsVerifiedBadge status="verified" />
                </div>
              </div>
              <div className="md:w-1/3 w-full gap-1 flex items-end">
                <Input
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
                disabled
              />
              <Input
                required
                label="CAC Registration Number"
                id="cac_number"
                placeholder="Write here"
                inputClassName="rounded-[8px] setup-f bg-white"
                value={companyData.cac_registration_number}
                disabled
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                <Input
                  required
                  label="CAC document"
                  id="cac_certificate"
                  placeholder="CAC"
                  inputClassName="rounded-[8px] setup-f bg-white"
                  value={"certificate.pdf"}
                  disabled
                />
                <div className="flex pt-2 sm:pt-7">
                  <SettingsVerifiedBadge status={verifications.cac_status} />
                </div>
              </div>
              <Select
                id="industry"
                label="industry"
                options={industryOptions}
                inputContainerClassName="bg-neutral-2 w-full"
                defaultValue={companyData.industry || ""}
              />
              <Input
                id="membership_number"
                label="membership number"
                placeholder="write here"
                className="w-full"
                defaultValue={companyData.membership_number || ""}
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full">
                <FileInput
                  required
                  id="membership_document"
                  label="Membership document"
                  placeholder=""
                  buttonName="Document"
                  fileType="pdf"
                  size={2}
                  sizeUnit="MB"
                  hiddenInputClassName="setup-f required w-full sm:w-[250px]"
                  settingsPage={true}
                />
                {/* {uploadingMembership && (
                  <button className="w-1/2 sm:w-auto py-2 px-3 mt-2 sm:mt-0 text-brand-9">
                    Verify Document
                  </button>
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
              defaultValue={state.companyData.city}
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-4">
            <Input
              id="head_office_address"
              label="Head Office Address"
              placeholder=""
              className="w-full lg:w-[500px]"
              defaultValue={state.companyData.head_office_address}
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full lg:w-auto">
              <FileInput
                required
                id="utility_document  "
                label="utility document"
                placeholder=""
                buttonName="Document"
                fileType="pdf"
                size={2}
                sizeUnit="MB"
                hiddenInputClassName="setup-f required w-full sm:w-[250px]"
                settingsPage={true}
                // onChange={handleUploadUtility}
              />
              {uploadingUtility && (
                <button className="w-1/2 sm:w-auto py-2 px-3 mt-2 sm:mt-0 text-brand-9  ">
                  Verify Document
                </button>
              )}
            </div>
          </div>
          <CompanyMobileNumber phoneNumbers={state.companyData.phone_number} />
          <CompanyLogo
            lightLogo={state.companyData.company_logo}
            darkLogo={""}
          />
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title="about company and social links">
        <div className="custom-flex-col gap-8">
          <TextArea id="about_company" label="about company" />
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="social medias"
              desc="Add your social media company username to allow clients to check your social page."
            />
            <div className="w-full max-w-[871px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input
                  id="instagram"
                  label="instagram"
                  placeholder="username"
                  value={socialInputs.instagram}
                  onChange={(value) =>
                    handleSocialInputChange("instagram", value)
                  }
                />
                <Input
                  id="facebook"
                  label="facebook"
                  placeholder="username"
                  value={socialInputs.facebook}
                  onChange={(value) =>
                    handleSocialInputChange("facebook", value)
                  }
                />
                <Input
                  id="twitter"
                  label="x (Twitter)"
                  placeholder="username"
                  value={socialInputs.twitter}
                  onChange={(value) =>
                    handleSocialInputChange("twitter", value)
                  }
                />
                <Input
                  id="linkedin"
                  label="linkedIn"
                  placeholder="username"
                  value={socialInputs.linkedin}
                  onChange={(value) =>
                    handleSocialInputChange("linkedin", value)
                  }
                />
                <Input
                  id="tiktok"
                  label="tiktok"
                  placeholder="username"
                  value={socialInputs.tiktok}
                  onChange={(value) => handleSocialInputChange("tiktok", value)}
                />
                <Input
                  id="youtube"
                  label="youtube"
                  placeholder="username"
                  value={socialInputs.youtube}
                  onChange={(value) =>
                    handleSocialInputChange("youtube", value)
                  }
                />
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="website domain and template">
        <h5 className="text-text-disabled text-sm font-normal my-4">
          Select a preferred subdomain to showcase your company profile and
          market your properties listings portfolio to the world.
        </h5>
        <p className="text-text-secondary dark:text-darkText-1 text-md">
          Customize website domain name
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-2 items-start sm:items-center w-full">
          <Input
            id="custom_domain"
            label=""
            placeholder=""
            value={customDomain}
            onChange={(value) => handleCustomDomainChange(value)}
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
          />
          {customDomain && (
            <CopyText
              text={`https://www.${customDomain}.ourlisting.ng`}
              className="text-brand-9 text-xs sm:text-sm text-center break-all"
            />
          )}
          {!customDomain && (
            <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
              {`https://www.${customDomain}.ourlisting.ng`}
            </p>
          )}
          {customDomain && (
            <div className="status bg-green-500 text-white px-2 py-1 rounded-md text-xs">
              Available
            </div>
          )}
        </div>

        <div className="rssFeed flex flex-col gap-1 mb-4">
          <h4 className="text-text-secondary dark:text-darkText-1 text-md font-normal">
            RSS Feed Link for Listings
          </h4>
          <CopyText
            text="https://www.ourlisting.ng/user/324224535"
            className="text-brand-9 text-xs underline sm:text-sm"
          />
        </div>
        <div className="custom-flex-col gap-6">
          <SettingsSectionTitle
            title="choose template"
            desc="Choose how your website will be presented to your customers and clients."
          />
          <div className="flex flex-wrap gap-6 items-start justify-start">
            <ThemeCard
              img={WebsiteTemplate1}
              value="template1"
              onSelect={(value) => handleSelect("template1", value)}
              isSelected={selectedTemplate === "template1"}
              profile={true}
            />
            <ThemeCard
              img={WebsiteTemplate2}
              value="template2"
              onSelect={(value) => handleSelect("template2", value)}
              isSelected={selectedTemplate === "template2"}
              profile={true}
            />
            <ThemeCard
              img={WebsiteTemplate3}
              value="template3"
              onSelect={(value) => handleSelect("template3", value)}
              isSelected={selectedTemplate === "template3"}
              profile={true}
            />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="website color settings">
        <SettingsSectionTitle
          title="Fonts Templates"
          desc="Choose Your Preferred Font Style for Your Company Profile Website"
        />
        <div className="flex w-full items-start lg:items-center lg:flex-row flex-col gap-2 mb-4">
          <Select
            id="font"
            label=""
            placeholder="Select a font"
            onChange={(value) => handleFontSelect(value)}
            options={googleFonts}
            inputContainerClassName="bg-neutral-2 w-full mt-2 lg:min-w-[300px]"
          />
          <p
            className="font text-sm text-brand-9"
            style={{ fontFamily: selectedFont || googleFonts[0] }}
          >
            Your website will display a default font initially, but selecting
            your preferred font will update all text on your website to match
            the chosen style.
          </p>
        </div>

        {/* MODULES SETTINGS */}
        <div className="modules-list mb-5">
          <SettingsOthersCheckBox
            title="Modules Listing"
            desc="Toggle on or off to control the visibility of your listing on the website, based on your subscription plan."
            checked={checkedStates["Modules Listing"] ?? true} // Updated to use the state
            value="Modules Listing"
            onChange={(value, checked) => {
              // console.log(`Option "${value}" changed to: ${checked}`);
              setCheckedStates((prev) => ({
                ...prev,
                ["Modules Listing"]: checked,
              }));
            }}
          />
        </div>
        <div className="checks mb-5 flex flex-col gap-2">
          <DocumentCheckbox
            title="Properties For Rent"
            darkText={false}
            checked={true}
          >
            {""}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Sale"
            darkText={false}
            checked={false}
          >
            {""}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Short Let"
            darkText={false}
            checked={false}
          >
            {""}
          </DocumentCheckbox>
        </div>

        {/* WEBSITE PAGE OPTIONS SETTINGS */}
        <div className="toggles flex flex-col gap-5 mb-7">
          {websiteOptions.map((option, index) => (
            <SettingsOthersCheckBox
              key={index}
              title={option.title}
              desc={option.desc}
              checked={checkedStates[option.title] ?? true}
              value={option.title}
              onChange={(value, checked) => {
                // console.log(`Option "${value}" changed to: ${checked}`);
                setCheckedStates((prev) => ({
                  ...prev,
                  [option.title]: checked,
                }));
              }}
            />
          ))}
        </div>

        {/* WEBSITE COLORS SETTINGS  */}
        <div className="custom-flex-col">
          <SettingsSectionTitle
            title="color scheme"
            desc="Customize the default color to your preference from the available options listed below."
          />
          <div className="flex gap-4">
            <WebsiteColorSchemes
              websiteColorSchemes={website_color_schemes as unknown as string[]}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <SettingsSectionTitle desc="Specify a color code or select a color that best represents your brand website. You can also incorporate additional color designs based on your preferences." />
          <div className="flex items-center gap-2">
            {customColor && !modalOpen && (
              <div
                className={`h-[40px] w-[40px] my-2 rounded-md text-base border border-gray-300 flex items-center justify-center cursor-pointer relative`}
                style={{ backgroundColor: customColor }}
              >
                {selectedColor === customColor && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Picture
                      src="/icons/whitemark.svg"
                      alt="Selected"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            )}
            <Modal
              state={{
                isOpen: modalOpen,
                setIsOpen: setModalOpen,
              }}
            >
              <ModalTrigger className="w-10 h-10 rounded-lg border border-dashed border-borders-normal flex items-center justify-center">
                +
              </ModalTrigger>
              <ModalContent>
                <CustomColorPicker
                  color={customColor}
                  onChange={handleCustomColorChange}
                  setModalOpen={setModalOpen}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
    </>
  );
};

export default Profile;
