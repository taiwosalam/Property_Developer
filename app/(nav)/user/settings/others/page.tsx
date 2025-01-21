"use client";

import { useState } from "react";
import Image from "next/image";

// Imports
// import Select from "@/components/Form/Select/select";
// import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";
import {
  // DirectorCard,
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
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import DirectorsForm from "./DirectorsForm";
import RestrictUserForm from "./RestrictUserForm";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import {
  SettingUserIcon,
  UserEditIcon,
  UserTagIcon,
  ProfileCircleIcon,
  ManageIcon,
  // MsgIcon,
  // BellIcon,
  // MoonIcon,
  CogIcon,
  SettingsBellIcon,
  SettingsServiceIcon,
  SettingsAppearanceIcon,
} from "@/public/icons/icons";
import Avatars from "@/components/Avatars/avatars";

const companyTypes = [
  {
    title: "Property Manager",
    desc: "The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates.",
    icon: <SettingUserIcon />,
    groupName: "property_manager",
  },
  {
    title: "Facility Manager",
    desc: "The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
    icon: <UserEditIcon />,
    groupName: "facility_manager",
  },
  {
    title: "Property Developer",
    desc: "A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They may offer flexible payment plans where buyers can make a deposit and pay the balance over a specified period.",
    icon: <UserTagIcon />,
    groupName: "property_developer",
  },
];
const notificationSettings = [
  {
    title: "Subscription and Due Rent",
    desc: "Receive push notifications whenever rent is due, subscription is about to expire, and for other upfront due notifications.",
  },
  {
    title: "General Notification",
    desc: "Receive priority notifications for general events or whenever there is a new event of notification.",
  },
  {
    title: "SMS Notification",
    desc: "Please notify me via SMS about subscriptions, tasks, and messages that have been waiting for a long time for a response.",
  },
  {
    title: "Email Notification",
    desc: "Receive email notifications for every notification and reminder, as well as whenever I make any transaction in my wallet and other payment transactions.",
  },
];

const messageReviewSettings = [
  {
    title: "Landlord/Landlady",
    desc: "Automatically add the attached landlord/landlady profile to the property group, enabling them to view group conversations from all occupants/tenants, assigned staff, and account officers.",
    icon: <ProfileCircleIcon />,
  },
  {
    title: "Account Officer",
    desc: "This will designate the assigned account officer for a property as a participant of the property group, enabling them to view and respond to all messages within the group.",
    icon: <UserEditIcon />,
  },
  {
    title: "Assign Staff",
    desc: "Clicking on this option will grant assigned staff members access to group chats and property group conversations that are assigned to them.",
    icon: <UserTagIcon />,
  },
  {
    title: "Disable Messages",
    desc: "When you click on this option, it means that all messaging functionality will be disabled for all users. They will not be able to send messages under your company profile or chat in the property group.",
    icon: <UserEditIcon />,
  },
  {
    title: "Disable Reviews",
    desc: "When you click on this option, it means that reviews will not be displayed anymore under your company profile. New potential clients will not be able to see your previous reviews or comment under them.",
    icon: <UserTagIcon />,
  },
];

const resetSettingsOptions = [
  {
    title: "Management",
    desc: "This option allows you to revert any changes made within the management settings.",
    icon: <ManageIcon />,
  },
  {
    title: "Services",
    desc: "This option enables you to reset any modifications made within the service settings to their default mode.",
    icon: <SettingsServiceIcon />,
  },
  {
    title: "Notification",
    desc: "Your notification settings can be reverted to default mode if you've made any modifications that you want to undo. This allows you to reset your notifications to their original settings in case you've made changes that you'd like to revert.",
    icon: <SettingsBellIcon />,
  },
  {
    title: "Appearance",
    desc: "This option allows you to reset any modifications made within the appearance settings, such as changes to theme colors or screen modes, back to their default settings.",
    icon: <SettingsAppearanceIcon />,
  },
  {
    title: "Restore All",
    desc: "Restoring all to default may result in loss of all customizations made across various modules and sections of the settings. Undoing this action is not possible, unless you manually reset each setting individually.",
    icon: <CogIcon />,
  },
];

const Others = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<DirectorsFormOptions>("options");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const handleBack = () => setActiveStep("options");
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  type DirectorsFormOptions = "options" | "choose-avatar";
  
    const handleSubmit = async (data: FormData) => {
      console.log(data);
      // if (res) {
      //   setIsOpen(false);
      // }
  };


  const modal_states: Record<
    DirectorsFormOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Create New Director",
      content: <DirectorsForm 
      submitAction={handleSubmit}
      chooseAvatar={() => setActiveStep("choose-avatar")}
      avatar={selectedAvatar}
      setAvatar={setSelectedAvatar}
        />,
    },
    "choose-avatar": {
      heading: "Choose Avatar",
      content: (
        <Avatars
          onClick={(avatarUrl) => {
            setSelectedAvatar(avatarUrl);
            setActiveStep("options");
          }}
        />
      ),
    },
  };

  

  return (
    <>
      {/* COMPANY TYPE SETTINGS */}
      <SettingsSection title="Company Default Module">
        <div className="custom-flex-col gap-3">
          {companyTypes.map((type, index) => (
            <SettingsOthersType
              key={index}
              title={type.title}
              desc={type.desc}
              icon={type.icon}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groupName={type.groupName}
            />
          ))}
        </div>

        {/* COMPANY DIRECTORS */}
        <div className="custom-flex-col gap-6 mt-4">
          <SettingsSectionTitle
            title="Company Director"
            desc="Please provide the details of the additional directors you wish to include on your landing page. You can click on the current card to edit and add their information."
          />
          <AutoResizingGrid minWidth={284} gap={16}>
            <UserCard
              name="Esq Abimbola Adedeji"
              email="abimbola@gmail.com"
              phone_number="+2348132086958"
              picture_url="/empty/SampleLandlord.jpeg"
              user_tag="Legal Practitioner"
            />
            <UserCard
              name="Esq Abimbola Adedeji"
              email="abimbola@gmail.com"
              phone_number="+2348132086958"
              picture_url="/empty/SampleLandlord.jpeg"
              user_tag="Estate Surveyor & Valuer"
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
                <LandlordTenantModalPreset heading={modal_states[activeStep].heading}
                  back={activeStep !== "options" ? { handleBack } : undefined}
                >
                  {modal_states[activeStep].content}
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
          {messageReviewSettings.map((setting, index) => (
            <SettingsOthersType
              key={index}
              title={setting.title}
              desc={setting.desc}
              icon={setting.icon}
            />
          ))}
        </div>

        {/* RESTRICTED USERS */}
        <div className="custom-flex-col gap-6 mt-4">
          <SettingsSectionTitle
            title="Restricted Users"
            desc="Please provide the details of the tenants, occupant, owner, landlord or landlady you wish to restrict from the group chat. Once restricted, they will not have access to chat in the group until the restriction is removed. You can click on the current card to delete or add restrictions."
          />
          <AutoResizingGrid minWidth={284} gap={16}>
            <UserCard
              name="Esq Abimbola Adedeji"
              email="abimbola@gmail.com"
              phone_number="+2348132086958"
              picture_url="/empty/SampleLandlord.jpeg"
              user_tag="mobile"
            />
            <UserCard
              name="Esq Abimbola Adedeji"
              email="abimbola@gmail.com"
              phone_number="+2348132086958"
              picture_url="/empty/SampleLandlord.jpeg"
              user_tag="mobile"
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
              <div className="w-[00px]">
                <ModalContent>
                  <LandlordTenantModalPreset heading="Restrict User">
                    <RestrictUserForm submitAction={() => { }} />
                  </LandlordTenantModalPreset>
                </ModalContent>
              </div>
            </Modal>
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
            {notificationSettings.map((setting, index) => (
              <SettingsOthersCheckBox
                key={index}
                title={setting.title}
                desc={setting.desc}
                value={setting.title}
                checked={checkedStates[setting.title] || false}
                onChange={(value, checked) => {
                  setCheckedStates((prevState) => ({
                    ...prevState,
                    [value]: checked,
                  }));
                  console.log(`${value} changed to: ${checked}`);
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      {/* RESET SETTINGS */}
      <SettingsSection title="Reset Settings">
        <h4 className="text-sm text-text-disabled">
          This section enables you to revert all modifications made in the
          settings back to their default state.
        </h4>
        <div className="mt-4 flex flex-col gap-2">
          {resetSettingsOptions.map((option, index) => (
            <SettingsOthersType
              key={index}
              title={option.title}
              desc={option.desc}
              icon={option.icon}
            />
          ))}
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
    </>
  );
};

export default Others;
