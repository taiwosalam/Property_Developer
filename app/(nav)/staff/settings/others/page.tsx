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
import {
  ApiResponseUserPlan,
  INotificationSetting,
} from "@/app/(nav)/settings/others/types";
import { debounce } from "lodash";
import {
  otherNotificationSettings,
  updateCompanyNotification,
  updateNotificationSettings,
} from "@/app/(nav)/settings/others/data";
import SoundSelector from "@/app/(nav)/settings/others/NotificationSound";
import Switch from "@/components/Form/Switch/switch";
import { SectionSeparator } from "@/components/Section/section-components";
import { notificationCategories } from "@/app/(nav)/settings/others/data";
import { toast } from "sonner";
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

  const { data: apiDataProfile } =
    useFetch<INotificationSetting>(`user/profile`);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      management: true,
      rent: true,
      tasks: true,
      calendar: true,
      announcements: true,
      accounting: true,
      listings: true,
      settings: true,
      system: true,
      units: true,
      community: true,
    });

  useEffect(() => {
    if (apiDataProfile?.data?.notificationSetting) {
      const { notificationSetting } = apiDataProfile.data;
      setNotificationSettings({
        management: notificationSetting.management,
        rent: notificationSetting.rent,
        tasks: notificationSetting.tasks,
        calendar: notificationSetting.calendar,
        announcements: notificationSetting.announcements,
        accounting: notificationSetting.accounting,
        listings: notificationSetting.listings,
        settings: notificationSetting.settings,
        system: notificationSetting.system,
        units: notificationSetting.units,
        community: notificationSetting.community,
      });
    }
  }, [apiDataProfile]);

  const saveSettingsNotification = async () => {
    try {
      setLoadingNotification(true);
      const success = await updateNotificationSettings(notificationSettings);
      if (success) {
        toast.success("Notification settings updated successfully");
      } else {
        toast.error("Failed to update notification settings");
      }
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setLoadingNotification(false);
    }
  };

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

      {/* NOTIFICATION SETTINGS */}
      <SettingsSection title="Email and Notification Preferences">
        <div className="custom-flex-col gap-8 mt-4">
          {notificationCategories.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg text-text-primary">
                      {category.title}
                    </h4>
                  </div>
                  <p className="text-sm text-text-disabled ml-0 mt-1 mb-3">
                    {category.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings[category.value]}
                    onClick={() => {
                      handleSetIsChecked(
                        category.value,
                        !notificationSettings[category.value]
                      );
                    }}
                    // onClick={() => {
                    //   // Toggle all options in this category
                    //   console.log("Toggle switch...", category.value);
                    //   const anyChecked = category.options.some(
                    //     (option) => notificationSettings[option.name]
                    //   );
                    //   const newValue = !anyChecked;
                    //   category.options.forEach((option) => {
                    //     handleSetIsChecked(option.name, newValue);
                    //   });
                    // }}
                  />
                </div>
              </div>
              {/* Category Options */}
              <div className="ml-4 space-y-3">
                {category.options.map((option) => (
                  <DocumentCheckbox
                    key={option.name}
                    name={option.name}
                    darkText
                    state={{
                      isChecked: notificationSettings[category.value],
                      setIsChecked: (value) =>
                        handleSetIsChecked(category.value, value),
                    }}
                    onChange={() =>
                      handleCheckboxChange(
                        category.value,
                        !notificationSettings[category.value]
                      )
                    }
                    //disabled
                  >
                    {option.text}
                  </DocumentCheckbox>
                ))}
              </div>
              {categoryIndex < notificationCategories.length - 1 && (
                <>
                  <SectionSeparator />
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <SettingsUpdateButton
            loading={loadingNotification}
            action={saveSettingsNotification}
          />
        </div>
      </SettingsSection>
    </>
  );
};

export default Others;
