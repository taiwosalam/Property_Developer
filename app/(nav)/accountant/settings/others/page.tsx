"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
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
import useFetch from "@/hooks/useFetch";
import { ApiResponseUserPlan } from "@/app/(nav)/settings/others/types";
import { debounce } from "lodash";
import {
  otherNotificationSettings,
  updateCompanyNotification,
} from "@/app/(nav)/settings/others/data";
import SoundSelector from "@/app/(nav)/settings/others/NotificationSound";
const notificationSettingOptions = [
  {
    title: "System Notification",
    name: "general_notification",
    desc: "Receive priority notifications for general events or whenever there is a new event of notification.",
  },
];

const notificationOptions = [
  {
    name: "new_messages",
    text: "Ever there is a new message from either a client or a group chat related to the company.",
  },
  {
    name: "task_updates",
    text: "Task is created or if there are unattended tasks pending for an extended period.",
  },
  {
    name: "document_creation",
    text: "Document is created using my signature, name, or consent.",
  },
];

interface NotificationSettings {
  [key: string]: boolean;
}

const Others = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<DirectorsFormOptions>("options");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("");
  const [loadingNotification, setLoadingNotification] = useState(false);
  const handleBack = () => setActiveStep("options");
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      new_messages: true,
      task_updates: true,
      document_creation: true,
    });

  type DirectorsFormOptions = "options" | "choose-avatar";

  const handleSubmit = async (data: FormData) => {
    console.log(data);
    // if (res) {
    //   setIsOpen(false);
    // }
  };
  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  useEffect(() => {
    if (planData) {
      const premiumPlan =
        planData?.data?.plan?.plan_name.toLowerCase() ?? "free";
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  const handleCheckedState = useCallback(
    debounce(async (name: string, checked: boolean) => {
      setCheckedStates((prevState) => ({
        ...prevState,
        [name]: checked,
      }));

      const payload = {
        [name]: checked,
      };

      await otherNotificationSettings(name, payload);
    }, 500),
    []
  );

  const handleSetIsChecked = (name: string, value: SetStateAction<boolean>) => {
    const newValue =
      typeof value === "function" ? value(notificationSettings[name]) : value;
    // if (userPlan !== "professional") {
    //   return;
    // } else {
    setNotificationSettings((prev) => ({
      ...prev,

      [name]: newValue,
    }));
    //}
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    // if (userPlan !== "professional") {
    //   toast.error(
    //     "You cannot toggle the switch until you upgrade to a professional plan."
    //   );
    //   return;
    // }
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const saveSettings = async () => {
    try {
      setLoadingNotification(true);

      const updatedSettings = {
        ...notificationSettings,
      };

      setNotificationSettings(updatedSettings);

      // Send the computed payload to the backend
      await updateCompanyNotification(updatedSettings);
    } catch (error) {
    } finally {
      setLoadingNotification(false);
    }
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
      content: (
        <DirectorsForm
          submitAction={handleSubmit}
          chooseAvatar={() => setActiveStep("choose-avatar")}
          avatar={selectedAvatar}
          setAvatar={setSelectedAvatar}
        />
      ),
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
      <SettingsSection title="Email/Notifications">
        <div className="custom-flex-col gap-6 mt-4">
          <div className="mt-2 flex flex-col gap-4">
            <h4> Notify me when: </h4>
            {notificationOptions.map((option) => (
              <DocumentCheckbox
                key={option.name}
                name={option.name}
                darkText
                state={{
                  isChecked: notificationSettings[option.name],
                  // CHANGE 2: Use the new helper function
                  setIsChecked: (value) =>
                    handleSetIsChecked(option.name, value),
                }}
                onChange={handleCheckboxChange}
              >
                {option.text}
              </DocumentCheckbox>
            ))}
          </div>

          <div className="toggle flex flex-col gap-2">
            {notificationSettingOptions.map((setting, index) => (
              <SettingsOthersCheckBox
                plan={userPlan}
                key={index}
                title={setting.title}
                desc={setting.desc}
                value={setting.name}
                name={setting.name}
                checked={checkedStates[setting.title] || true}
                onChange={handleCheckedState}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <SettingsUpdateButton
            loading={loadingNotification}
            action={saveSettings}
            //action={userPlan === "professional" ? saveSettings : undefined}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Notification Sound">
        <SoundSelector button={SettingsUpdateButton} />
      </SettingsSection>
    </>
  );
};

export default Others;
