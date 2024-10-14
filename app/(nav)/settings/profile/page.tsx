"use client";

import React from "react";
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
  SettingsColorScheme,
  SettingsSectionTitle,
  SettingsUpdateButton,
  SettingsVerifiedBadge,
} from "@/components/Settings/settings-components";

import TextArea from "@/components/Form/TextArea/textarea";
import { website_color_schemes } from "@/components/Settings/data";

const Profile = () => {
  const { preview, handleImageChange } = useImageUploader({
    placeholder: Transparent,
  });

  return (
    <>
      <SettingsSection title="company profile">
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="w-full max-w-[871px] grid grid-cols-3 gap-5">
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
          </div>
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="company logo"
              desc="Ensure that your company logo has a white background, with a maximum size
      of 2MB. The picture must be between 250 to 400 pixels wide, or ideally
      160px x 160px."
            />
            <div className="flex gap-2">
              <label
                htmlFor="logo"
                className="relative py-10 w-[374px] flex flex-col gap-1 items-center justify-center cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-borders-normal"
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
                    sizes="400px"
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
              <div className="flex gap-3 items-end">
                <Button size="sm_normal" className="py-2 px-3">
                  change logo
                </Button>
                <Button
                  variant="light_red"
                  size="sm_normal"
                  className="py-2 px-3"
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
              <div className="flex items-center gap-3">
                <Input
                  id="cac_certificate"
                  label="cac certificate"
                  placeholder="Company CAC.pdf"
                  className="w-[300px]"
                />
                <div className="flex pt-7">
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
              <div className="flex items-end gap-3">
                <Input
                  id="membership_certificate"
                  label="membership certificate"
                  placeholder="Click the side button to upload cac certificate"
                  className="w-[300px]"
                />
                <Button variant="change" size="xs_normal" className="py-2 px-3">
                  upload certificate
                </Button>
              </div>
            </div>
            <SettingsSectionTitle
              title="company address"
              desc="Provide your complete head office address for the verification process. Please select your state, local government area, city, and upload a utility bill that is no older than 3 months."
            />
            <div className="grid grid-cols-[1fr_1fr_2fr] gap-5">
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
              <div className="flex items-center gap-3">
                <Select
                  id="city_town"
                  options={[]}
                  label="city / town"
                  inputContainerClassName="bg-neutral-2 w-[300px]"
                />
              </div>
              <Input
                id="head_office_address"
                label="head office address"
                placeholder="write here"
                className="col-span-2"
              />
              <div className="flex items-end gap-3">
                <Input
                  id="utility_document"
                  label="utility document"
                  placeholder="Click the side button to upload utility"
                  className="w-[300px]"
                />
                <Button variant="change" size="xs_normal" className="py-2 px-3">
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
          <TextArea id="about company" />
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="social medias"
              desc="Add your social media company username to allow clients to check your social page."
            />
            <div className="flex">
              <div className="grid grid-cols-3 gap-5 w-full max-w-[871px]">
                <Input
                  id="instagram"
                  label="instagram"
                  placeholder="https://instagram.com/"
                />
                <Input
                  id="facebook"
                  label="facebook"
                  placeholder="https://facebook.com/"
                />
                <Input
                  id="x"
                  label="x (Twitter)"
                  placeholder="https://x.com/"
                />
                <Input
                  id="linkedin"
                  label="linkedIn"
                  placeholder="https://linkedin.com/"
                />
                <Input
                  id="tiktok"
                  label="tiktok"
                  placeholder="https://tiktok.com/"
                />
                <Input
                  id="youtube"
                  label="youtube"
                  placeholder="https://youtube.com/"
                />
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="website settings">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-5">
            <SettingsSectionTitle desc="Select a preferred subdomain to showcase your company profile and market your properties listings portfolio to the world." />
            <div className="flex items-center gap-8">
              <Input
                id="domain_name"
                placeholder="makinwauxdesigner"
                label="Customize listings domain name"
              />
              <div className="flex pt-7">
                <p className="text-brand-9 text-base font-normal">
                  https://www.makinwauxdesgner.ourlisting.ng
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="custom-flex-col gap-3 text-base font-normal">
                <p className="text-text-secondary">
                  RSS Feed Link for Listings
                </p>
                <p className="text-brand-9">
                  https://www.ourlisting.ng/user/324224535
                </p>
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
        <div className="custom-flex-col gap-[18px]">
          <div className="custom-flex-col gap-7">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle
                title="color scheme"
                desc="Customize the default color to your preference from the available options listed below."
              />
              <div className="flex gap-2">
                {website_color_schemes.map((color) => (
                  <SettingsColorScheme
                    key={color}
                    color={color}
                    active={color === "#0033C4"}
                  />
                ))}
              </div>
            </div>
            <SettingsSectionTitle desc="Specify a color code or select a color that best represents your brand website. You can also incorporate additional color designs based on your preferences." />
            <div className="flex">
              <div className="w-10 h-10 rounded-lg border border-dashed border-borders-normal flex items-center justify-center">
                <p className="text-text-label text-xl font-medium">+</p>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Profile;
