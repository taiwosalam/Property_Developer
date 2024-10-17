"use client";

import React from "react";
import Image from "next/image";

// Images
import Transparent from "@/public/empty/transparent.png";
// Imports
import { getAllStates } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";
import {
  DirectorCard,
  SettingsOthersCheckBox,
  SettingsOthersType,
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { industryOptions } from "@/data";
import { Modal } from "@/components/Modal/modal";
import { ModalContent } from "@/components/Modal/modal";
import { ModalTrigger } from "@/components/Modal/modal";
import AddLandLordOrTenantForm from "@/components/Management/add-landlord-or-tenant-form";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import DirectorsForm from "./DirectorsForm";

const Others = () => {
  return (
    <>
      {/* COMPANY TYPE SETTINGS */}
      <SettingsSection title="Company Type">
        <div className="custom-flex-col gap-3">
          <SettingsOthersType
            title="Property Manager"
            desc="The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates."
            icon="/icons/settingUserIcon.svg"
          />
        <SettingsOthersType
            title="Facility Manager"
            desc="The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations."
            icon="/icons/user-edit.svg"
          />
          <SettingsOthersType
            title="Property Developer"
            desc="A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They may offer flexible payment plans where buyers can make a deposit and pay the balance over a specified period."
            icon="/icons/user-tag.svg"
          />
        </div>

        <div className="flex mt-4">
          <div className="w-full max-w-[871px] grid grid-cols-3 gap-5">
            {/* <Input
              id="current_industry"
              label="Current Industry"
              placeholder="Legal Practitional"
            /> */}
            <Select
              options={industryOptions}
              id="current_industry"
              label="Current Industry"
              placeholder="Select options"
              inputContainerClassName="bg-neutral-2"
            />
          </div>
        </div>

        {/* COMPANY DIRECTORS */}
        <div className="custom-flex-col gap-6 mt-4">
          <SettingsSectionTitle
            title="Company Director"
            desc="Please provide the details of the additional directors you wish to include on your landing page. You can click on the current card to edit and add their information."
          />
          <AutoResizingGrid minWidth={284} gap={16}>
            <DirectorCard
              name="Esq Abimbola Adedeji"
              email="abimbola@gmail.com"
              img="/empty/SampleLandlord.jpeg"
              position="Legal Practitional"
              phone="+2348132086958"
            />
            <DirectorCard
              name="Esv Abimbola Adedeji"
              email="abimbola@gmail.com"
              img="/empty/SampleLandlord.jpeg"
              position="Estate Surveyor & Valuer"
              phone="+2348132086958"
            />
            <Modal>
              <div className="ml-8 card p-2 flex max-w-[397px] flex-col items-center justify-center border-dotted border-2 rounded-md border-borders-normal">
          <ModalTrigger>
              <div className="flex flex-col items-center gap-1 justify-center">
                <Image
                  src="/icons/profile.svg"
                  alt="add director"
                  width={30}
                  height={30}
                />
                <span> + Add new Profile </span>
              </div>
            </ModalTrigger>

              </div>
              <ModalContent>
              <LandlordTenantModalPreset
                heading="Create New Director">
                <DirectorsForm submitAction={() => {}} />
              </LandlordTenantModalPreset>
            </ModalContent>
        </Modal>
          </AutoResizingGrid>
        </div>
        <div className="flex justify-end mt-2">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      {/* MESSAGES & REVIEW SETTINGS */}
      <SettingsSection title="Messages & Review Settings">
        <div className="custom-flex-col gap-3">
          <SettingsOthersType
            title="Landlord/Landlady"
            desc="Automatically add the attached landlord/landlady profile to the property group, enabling them to view group conversations from all occupants/tenants, assigned staff, and account officers."
            icon="/icons/profile-circle.svg"
          />
          <SettingsOthersType
            title="Account Officer"
            desc="This will designate the assigned account officer for a property as a participant of the property group, enabling them to view and respond to all messages within the group."
            icon="/icons/user-edit.svg"
          />
          <SettingsOthersType
            title="Assign Staff"
            desc="Clicking on this option will grant assigned staff members access to group chats and property group conversations that are assigned to them."
            icon="/icons/user-tag.svg"
          />
          <SettingsOthersType
            title="Disable Messages"
            desc="When you click on this option, it means that all messaging functionality will be disabled for all users. They will not be able to send messages under your company profile or chat in the property group."
            icon="/icons/user-edit.svg"
          />
          <SettingsOthersType
            title="Disable Reviews"
            desc="When you click on this option, it means that reviews will not be displayed anymore under your company profile. New potential clients will not be able to see your previous reviews or comment under them."
            icon="/icons/user-tag.svg"
          />
        </div>

      {/* RESTRICTED USERS */}
      <div className="custom-flex-col gap-6 mt-4">
        <SettingsSectionTitle
          title="Restricted Users"
          desc="Please provide the details of the tenants, occupant, owner, landlord or landlady you wish to restrict from the group chat. Once restricted, they will not have access to chat in the group until the restriction is removed. You can click on the current card to delete or add restrictions."
        />
        <AutoResizingGrid minWidth={284} gap={16}>
          <DirectorCard
            name="Esq Abimbola Adedeji"
            email="abimbola@gmail.com"
            img="/empty/SampleLandlord.jpeg"
            phone="+2348132086958"
            icon="/icons/verified.svg"
          />
          <DirectorCard
            name="Esv Abimbola Adedeji"
            email="abimbola@gmail.com"
            img="/empty/SampleLandlord.jpeg"
            phone="+2348132086958"
            icon="/icons/verified-success.svg"
          />
          <div className="ml-8 card p-2 flex max-w-[397px] flex-col items-center justify-center border-dotted border-2 rounded-md border-borders-normal">
            <div className="flex flex-col items-center gap-1 justify-center">
              <Image
                src="/icons/profile.svg"
                alt="add director"
                width={30}
                height={30}
                />
              <p> + Add new Profile </p>
            </div>
          </div>
        </AutoResizingGrid>
      </div>
      <div className="flex justify-end mt-2">
          <SettingsUpdateButton />
        </div>
    </SettingsSection>

      {/* NOTIFICATIONS */}
      <SettingsSection title="Notifications">
        <div className="custom-flex-col gap-6 mt-4">
          <div className="mt-2 flex flex-col gap-2">
            <h4> Notify me when: </h4>
            {[
              "Manager or staff member makes any changes to their profile settings.",
              "Ever there is a new message from either a client or a group chat related to the company.",
              "Task is created or if there are unattended tasks pending for an extended period.",
              "A profile is created for web landlords/landladies and tenants/occupants awaiting approval.",
              "A property is created and awaiting approval.",
              "Property becomes vacant and is moved to the listing page.",
              "Document is created using my signature, name, or consent.",
            ].map((option, index) => (
              <DocumentCheckbox darkText key={index} checked={true}>
                {option}
              </DocumentCheckbox>
            ))}
          </div>

          <div className="toggle flex flex-col gap-2">
            <SettingsOthersCheckBox
              title="Subscription and Due Rent"
              desc="Receive push notifications whenever rent is due, subscription is about to expire, and for other upfront due notifications."
            />
            <SettingsOthersCheckBox
              title="General Notification"
              desc="Receive priority notifications for general events or whenever there is a new event of notification."
            />
            <SettingsOthersCheckBox
              title="SMS Notification"
              desc="Please notify me via SMS about subscriptions, tasks, and messages that have been waiting for a long time for a response."
            />
            <SettingsOthersCheckBox
              title="Email Notification"
              desc="Receive email notifications for every notification and reminder, as well as whenever I make any transaction in my wallet and other payment transactions."
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      {/* RESET SETTINGS */}
      <SettingsSection title="Notifications">
        <h4 className="text-sm text-text-disabled">
          This section enables you to revert all modifications made in the
          settings back to their default state.
        </h4>
        <div className="mt-4 flex flex-col gap-2">
          <SettingsOthersType
            title="Management"
            desc="This option allows you to revert any changes made within the management settings."
            icon="/icons/management.svg"
          />
          <SettingsOthersType
            title="Services"
            desc="This option enables you to reset any modifications made within the service settings to their default mode."
            icon="/icons/msg.svg"
          />
          <SettingsOthersType
            title="Notification"
            desc="Your notification settings can be reverted to default mode if you've made any modifications that you want to undo. This allows you to reset your notifications to their original settings in case you've made changes that you'd like to revert."
            icon="/icons/bell.svg"
          />
          <SettingsOthersType
            title="Appearance"
            desc="This option allows you to reset any modifications made within the appearance settings, such as changes to theme colors or screen modes, back to their default settings."
            icon="/icons/moon.svg"
          />
          <SettingsOthersType
            title="Restore All"
            desc="Restoring all to default may result in loss of all customizations made across various modules and sections of the settings. Undoing this action is not possible, unless you manually reset each setting individually."
            icon="/icons/cog.svg"
          />
        </div>
        <div className="flex justify-end mt-2">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Others;
