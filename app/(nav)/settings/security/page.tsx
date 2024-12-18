"use client";

import React, { useState } from "react";

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

const Security = () => {
  const { preview, inputFileRef, handleImageChange } = useImageUploader();
  const [inputFields, setInputFields] = useState([
    { id: Date.now(), signature: SignatureImage },
  ]);

  const changeImage = () => {
    inputFileRef.current?.click();
  };

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      { id: Date.now(), signature: SignatureImage },
    ]);
    // console.log("Input Fields after adding:", [
    //   ...inputFields,
    //   { id: Date.now(), signature: SignatureImage },
    // ]);
  };

  const removeInputField = (id: number) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
    console.log("Input Fields after removing:", updatedFields);
  };

  const changeSignatureImage = (index: number) => {
    document.getElementById(`signature_input_${index}`)?.click();
  };

  const handleSignatureChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const newSignature = URL.createObjectURL(e.target.files[0]);
        setInputFields(
          inputFields.map((inputField) =>
            inputField.id === inputFields[index].id
              ? { ...inputField, signature: newSignature }
              : inputField
          )
        );
      }
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
              <ProfileUpload
                preview={preview || ""}
                onChange={handleImageChange}
                inputFileRef={inputFileRef}
                onClick={changeImage}
              />
              <div className="flex flex-col lg:flex-row gap-5">
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
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="Authorized Signature">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title=""
              desc="This signature is affixed to every document requiring authorization. Please sign on a plain white paper and take a photo for uploading. If possible, remove the background picture of the signature before uploading for a cleaner appearance."
            />
            <div className="custom-flex-col gap-[18px]">
              <div className="flex flex-col gap-5">
                {inputFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <div className="relative max-w-[100px] rounded-lg overflow-hidden bg-[#F7F7F7] group cursor-pointer">
                      <Picture
                        size={100}
                        fit="contain"
                        src={field.signature}
                        alt="official signature"
                      />
                      <div
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}
                        className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
                      >
                        <Picture src={ImageBlue} alt="image icon" size={20} />
                        <p
                          className="text-brand-9 text-xs font-normal"
                          onClick={() => changeSignatureImage(index)}
                        >
                          Change Image
                        </p>
                      </div>
                      <input
                        type="file"
                        id={`signature_input_${index}`}
                        name={`signature_${index}`}
                        accept="image/*"
                        onChange={handleSignatureChange(index)}
                        className="hidden"
                        ref={React.createRef()}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 justify-start md:justify-end md:items-end items-start">
                      <div className="flex-1">
                        <Input
                          id={`fullname_${index}`}
                          label="full name"
                          placeholder="Taiwo Salam"
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <Select
                          id={`personal_title_qualification_${index}`}
                          options={titles}
                          label="personal title / qualification"
                          inputContainerClassName="w-full bg-neutral-2"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <Select
                          id={`real_estate_title_${index}`}
                          options={industryOptions}
                          label="real estate title"
                          inputContainerClassName="w-full bg-neutral-2"
                        />
                        {index !== 0 && (
                          <button
                            className="bg-brand-9 min-w-[50px] text-white text-xs font-normal py-2 px-3 rounded-lg max-h-[40px]"
                            onClick={() => removeInputField(field.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                <div className="flex items-end">
                  <button
                    className="text-xs font-normal py-2 px-3 w-full sm:w-auto text-brand-9 bg-white"
                    onClick={addInputField}
                  >
                    Add More
                  </button>
                </div>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsWalletSection />
      <SettingsPasswordSection />
      <SettingsSection title="Bank Details">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Bank Account Withdrawal Details"
            desc="The registered name must match your bank details, and you can only link one bank to your account."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
            <Select
              id="bank_name"
              label="bank name"
              options={["sterling bank"]}
              inputContainerClassName="w-full bg-neutral-2"
            />
            <Input
              id="account_number"
              label="account number"
              className="w-full"
            />
            <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-success-1">
              <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-status-success-primary">
                <Check size={10} color="white" />
              </div>
              <p className="text-status-success-primary text-xs font-normal capitalize truncate">
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
          <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch.  replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input id="email" label="email address" className="w-full" />
            <Input id="password" label="password" className="w-full" />
            <Input id="smtp_server" label="SMTP Server" className="w-full" />
          </div>
          <SettingsUpdateButton type="otp" />
        </div>
      </SettingsSection>
    </>
  );
};

export default Security;
