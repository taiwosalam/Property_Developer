"use client";

import { SetStateAction, useEffect, useState } from "react";
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
import {
  addNewDirector,
  DirectorCardProps,
  ITransformedOtherSettings,
  otherNotificationSettings,
  restrictUserFromGroupChat,
  selectCompanyModule,
  transformOtherSetting,
  transfromToDirectorCards,
  updateCompanyNotification,
  updateMessageAndReviewSettings,
  updateResetSettings,
} from "./data";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  ApiResponseDirector,
  ApiResponseUserPlan,
  CompanySettingsResponse,
  RestrictedTenant,
  RestrictedUserApiResponse,
} from "./types";

import { useCallback } from "react";
import debounce from "lodash/debounce";
import Button from "@/components/Form/Button/button";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import SettingsUpdateModal from "@/components/Settings/Modals/settings-update-modal";
import RestoreRestrictedUserForm from "./RestoreRestrictedUserForm";

const companyTypes = [
  {
    id: 1,
    title: "Property Manager",
    desc: "The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates.",
    icon: <SettingUserIcon />,
    groupName: "property_manager",
  },
  {
    id: 2,
    title: "Facility Manager",
    desc: "The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
    icon: <UserEditIcon />,
    groupName: "facility_manager",
  },
  {
    id: 3,
    title: "Property Developer",
    desc: "A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They may offer flexible payment plans where buyers can make a deposit and pay the balance over a specified period.",
    icon: <UserTagIcon />,
    groupName: "property_developer",
  },
];
const notificationOtherSettings: NotificationSetting[] = [
  {
    name: "subscription_due_rent_notification",
    title: "Subscription and Due Rent",
    desc: "Receive push notifications whenever rent is due, subscription is about to expire, and for other upfront due notifications.",
  },
  {
    name: "general_notification",
    title: "General Notification",
    desc: "Receive priority notifications for general events or whenever there is a new event of notification.",
  },
  {
    name: "sms_notification",
    title: "SMS Notification",
    desc: "Please notify me via SMS about subscriptions, tasks, and messages that have been waiting for a long time for a response.",
  },
  {
    name: "email_notification",
    title: "Email Notification",
    desc: "Receive email notifications for every notification and reminder, as well as whenever I make any transaction in my wallet and other payment transactions.",
  },
];

interface MessageReviewSetting {
  title: string;
  desc: string;
  name: string;
  icon?: React.ReactNode;
  enabled?: boolean;
}
const messageReviewSettings: MessageReviewSetting[] = [
  {
    title: "Landlord/Landlady",
    name: "landlord_landlady",
    enabled: true,
    desc: "Automatically add the attached landlord/landlady profile to the property group, enabling them to view group conversations from all occupants/tenants, assigned staff, and account officers.",
    icon: <ProfileCircleIcon />,
  },
  {
    title: "Account Officer",
    name: "account_officer",
    enabled: true,
    desc: "This will designate the assigned account officer for a property as a participant of the property group, enabling them to view and respond to all messages within the group.",
    icon: <UserEditIcon />,
  },
  {
    title: "Assign Staff",
    name: "assign_staff",
    enabled: true,
    desc: "Clicking on this option will grant assigned staff members access to group chats and property group conversations that are assigned to them.",
    icon: <UserTagIcon />,
  },
  {
    title: "Disable Messages",
    name: "messages",
    enabled: true,
    desc: "When you click on this option, it means that all messaging functionality will be disabled for all users. They will not be able to send messages under your company profile or chat in the property group.",
    icon: <UserEditIcon />,
  },
  {
    title: "Disable Reviews",
    name: "reviews",
    enabled: true,
    desc: "When you click on this option, it means that reviews will not be displayed anymore under your company profile. New potential clients will not be able to see your previous reviews or comment under them.",
    icon: <UserTagIcon />,
  },
];

