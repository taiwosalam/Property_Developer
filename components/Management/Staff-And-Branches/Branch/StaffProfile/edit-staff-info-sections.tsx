"use client";

import { useState, useEffect, useRef } from "react";
import { useStaffEditContext } from "./staff-edit-context";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { titles, genderTypes } from "@/data";
import TextArea from "@/components/Form/TextArea/textarea";
import CameraCircle from "@/public/icons/camera-circle.svg";
import { DeleteIconOrange } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import LockOTPModal from "./lock-otp-modal";
export const StaffEditProfileInfoSection = () => {
  const { data: staff } = useStaffEditContext();

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Select
          isSearchable={false}
          id="personal-title"
          label="personal title / qualifiction"
          inputContainerClassName="bg-neutral-2"
          options={titles}
          defaultValue={staff?.personal_title}
        />
        <Select
          isSearchable={false}
          id="real-estate-title"
          label="real estate title"
          inputContainerClassName="bg-neutral-2"
          options={["realtors", "real estate agent", "attorneys", "investors"]}
          defaultValue={staff?.real_estate_title}
        />
        <Input
          id="fullname"
          label="full name"
          required
          defaultValue={staff?.full_name}
        />
        <Input
          id="email"
          type="email"
          label="email"
          required
          defaultValue={staff?.email}
        />
        <Select
          id="gender"
          label="gender"
          isSearchable={false}
          options={genderTypes}
          inputContainerClassName="bg-neutral-2"
          defaultValue={staff?.gender}
        />
        <Input
          id="phone-number"
          label="phone number"
          required
          defaultValue={staff?.phone_number}
        />

        <div className="md:col-span-2 flex justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffEditMoveToAnotherBranchSection = () => {
  const { data: staff } = useStaffEditContext();
  const name = staff?.full_name;
  const position = staff?.position;
  return (
    <LandlordTenantInfoEditSection title={`move ${name} to another branch`}>
      <LandlordTenantInfoEditGrid>
        <Select
          id="current_position"
          label="Current Position"
          inputContainerClassName="bg-neutral-2"
          options={[]}
          defaultValue={position}
        />
        <Select
          id="select_new_branch"
          label="select new branch"
          inputContainerClassName="bg-neutral-2"
          options={[]}
          //   defaultValue={staff?.real_estate_title}
        />
        <Select
          id="transfer_current_position_to"
          label="transfer current position to"
          //   defaultValue={staff?.full_name}
          options={[]}
        />
        <Select
          id="select_new_branch_position"
          label="select new branch position"
          inputContainerClassName="bg-neutral-2"
          options={[]}
          //   defaultValue={staff?.real_estate_title}
        />
        <div className="md:col-span-2 flex justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffEditChangePositionSection = () => {
  const { data: staff } = useStaffEditContext();
  const name = staff?.full_name;
  return (
    <LandlordTenantInfoEditSection title={`change ${name} position`}>
      <LandlordTenantInfoEditGrid>
        <Select
          id="assign_current_position_to"
          label="assign current position to"
          inputContainerClassName="bg-neutral-2"
          options={[]}
          //   defaultValue={position}
        />
        <Select
          id="new_position"
          label="new position"
          inputContainerClassName="bg-neutral-2"
          options={[]}
          //   defaultValue={staff?.real_estate_title}
        />

        <div className="md:col-span-2 flex justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffEditAboutSection = () => {
  const { data: staff } = useStaffEditContext();
  const [about, setAbout] = useState("");
  useEffect(() => {
    setAbout(staff?.about || "");
  }, [staff?.about]);
  return (
    <LandlordTenantInfoEditSection
      title="about staff"
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="absolute top-5 right-5 !w-[unset]"
        onClick={() => setAbout("")}
      >
        Clear
      </button>
      <TextArea
        id="about"
        value={about}
        onChange={(value) => setAbout(value)}
      />
      <Button size="base_medium" className="!w-fit ml-auto py-2 px-6">
        update
      </Button>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffLockAccountSection = () => {
  const { data: staff } = useStaffEditContext();
  const name = staff?.full_name;
  return (
    <LandlordTenantInfoEditSection title={`lock ${name} account`}>
      <div className="space-y-4">
        <p>
          This will prevent account users from accessing the account. Access
          cannot be regained until the account is unlocked from your end
        </p>
        <div className="flex justify-end">
          <Modal>
            <ModalTrigger asChild>
              <Button
                size="base_medium"
                className="py-2 px-6 w-fit"
                variant="red"
              >
                lock
              </Button>
            </ModalTrigger>
            <ModalContent>
              <LockOTPModal />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffEditAvatarInfoSection = () => {
  const { data: staff } = useStaffEditContext();
  const [profilePicture, setProfilePicture] = useState<string>(CameraCircle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (staff?.avatar || staff?.picture) {
      setProfilePicture(staff.picture || staff.avatar || CameraCircle);
    }
  }, [staff?.avatar, staff?.picture]);

  return (
    <LandlordTenantInfoEditSection title="edit profile picture">
      <div className="flex">
        <div
          className="relative"
          role="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePicture(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <input
            type="hidden"
            name="avatar"
            value={profilePicture === CameraCircle ? "" : profilePicture}
          />
          <Picture
            src={profilePicture}
            alt="profile picture"
            size={90}
            rounded
          />
          {profilePicture !== CameraCircle && (
            <button
              type="button"
              className="absolute top-0 right-0 translate-x-[5px] -translate-y-[5px]"
              onClick={(e) => {
                setProfilePicture(CameraCircle);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                e.stopPropagation();
              }}
            >
              <DeleteIconOrange size={32} />
            </button>
          )}
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <p className="text-black text-base font-medium">Choose Avatar</p>
        <Avatars
          type="avatars"
          size={40}
          maxSize={4}
          onClick={setProfilePicture}
        />
      </div>
      <Button size="base_medium" className="py-2 px-6">
        Save
      </Button>
    </LandlordTenantInfoEditSection>
  );
};
