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
const notificationSettings = [
  {
    title: 'General Notification',
    desc: 'Receive priority notifications for general events or whenever there is a new event of notification.',
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
      {/* NOTIFICATIONS */}
      <SettingsSection title='Notifications'>
        <div className='custom-flex-col gap-6 mt-4'>
          <div className='mt-2 flex flex-col gap-2'>
            <h4> Notify me when: </h4>
            {[
              'Whenever there is a new message from either a client or a group chat related to the company.',
              'Task is created or if there are unattended tasks pending for an extended period.',
              'Document is created using my signature, name, or consent.',
            ].map((option, index) => (
              <DocumentCheckbox
                darkText
                key={index}
                checked={true}
              >
                {option}
              </DocumentCheckbox>
            ))}
          </div>

          <div className='toggle flex flex-col gap-2'>
            {notificationSettings.map((setting, index) => (
              <SettingsOthersCheckBox
                key={index}
                title={setting.title}
                desc={setting.desc}
                value={setting.title}
                checked={checkedStates[setting.title] || true}
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
        <div className='flex justify-end mt-2'>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Others;