const resetSettingsOptions = [
  {
    name: "management",
    title: "Management",
    desc: "This option allows you to revert any changes made within the management settings.",
    icon: <ManageIcon />,
  },
  {
    name: "services",
    title: "Services",
    desc: "This option enables you to reset any modifications made within the service settings to their default mode.",
    icon: <SettingsServiceIcon />,
  },
  {
    name: "notifications",
    title: "Notification",
    desc: "Your notification settings can be reverted to default mode if you've made any modifications that you want to undo. This allows you to reset your notifications to their original settings in case you've made changes that you'd like to revert.",
    icon: <SettingsBellIcon />,
  },
  {
    name: "appearance",
    title: "Appearance",
    desc: "This option allows you to reset any modifications made within the appearance settings, such as changes to theme colors or screen modes, back to their default settings.",
    icon: <SettingsAppearanceIcon />,
  },
  {
    name: "resetAll",
    title: "Restore All",
    desc: "Restoring all to default may result in loss of all customizations made across various modules and sections of the settings. Undoing this action is not possible, unless you manually reset each setting individually.",
    icon: <CogIcon />,
  },
];

interface NotificationSettings {
  [key: string]: boolean;
}

const notificationOptions = [
  {
    name: "profile_changes",
    text: "Manager or staff member makes any changes to their profile settings.",
  },
  {
    name: "new_messages",
    text: "Ever there is a new message from either a client or a group chat related to the company.",
  },
  {
    name: "task_updates",
    text: "Task is created or if there are unattended tasks pending for an extended period.",
  },
  {
    name: "profile_approval",
    text: "A profile is created for web landlords/landladies and tenants/occupants awaiting approval.",
  },
  {
    name: "property_approval",
    text: "A property is created and awaiting approval.",
  },
  {
    name: "property_vacant",
    text: "Property becomes vacant and is moved to the listing page.",
  },
  {
    name: "document_creation",
    text: "Document is created using my signature, name, or consent.",
  },
];

interface NotificationSetting {
  title: string;
  desc: string;
  name: string;
  value?: string;
}
interface CompanyModuleSettings {
  company_type_id: boolean;
}

