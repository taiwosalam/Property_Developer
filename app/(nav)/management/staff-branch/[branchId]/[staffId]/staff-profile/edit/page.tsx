"use client";

import React from "react";

// Images
import Avatar from "@/public/empty/avatar-1.svg";

// Imports
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";

import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import BackButton from "@/components/BackButton/back-button";
import Picture from "@/components/Picture/picture";

const EditStaffProfile = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="flex">
        <BackButton>Edit Staff</BackButton>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="custom-flex-col gap-8 flex-1">
          <LandlordTenantInfoEditSection title="profile">
            <LandlordTenantInfoEditGrid>
              <Select
                isSearchable={false}
                id="personal-title"
                label="personal title / qualifiction"
                inputContainerClassName="bg-neutral-2"
                options={["prince", "princess", "alhaji", "alhaja"]}
              />
              <Select
                isSearchable={false}
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
              <Input id="fullname" label="full name" required />
              <Input id="email" type="email" label="email" required />
              <Select
                id="gender"
                label="gender"
                isSearchable={false}
                options={["male", "female"]}
                inputContainerClassName="bg-neutral-2"
              />
              <Input id="phone-number" label="phone number" required />
              <div></div>
              <div className="flex justify-end">
                <Button size="base_medium" className="py-3 px-8">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
        </div>
        <div className="w-full lg:w-[334px] custom-flex-col gap-5">
          <LandlordTenantInfoEditSection title="edit avatar">
            <div className="flex">
              <div className="relative">
                <Picture src={Avatar} alt="profile picture" size={90} rounded />
              </div>
            </div>
            <div className="custom-flex-col gap-3">
              <p className="text-black text-base font-medium">Choose Avatar</p>
              <div className="flex gap-3">
                {Array(4)
                  .fill(null)
                  .map((_, idx) => (
                    <Picture
                      key={idx}
                      src={Avatar}
                      alt="profile picture"
                      size={40}
                      rounded
                    />
                  ))}
              </div>
            </div>
            <Button size="base_medium" className="py-3 px-8">
              change photo
            </Button>
          </LandlordTenantInfoEditSection>
          <LandlordTenantInfoEditSection title="add note">
            <textarea
              className="w-full h-[120px] p-4 rounded-lg border border-solid border-neutral-200"
              placeholder="Note goes here"
            ></textarea>
          </LandlordTenantInfoEditSection>
        </div>
      </div>
    </div>
  );
};

export default EditStaffProfile;
