"use client";

import React from "react";

// Images
import PlusAvatar from "@/public/global/plus-avatar.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

const CreateStaffModal = () => {
  const { preview, handleImageChange } = useImageUploader({
    placeholder: PlusAvatar,
  });

  return (
    <LandlordTenantModalPreset star heading="Create New Staff">
      <div className="custom-flex-col gap-5">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Select
            isSearchable
            id="personal-title"
            label="personal title / qualifiction"
            inputContainerClassName="bg-neutral-2"
            options={["prince", "princess", "alhaji", "alhaja"]}
          />
          <Select
            isSearchable
            id="real-estate-title"
            label="real estate title"
            inputContainerClassName="bg-neutral-2"
            options={[
              "realtors",
              "real estate agent",
              "attorneys",
              "investors",
            ]}
          />
          <Input
            required
            id="fullname"
            label="full name"
            inputClassName="rounded-[8px]"
          />
          <Input
            required
            id="email"
            label="email"
            type="email"
            inputClassName="rounded-[8px]"
          />
          <Select
            id="position"
            label="position"
            inputContainerClassName="bg-neutral-2"
            options={["branch manager", "account officer", "staff"]}
          />
          <Select
            id="gender"
            label="Gender"
            options={["male", "female"]}
            inputContainerClassName="bg-neutral-2"
          />
          <Input
            id="phone_number"
            label="phone number"
            inputClassName="rounded-[8px]"
          />
          <Input
            id="create_password"
            label="create password"
            inputClassName="rounded-[8px]"
          />
          <Input
            id="confirm_password"
            label="confirm password"
            inputClassName="rounded-[8px]"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="custom-flex-col gap-3">
            <p className="text-black text-base font-medium">
              Upload staff picture or choose an avatar.
            </p>
            <div className="flex gap-3 items-center">
              <label htmlFor="picture" className="cursor-pointer">
                <Picture
                  src={preview}
                  alt="plus"
                  size={40}
                  className="rounded-[4px] bg-[#D9D9D9] border border-solid border-neutral-4"
                />
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  accept="image/*"
                  className="hidden pointer-events-none"
                  onChange={handleImageChange}
                />
              </label>
              {Array(4)
                .fill(null)
                .map((_, idx) => (
                  <button type="button" key={idx}>
                    <Picture
                      src={`/empty/avatar-${idx + 1}.svg`}
                      alt="avatar"
                      size={40}
                      rounded
                    />
                  </button>
                ))}
            </div>
          </div>
          <Button type="submit" size="base_medium" className="py-2 px-8">
            create
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateStaffModal;