const Others = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<DirectorsFormOptions>("options");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [processingMessageReview, setProcessingMessageReview] =
    useState<boolean>(false);
  const [updatingModule, setUpdatingModule] = useState<boolean>(false);
  const handleBack = () => setActiveStep("options");
  const [messageReviewSettingsState, setMessageReviewSettingsState] = useState<{
    [key: string]: boolean;
  }>({
    reviews: true,
    messages: true,
    assign_staff: true,
    account_officer: true,
    landlord_landlady: true,
  });
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({
    email_notification: true,
    subscription_due_rent_notification: true,
    general_notification: true,
    sms_notification: true,
  });
  const [processing, setProcessing] = useState(false);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("");
  const [defaultOtherSettings, setDefaultOtherSettings] =
    useState<ITransformedOtherSettings | null>(null);
  const [selectedModule, setSelectedModule] =
    useState<CompanyModuleSettings | null>(null);

  const { company_id } = usePersonalInfoStore();

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      profile_changes: true,
      new_messages: true,
      task_updates: true,
      profile_approval: true,
      property_approval: true,
      property_vacant: true,
      document_creation: true,
    });

  const [resetOptions, setResetOptions] = useState<string[]>([]);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleResetCheckboxChange = (name: string, checked: boolean) => {
    setResetOptions((prev) => {
      if (name === "resetAll") {
        // If 'resetAll' is checked, select all options
        return checked ? resetSettingsOptions.map((opt) => opt.name) : [];
      } else {
        const newSelection = checked
          ? [...prev, name]
          : prev.filter((item) => item !== name);

        // If an individual option is unchecked, remove 'resetAll'
        if (!checked && newSelection.includes("resetAll")) {
          return newSelection.filter((item) => item !== "resetAll");
        }

        // If all options (except 'resetAll') are selected, add 'resetAll'
        const allChecked =
          newSelection.length === resetSettingsOptions.length - 1;
        return allChecked ? [...newSelection, "resetAll"] : newSelection;
      }
    });
  };

  const resetSettings = async () => {
    if (!Array.isArray(resetOptions) || resetOptions.length === 0) return;

    // payload should only include "resetAll" when selected
    const payload = resetOptions.includes("resetAll")
      ? ["resetAll"]
      : resetOptions;
    setLoadingReset(true);
    try {
      const response = await updateResetSettings(payload);
      // reset the settings options when request is made
      setResetOptions([]);
      console.log(response);
    } catch (error) {
    } finally {
      setLoadingReset(false);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (userPlan !== "professional") {
      // toast.error(
      //   "You cannot toggle the switch until you upgrade to a professional plan."
      // );
      return;
    }
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const handleMessageReviewCheckbox = (name: string, checked: boolean) => {
    setMessageReviewSettingsState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // handle company module change
  const handleCompanyModuleSettings = (name: string, checked: boolean) => {
    const modules = { company_type_id: checked };
    setSelectedModule(modules);
  };

  const handleSetIsChecked = (name: string, value: SetStateAction<boolean>) => {
    const newValue =
      typeof value === "function" ? value(notificationSettings[name]) : value;
    if (userPlan !== "professional") {
      return;
    } else {
      setNotificationSettings((prev) => ({
        ...prev,

        [name]: newValue,
      }));
    }
  };

  const handleSetIsCheckedMessageReview = (
    name: string,
    value: SetStateAction<boolean>
  ) => {
    const newValue =
      typeof value === "function"
        ? value(messageReviewSettingsState[name])
        : value;
    setMessageReviewSettingsState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

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

  const updateMessageReviewSettings = async () => {
    try {
      setProcessingMessageReview(true);

      await updateMessageAndReviewSettings(messageReviewSettingsState);
    } catch (error) {
    } finally {
      setProcessingMessageReview(false);
    }
  };

  const {
    data: apiData,
    loading,
    isNetworkError,
    refetch,
  } = useFetch<ApiResponseDirector>(`/directors`);
  const [cardView, setCardView] = useState<DirectorCardProps | null>(null);

  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  const { data: otherSettingResponse } =
    useFetch<CompanySettingsResponse>("/company/settings");

  useEffect(() => {
    if (otherSettingResponse) {
      setDefaultOtherSettings(transformOtherSetting(otherSettingResponse));
      const messageReviewSettings = {
        reviews: defaultOtherSettings?.notification?.reviews ?? true,
        messages: defaultOtherSettings?.notification?.messages ?? true,
        account_officer:
          defaultOtherSettings?.notification?.account_officer ?? true,
        landlord_landlady:
          defaultOtherSettings?.notification?.landlord_landlady ?? true,
        assign_staff: defaultOtherSettings?.notification?.assign_staff ?? true,
      };
      setSelectedGroup(
        defaultOtherSettings?.notification?.company_default_module?.toString() ??
          "1"
      );

      setMessageReviewSettingsState(messageReviewSettings);
    }
  }, [otherSettingResponse]);

  useEffect(() => {
    if (otherSettingResponse && userPlan === "professional") {
      setDefaultOtherSettings(transformOtherSetting(otherSettingResponse));
      const userSettings: NotificationSettings = {
        profile_changes:
          defaultOtherSettings?.notification.profile_changes ?? true,
        new_messages: defaultOtherSettings?.notification.new_messages ?? true,
        task_updates: defaultOtherSettings?.notification.task_updates ?? true,
        profile_approval:
          defaultOtherSettings?.notification.profile_approval ?? true,
        property_approval:
          defaultOtherSettings?.notification.property_approval ?? true,
        property_vacant:
          defaultOtherSettings?.notification.property_vacant ?? true,
        document_creation:
          defaultOtherSettings?.notification.document_creation ?? true,
      };
      setNotificationSettings(userSettings);

      const otherNotificationSettings = {
        sms_notification:
          defaultOtherSettings?.notification?.sms_notification ?? true,
        email_notification:
          defaultOtherSettings?.notification?.email_notification ?? true,
        subscription_due_rent_notification:
          defaultOtherSettings?.notification
            ?.subscription_due_rent_notification ?? true,
        general_notification:
          defaultOtherSettings?.notification?.general_notification ?? true,
      };
      setCheckedStates(otherNotificationSettings);
    }
  }, [otherSettingResponse]);

  useEffect(() => {
    if (planData) {
      const premiumPlan = planData?.data?.plan?.plan_name.toLowerCase();
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  useRefetchOnEvent("addNewDirector", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      const transCard = transfromToDirectorCards(apiData);
      setCardView(transCard);
    }
  }, [apiData]);

  type DirectorsFormOptions = "options" | "choose-avatar";

  const handleSubmit = async (data: FormData) => {
    const fields = [
      "title",
      "personal_title",
      "full_name",
      "email",
      "years_in_business",
      "password",
      "password_confirmation",
      "about_director",
      "phone_number",
      "profile_picture",
      "avatar",
    ];

    const payload = new FormData();
    fields.forEach((field) => {
      const value = data.get(field);
      if (value) {
        payload.append(field, value);
      }
    });

    try {
      setProcessing(true);
      const response = await addNewDirector(payload);

      if (response) {
        toast.success("New director added");
        window.dispatchEvent(new Event("addNewDirector"));
      }
    } catch (error) {
      if (error instanceof Error) {
      }
    } finally {
      setProcessing(false);
    }
  };
  //type DirectorsFormOptions = "options" | "choose-avatar";

  // const handleSubmit = async (data: FormData) => {
  //   console.log(data);
  //   // if (res) {
  //   //   setIsOpen(false);
  //   // }
  // };

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
          isProcessing={processing}
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

  // this function updates company module
  // use this when other module is available
  const handleCompanyModuleUpdate = async () => {
    if (!selectedGroup) {
      return;
    }

    const selectedCompany = companyTypes.find(
      (type) => type.groupName === selectedGroup
    );

    if (!selectedCompany) return;

    const payload = {
      company_type_id: selectedCompany.id,
    };

    try {
      setUpdatingModule(true);
      if (company_id && selectedGroup) {
        const stringCompanyId = company_id?.toString();
        await selectCompanyModule(stringCompanyId, payload);
      }
    } catch (error) {
      alert(error);
    } finally {
      setUpdatingModule(false);
    }
  };

  //NOTE: this function handle company module change
  const handleCompanyModuleChange = (groupType: string) => {
    if (groupType === "1") {
      setSelectedGroup(groupType);
    } else if (groupType === "2") {
      toast.warning("Facility manager coming soon");
    } else {
      toast.warning("Property developer coming soon");
    }
    // NOTE: Enable this to make other options selectable
    // if (setSelectedGroup && groupType) {
    //   setSelectedGroup(groupType);
    // }
  };

  const { data: restrictedUsers, refetch: refetchUser } =
    useFetch<RestrictedUserApiResponse>(`company/restricted-users`);

  const [selectedRestrictedUser, setSelectedRestrictedUser] =
    useState<RestrictedTenant | null>(null);

  useRefetchOnEvent("restrictedUser", () => refetchUser({ silent: true }));
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [restoring, setRestoring] = useState<boolean>(false);

  const handleRestoreUser = async () => {
    //console.log(propertyId, selectedRestrictedUser)
    if (!propertyId || !selectedRestrictedUser) return;
    const payload = {
      property_id: propertyId,
      user_id: selectedRestrictedUser?.id,
      is_active: true,
    };

    //console.log(payload)
    setRestoring(true);
    try {
      const response = await restrictUserFromGroupChat(payload);
      if (response) {
        toast.success("User restored");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <>
      {/* COMPANY TYPE SETTINGS */}
      <SettingsSection title="Company Default Module">
        <div className="custom-flex-col gap-3">
          {companyTypes.map((type) => (
            <SettingsOthersType
              key={type.id}
              id={type.id}
              title={type.title}
              desc={type.desc}
              icon={type.icon}
              onClick={() => handleCompanyModuleChange(type.id.toString())}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groupName={type.id.toString()}
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
            {cardView?.card?.map((director) => {
              return (
                <UserCard
                  key={director.id}
                  name={director.full_name}
                  email={director.email}
                  phone_number={director.phone_number}
                  picture_url={director.picture}
                  user_tag="Legal Practitioner"
                />
              );
            })}

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
                  heading={modal_states[activeStep].heading}
                  back={activeStep !== "options" ? { handleBack } : undefined}
                >
                  {modal_states[activeStep].content}
                </LandlordTenantModalPreset>
              </ModalContent>
            </Modal>
          </AutoResizingGrid>
        </div>
        <div className="flex justify-end mt-2">
          {/* 
            Enable this when other company module
            is available 
          <SettingsUpdateButton
            
            action={handleCompanyModuleUpdate}
            loading={updatingModule}
          /> */}
          <Button disabled className="bg-opacity-70">
            Update
          </Button>
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
              name={setting.name}
              state={{
                isChecked: messageReviewSettingsState[setting.name],
                setIsChecked: (value) =>
                  handleSetIsCheckedMessageReview(setting.name, value),
              }}
              onChange={handleMessageReviewCheckbox}
            />
          ))}
        </div>

        {/* RESTRICTED USERS */}
        <div className="custom-flex-col flex-wrap gap-6 mt-4">
          <SettingsSectionTitle
            title="Restricted Users"
            desc="Please provide the details of the tenants, occupant, owner, landlord or landlady you wish to restrict from the group chat. Once restricted, they will not have access to chat in the group until the restriction is removed. You can click on the current card to delete or add restrictions."
          />
          <div className="flex gap-4">
            <div className=" flex gap-2">
              {restrictedUsers?.data?.map((user) => {
                return (
                  <Modal key={user.id}>
                    <ModalTrigger className="flex gap-2">
                      <div onClick={() => setSelectedRestrictedUser(user)}>
                        <UserCard
                          className="cursor-pointer"
                          name={user.name}
                          email={user.email}
                          phone_number={user.phone}
                          picture_url={
                            user.picture ?? "/empty/SampleLandlord.jpeg"
                          }
                          user_tag={user?.agent || "web"}
                        />
                      </div>
                    </ModalTrigger>
                    <div className="w-[00px]">
                      <ModalContent>
                        <LandlordTenantModalPreset heading="Restore User">
                          <RestoreRestrictedUserForm
                            submitAction={handleRestoreUser}
                            user={selectedRestrictedUser}
                            loading={restoring}
                          />
                        </LandlordTenantModalPreset>
                      </ModalContent>
                    </div>
                  </Modal>
                );
              })}
            </div>

            <Modal>
              <div className="ml-8 card p-2 flex w-full max-w-[280px] flex-col items-center justify-center border-dotted border-2 rounded-md border-borders-normal">
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
                    <RestrictUserForm submitAction={() => {}} />
                  </LandlordTenantModalPreset>
                </ModalContent>
              </div>
            </Modal>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          {/* <Button onClick={updateMessageReviewSettings} disabled={processingMessageReview}>
            {processingMessageReview? "Updating..." : "Update"}
          </Button> */}
          <SettingsUpdateButton
            action={updateMessageReviewSettings}
            loading={processingMessageReview}
          />
        </div>
      </SettingsSection>

      {/* NOTIFICATIONS */}
      <SettingsSection title="Notifications">
        <div className="custom-flex-col gap-6 mt-4">
          <div className="mt-2 flex flex-col gap-2">
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
            {notificationOtherSettings.map((setting, index) => (
              <SettingsOthersCheckBox
                plan={userPlan}
                key={index}
                name={setting.name}
                title={setting.title}
                desc={setting.desc}
                value={setting.name}
                checked={checkedStates[setting.name] || false}
                onChange={handleCheckedState}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <SettingsUpdateButton
            loading={loadingNotification}
            action={userPlan === "professional" ? saveSettings : undefined}
          />
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
              //id={option.name}
              title={option.title}
              desc={option.desc}
              icon={option.icon}
              name={option.name}
              state={{
                isChecked: resetOptions.includes(option.name),
                setIsChecked: () => {},
              }}
              checked={resetOptions.includes(option.name)}
              //onChange={() => handleResetCheckboxChange(option.name)}
              onChange={handleResetCheckboxChange}
            />
          ))}
        </div>
        <SettingsUpdateButton action={resetSettings} loading={loadingReset} />
      </SettingsSection>
    </>
  );
};

export default Others;
