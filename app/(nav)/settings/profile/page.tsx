"use client";

import React from "react";
import Image from "next/image";

// Images
import { UploadImageIcon } from "@/public/icons/icons";
import Transparent from "@/public/empty/transparent.png";

// Imports
import { getAllStates } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";

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
            <div className="custom-flex-col gap-[2px]">
              <p className="text-text-quaternary text-base font-medium capitalize">
                Company Logo
              </p>
              <p className="text-text-disabled text-sm font-normal">
                Ensure that your company logo has a white background, with a
                maximum size of 2MB. The picture must be between 250 to 400
                pixels wide, or ideally 160px x 160px.
              </p>
            </div>
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
            <div className="flex justify-end">
              <Button size="base_bold" className="py-[10px] px-8">
                update
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>
    </>
  );
};

export default Profile;
