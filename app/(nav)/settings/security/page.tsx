"use client";

import React from "react";

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
import Button from "@/components/Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import FundingCard from "@/components/Wallet/AddFunds/funding-card";
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";

const Security = () => {
  const { preview, inputFileRef, handleImageChange } = useImageUploader();

  const changeImage = () => {
    inputFileRef.current?.click();
  };

  return (
    <>
      <SettingsSection title="directors profile">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-4">
            <SettingsSectionTitle
              title="Director Display Picture"
              desc="The profile photo size should be 180 x 180 pixels with a maximum file size of 2MB."
            />
            <div className="custom-flex-col gap-[18px]">
              <div className="flex gap-2">
                <Picture
                  size={100}
                  src={preview}
                  alt="profile picture"
                  className="rounded-lg"
                />
                <div className="flex items-end">
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                    onClick={changeImage}
                  >
                    change image
                  </Button>
                  <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    ref={inputFileRef}
                    onChange={handleImageChange}
                    className="hidden pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <Input
                  id="fullname"
                  label="full name"
                  placeholder="Taiwo Salam"
                  className="w-[277px]"
                />
                <Select
                  id="personal_title"
                  options={titles}
                  label="personal title"
                  inputContainerClassName="w-[277px] bg-neutral-2"
                />
              </div>
            </div>
          </div>
          <SettingsUpdateButton type="otp" remove />
        </div>
      </SettingsSection>
      <SettingsSection title="directors profile">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="Authorized Signature"
              desc="This signature is affixed to every document requiring authorization. Please sign on a plain white paper and take a photo for uploading. If possible, remove the background picture of the signature before uploading for a cleaner appearance."
            />
            <div className="custom-flex-col gap-[18px]">
              <div className="flex gap-2">
                <div className="relative rounded-lg overflow-hidden bg-[#F7F7F7] group cursor-pointer">
                  <Picture
                    size={100}
                    fit="contain"
                    src={SignatureImage}
                    alt="official signature"
                  />
                  <div
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}
                    className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <Picture src={ImageBlue} alt="image icon" size={20} />
                    <p className="text-brand-9 text-xs font-normal">
                      Change Image
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Input
                  id="fullname"
                  label="full name"
                  placeholder="Taiwo Salam"
                  className="w-[277px]"
                />
                <Select
                  id="personal_title_qualification"
                  options={titles}
                  label="personal title / qualification"
                  inputContainerClassName="w-[277px] bg-neutral-2"
                />
                <div className="flex gap-3">
                  <Select
                    id="real_estate_title"
                    options={industryOptions}
                    label="real estate title"
                    inputContainerClassName="w-[277px] bg-neutral-2"
                  />
                  <div className="flex items-end">
                    <Button
                      size="xs_normal"
                      variant="light_red"
                      className="py-2 px-3"
                    >
                      remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SettingsUpdateButton type="otp" addMore />
        </div>
      </SettingsSection>
      <SettingsSection title="wallet">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Wallet Pin"
            desc="This PIN is necessary for bank withdrawals, wallet transfers, and other associated transactions."
          />
          <div className="flex gap-5">
            <Input id="current_pin" label="current pin" className="w-[277px]" />
            <Input id="new_pin" label="new pin" className="w-[277px]" />
            <Input
              id="re_enter_password"
              label="re-enter password"
              className="w-[277px]"
            />
          </div>
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
      <SettingsSection title="password">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Change Password"
            desc="Use this section to reset your account password."
          />
          <div className="flex gap-5">
            <Input
              id="current_password"
              label="current password"
              className="w-[277px]"
            />
            <Input
              id="new_password"
              label="new password"
              className="w-[277px]"
            />
            <Input
              id="re_enter_new_password"
              label="re-enter new password"
              className="w-[277px]"
            />
          </div>
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
      <SettingsSection title="Bank Details">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Bank Account Withdrawal Details"
            desc="The registered name must match your bank details, and you can only link one bank to your account."
          />
          <div className="flex items-end gap-5">
            <Select
              id="bank_name"
              label="bank name"
              options={["sterling bank"]}
              inputContainerClassName="w-[277px] bg-neutral-2"
            />
            <Input
              id="account_number"
              label="account number"
              className="w-[277px]"
            />
            <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-success-1">
              <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-status-success-primary">
                <Check size={10} color="white" />
              </div>
              <p className="text-status-success-primary text-xs font-normal capitalize">
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
          <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch. This feature replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
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
          <div className="flex gap-5">
            <Input id="email" label="email address" className="w-[277px]" />
            <Input id="password" label="password" className="w-[277px]" />
            <Input id="smtp_server" label="STMP Server" className="w-[277px]" />
          </div>
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
    </>
  );
};

export default Security;
