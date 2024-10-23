"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Images
import { UploadImageIcon } from "@/public/icons/icons";
import Transparent from "@/public/empty/transparent.png";
import WebsiteTemplate1 from "@/public/website template/template-1.svg";
import WebsiteTemplate2 from "@/public/website template/template-2.svg";
import WebsiteTemplate3 from "@/public/website template/template-3.svg";

// Imports
import { industryOptions } from "@/data";
import { getAllStates } from "@/utils/states";
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
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  const { preview, handleImageChange } = useImageUploader({
    placeholder: Transparent,
  });

  const [socialInputs, setSocialInputs] = useState({
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
  });

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
    console.log("selected color = ", color);
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

  const handleSelect = (type: string,value: string)=> {
    setSelectedTemplate(value)
  }
  
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
                  placeholder="Taiwo Salam & Co. Properties Ltd"
                  className="w-full"
                />
                <div className="flex mt-2 sm:mt-0 sm:ml-2">
                  <SettingsVerifiedBadge />
                </div>
              </div>
              <div className="md:w-1/3 w-full gap-1 flex items-end">
                <Input
                  id="company_mail"
                  label="company mail"
                  placeholder="ourtenants developer@gmail.com"
                  className="w-full"
                />
                <div className="flex mt-2 sm:mt-0 sm:ml-2">
                  <SettingsVerifiedBadge />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full items-center justify-between">
              <Input
                id="date_of_registration"
                label="date of registration"
                type="date"
                required
                className="w-full"
              />
              <Input
                id="cac_registration_number"
                label="cac registration number"
                placeholder="RC43464333"
                required
                className="w-full"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                <Input
                  id="cac_document"
                  label="cac document"
                  placeholder="Company CAC.pdf"
                  className="w-full"
                />
                <div className="flex pt-2 sm:pt-7">
                  <SettingsVerifiedBadge />
                </div>
              </div>
              <Select
                id="industry"
                label="industry"
                options={industryOptions}
                inputContainerClassName="bg-neutral-2 w-full"
              />
              <Input
                id="membership_number"
                label="membership number"
                placeholder="write here"
                className="w-full"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full">
                <Input
                  id="membership_document"
                  label="membership document"
                  placeholder="Click the side button to upload cac certificate"
                  className="w-full"
                />
                <Button
                  variant="change"
                  size="xs_normal"
                  className="py-2 px-3 mt-2 sm:mt-0 whitespace-nowrap"
                >
                  verify utility
                </Button>
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
              placeholder="Select options"
              inputContainerClassName="bg-neutral-2"
            />
            <Select
              id="local_government"
              options={["lga 1", "lga 2"]}
              label="local government"
              placeholder="Select options"
              inputContainerClassName="bg-neutral-2"
            />
            <Select
              id="city_town"
              options={["City", "Town"]}
              label="City/Town"
              placeholder="Select options"
              inputContainerClassName="bg-neutral-2"
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-4">
            <Input
              id="head_office_address"
              label="head office address"
              placeholder="U4, Joke Plaza, Bodija, Ibadan"
              className="w-full lg:w-[500px]"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full lg:w-auto">
              <Input
                id="utility_document"
                label="Utility Document"
                placeholder="Click the side button to upload cac certificate"
                className="w-full sm:w-[300px]"
              />
              <Button
                variant="change"
                size="xs_normal"
                className="w-full sm:w-auto py-2 px-3 mt-2 sm:mt-0"
              >
                upload utility
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Input
              id="whatsapp_number"
              label="WhatsApp Number 1"
              placeholder="O9129292929"
              className="w-full"
            />
            <Input
              id="company_number_2"
              label="Company Number 2"
              placeholder="O9129292929"
              className="w-full"
            />
            <Input
              id="company_number_3"
              label="Company Number 3"
              placeholder="O9129292929"
              className="w-full"
            />
            <Input
              id="company_number_4"
              label="Company Number 4"
              placeholder="O9129292929"
              className="w-full"
            />
          </div>
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="company logo"
              desc="Ensure that your company logo has a white background, with a maximum size of 2MB. The picture must be between 250 to 400 pixels wide, or ideally 160px x 160px."
            />
            <div className="flex flex-col lg:flex-row gap-4">
              <label
                htmlFor="logo"
                className="relative py-10 w-full md:w-[374px] flex flex-col gap-1 items-center justify-center cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-borders-normal"
              >
                <UploadImageIcon />
                <p className="text-text-secondary dark:text-white text-sm font-normal">
                  Upload your logo here
                </p>
                <div className="absolute inset-0">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 374px"
                    className="object-cover"
                  />
                </div>
                <input
                  id="logo"
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden pointer-events-none"
                />
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                <Button size="sm_normal" className="py-2 px-3 w-full md:w-auto">
                  change logo
                </Button>
                <Button
                  variant="light_red"
                  size="sm_normal"
                  className="py-2 px-3 w-full md:w-auto"
                >
                  remove logo
                </Button>
              </div>
            </div>
            <SettingsUpdateButton />
          </div>
        </div>
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
            placeholder="makinwauxdesigner"
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
          />
          <Link href="#" className="text-brand-9 text-xs sm:text-sm text-center break-all">
            https://www.makinwauxdesgner.ourlisting.ng
          </Link>
        </div>

        <div className="rssFeed flex flex-col gap-1 mb-4">
          <h4 className="text-text-secondary dark:text-darkText-1 text-md font-normal">
            RSS Feed Link for Listings
          </h4>
          <Link href="#" className="text-brand-9 text-xs underline sm:text-sm">
            https://www.makinwauxdesgner.ourlisting.ng
          </Link>
        </div>
        <div className="custom-flex-col gap-6">
          <SettingsSectionTitle
            title="choose template"
            desc="Choose how your website will be presented to your customers and clients."
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <ThemeCard
                img={WebsiteTemplate1}
                value="template1"
                onSelect={(value) => handleSelect("template1", value)}
                isSelected={selectedTemplate === "template1"}
                profile={true}
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <ThemeCard
                img={WebsiteTemplate2}
                value="template2"
                onSelect={(value) => handleSelect("template2", value)}
                isSelected={selectedTemplate === "template2"}
                profile={true}
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <ThemeCard
                img={WebsiteTemplate3}
                value="template3"
                onSelect={(value) => handleSelect("template3", value)}
                isSelected={selectedTemplate === "template3"}
                profile={true}
              />
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="website color settings">
        <SettingsSectionTitle
          title="Fonts Templates"
          desc="Choose Your Preferred Font Style for Your Company Profile Website"
        />
        <div className="w-full sm:w-1/4 flex mb-5">
          <Select
            id="font"
            label=""
            placeholder="Times New Roman"
            options={["Font 1", "Font 2"]}
            inputContainerClassName="bg-neutral-2 w-full mt-2"
          />
        </div>

        {/* MODULES SETTINGS */}
        <div className="modules-list mb-5">
          <SettingsOthersCheckBox
            title="Modules Listing"
            desc="Toggle on or off to control the visibility of your listing on the website, based on your subscription plan."
            checked={checkedStates["Modules Listing"] ?? false} // Updated to use the state
            value="Modules Listing"
            onChange={(value, checked) => {
              console.log(`Option "${value}" changed to: ${checked}`);
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
           {''}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Sale"
            darkText={false}
            checked={false}>
              {''}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Short Let"
            darkText={false}
            checked={false}>
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
                console.log(`Option "${value}" changed to: ${checked}`);
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
                    <img
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
                  onClose={() => {
                    setCustomColor(customColor);
                    setModalOpen(false);
                  }}
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
