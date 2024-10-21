"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Images
import { UploadImageIcon } from "@/public/icons/icons";
import Transparent from "@/public/empty/transparent.png";
import WebsiteTemplate1 from "@/public/website template/template-1.png";
import WebsiteTemplate2 from "@/public/website template/template-2.png";

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
} from "@/components/Settings/settings-components";

import TextArea from "@/components/Form/TextArea/textarea";
import { website_color_schemes } from "@/components/Settings/data";
import { ModalContent } from "@/components/Modal/modal";
import { ModalTrigger } from "@/components/Modal/modal";
import { Modal } from "@/components/Modal/modal";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { rgbToHex } from "@/utils/rgbaToHex";


const Profile = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);


  
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

  return (
    <>
      <SettingsSection title="company profile">
        <div className="custom-flex-col gap-8">
          <div className="grid w-full max-w-[871px] gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              id="company_name"
              label="company name"
              placeholder="Taiwo Salam & Co Properties Ltd"
            />
            <Input
              id="company_mail"
              label="company mail"
              placeholder="ourtenants developer@gmail.com"
            />
            <Input
              id="whatsapp_number"
              label="whatsapp number"
              placeholder="O9129292929"
            />
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
            <Input
              id="head_office_address"
              label="head office address"
              placeholder="U4, Joke Plaza, Bodija, Ibadan"
            />
            <Input
              id="phone_number_1"
              label="phone number 1"
              placeholder="O9129292929"
            />
            <Input
              id="phone_number_2"
              label="phone number 2"
              placeholder="O9129292929"
            />
            <Input
              id="phone_number_3"
              label="phone number 3"
              placeholder="O9129292929"
            />
          </div>
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="company logo"
              desc="Ensure that your company logo has a white background, with a maximum size
      of 2MB. The picture must be between 250 to 400 pixels wide, or ideally
      160px x 160px."
            />
            <div className="flex flex-col md:flex-row gap-4">
              <label
                htmlFor="logo"
                className="relative py-10 w-full md:w-[374px] flex flex-col gap-1 items-center justify-center cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-borders-normal"
              >
                <UploadImageIcon />
                <p className="text-text-secondary text-sm font-normal">
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
      <SettingsSection title="company details">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-5">
            <div className="flex items-center gap-4">
              <Input
                required
                id="company_name"
                label="company name"
                placeholder="Taiwo Salam & Co . Properties Ltd"
                className="w-[500px]"
              />
              <div className="flex pt-7">
                <SettingsVerifiedBadge />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_2fr] gap-5">
              <Input
                id="date_of_registration"
                label="date of registration"
                type="date"
                required
              />
              <Input
                id="cac_registration_number"
                label="cac registration number"
                placeholder="RC43464333"
                required
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Input
                  id="cac_certificate"
                  label="cac certificate"
                  placeholder="Company CAC.pdf"
                  className="w-full sm:w-[300px]"
                />
                <div className="flex pt-2 sm:pt-7">
                  <SettingsVerifiedBadge />
                </div>
              </div>
              <Select
                id="industry"
                label="industry"
                options={industryOptions}
                inputContainerClassName="bg-neutral-2"
              />
              <Input
                id="membership_number"
                label="membership number"
                placeholder="write here"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                <Input
                  id="membership_certificate"
                  label="membership certificate"
                  placeholder="Click the side button to upload cac certificate"
                  className="w-full sm:w-[300px]"
                />
                <Button variant="change" size="xs_normal" className="py-2 px-3 mt-2 sm:mt-0">
                  upload certificate
                </Button>
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
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                id="local_government"
                options={["lga 1", "lga 2"]}
                label="local government"
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                id="city_town"
                options={[]}
                label="city / town"
                inputContainerClassName="bg-neutral-2 w-full"
              />
              <Input
                id="head_office_address"
                label="head office address"
                placeholder="write here"
                className="col-span-1 sm:col-span-2 lg:col-span-3"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 col-span-1 sm:col-span-2 lg:col-span-3">
                <Input
                  id="utility_document"
                  label="utility document"
                  placeholder="Click the side button to upload utility"
                  className="w-full sm:w-[300px]"
                />
                <Button variant="change" size="xs_normal" className="py-2 px-3 w-full sm:w-auto mt-2 sm:mt-0">
                  upload utility
                </Button>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="about company">
        <div className="custom-flex-col gap-8">
          {/* <TextArea id="about company" /> */}
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
      <SettingsSection title="website template">
        <div className="custom-flex-col gap-6">
          <SettingsSectionTitle
            title="choose template"
            desc="https://www.ourlisting.ng/user/324224535"
          />
          <div className="grid grid-cols-3 gap-6 [&>*]:w-full">
            <Image src={WebsiteTemplate1} alt="template" width={500} />
            <Image src={WebsiteTemplate2} alt="template" width={500} />
            <Image src={WebsiteTemplate2} alt="template" width={500} />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="website color settings">
            <div className="custom-flex-col gap-4 mb-7">
              <SettingsSectionTitle
                title="color scheme"
                desc="Customize the default color to your preference from the available options listed below."
              />
              <div className="flex gap-2">
                  <WebsiteColorSchemes
                     websiteColorSchemes={website_color_schemes as unknown as string[]}
                     selectedColor={selectedColor}
                     onColorSelect={handleColorSelect}
                  />
              </div>
            </div>
            <div className="flex flex-col gap-7">
            <SettingsSectionTitle desc="Specify a color code or select a color that best represents your brand website. You can also incorporate additional color designs based on your preferences." />
            <div className="flex items-center gap-2">
            {customColor && !modalOpen && (
            <div
              className={`h-[40px] w-[40px] my-2 rounded-md text-base border border-gray-300 flex items-center justify-center cursor-pointer relative`}
              style={{ backgroundColor: customColor }}>
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
              }}>
              <ModalTrigger
                className='w-10 h-10 rounded-lg border border-dashed border-borders-normal flex items-center justify-center'
              >
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
