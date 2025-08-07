"use client";

import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { debounce } from "lodash";

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

import {
  Modal,
  useModal,
  ModalContent,
  ModalTrigger,
} from "@/components/Modal/modal";

import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
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
  updateDirector,
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

import DirectorsForm from "./DirectorsForm";

import Button from "@/components/Form/Button/button";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import SettingsUpdateModal from "@/components/Settings/Modals/settings-update-modal";
import RestoreRestrictedUserForm from "./RestoreRestrictedUserForm";
import { useRouter } from "next/navigation";
import { logout } from "@/app/(onboarding)/auth/data";
import {
  BadgeIconColors,
  staffTierColorMap,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { usePermission } from "@/hooks/getPermission";

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
    title: "Hospitality Manager",
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
  name: string;
  enabled: boolean;
  desc: string;
  icon: React.ReactNode;
}

const messageReviewSettings: MessageReviewSetting[] = [
  {
    title: "Reviews",
    name: "reviews",
    enabled: true,
    desc: "When you click on this option, it means that reviews will not be displayed anymore under your company profile. New potential clients will not be able to see your previous reviews or comment under them.",
    icon: <UserEditIcon />,
  },
  {
    title: "Messages",
    name: "messages",
    enabled: true,
    desc: "When you click on this option, it means that all messaging functionality will be disabled for all users. They will not be able to send messages under your company profile or chat in the property group.",
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
  const router = useRouter();
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
  // const { setIsOpen } = useModal();
  const [selectedModule, setSelectedModule] =
    useState<CompanyModuleSettings | null>(null);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const { company_id } = usePersonalInfoStore();

  const { data: apiDataProfile } = useFetch(`user/profile`);

  console.log(apiDataProfile);

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

  useEffect(() => {
    const handlePopState = () => {
      if (!localStorage.getItem("authToken")) {
        window.location.replace("/auth/sign-in");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
      if (
        response &&
        (resetOptions.includes("resetAll") ||
          resetOptions.includes("appearance"))
      ) {
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        await logout();
        window.location.href = "/auth/sign-in";
      }
    } catch (error) {
    } finally {
      setLoadingReset(false);
    }
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
    // if (userPlan !== "professional") {
    //   return;
    // } else {
    setNotificationSettings((prev) => ({
      ...prev,

      [name]: newValue,
    }));
    //}
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

  const { data: apiData, refetch } =
    useFetch<ApiResponseDirector>(`/directors`);

  const [cardView, setCardView] = useState<DirectorCardProps | null>(null);

  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  const { data: otherSettingResponse } =
    useFetch<CompanySettingsResponse>("/company/settings");

  useEffect(() => {
    if (!otherSettingResponse) return;

    const transformedSettings = transformOtherSetting(otherSettingResponse);
    setDefaultOtherSettings(transformedSettings);

    // Extract notification settings with proper type checking
    const defaultModule =
      transformedSettings?.notification?.company_default_module;
    const moduleValue =
      defaultModule != null && typeof defaultModule !== "undefined"
        ? String(defaultModule)
        : "1";

    setSelectedGroup(moduleValue);
  }, [otherSettingResponse]);

  useEffect(() => {
    // if (!otherSettingResponse || userPlan !== "professional") return;

    // Transform response before setting state
    if (otherSettingResponse) {
      const transformedSettings = transformOtherSetting(otherSettingResponse);
      setDefaultOtherSettings(transformedSettings);

      // Extract notification settings safely
      const notification = transformedSettings?.notification ?? {};

      setNotificationSettings({
        profile_changes: notification.profile_changes ?? true,
        new_messages: notification.new_messages ?? true,
        task_updates: notification.task_updates ?? true,
        profile_approval: notification.profile_approval ?? true,
        property_approval: notification.property_approval ?? true,
        property_vacant: notification.property_vacant ?? true,
        document_creation: notification.document_creation ?? true,
      });

      setCheckedStates({
        sms_notification: notification.sms_notification ?? true,
        email_notification: notification.email_notification ?? true,
        subscription_due_rent_notification:
          notification.subscription_due_rent_notification ?? true,
        general_notification: notification.general_notification ?? true,
      });
    }
  }, [otherSettingResponse, userPlan]);

  useEffect(() => {
    if (planData) {
      const premiumPlan =
        planData?.data?.plan?.plan_name.toLowerCase() ?? "free";
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  useRefetchOnEvent("addNewDirector", () => refetch({ silent: true }));

  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return staffTierColorMap[tier as keyof typeof staffTierColorMap] || "blue";
  };

  useEffect(() => {
    if (apiData) {
      const transCard = transfromToDirectorCards(apiData);
      setCardView(transCard);
    }
  }, [apiData]);

  type DirectorsFormOptions = "options" | "choose-avatar";

  const submitDirectorForm = async (data: FormData) => {
    const fields = [
      "title",
      "professional_title",
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

    // Handle phone number validation
    const phoneNumber = data.get("phone_number");
    const isValidPhone =
      phoneNumber &&
      typeof phoneNumber === "string" &&
      phoneNumber.replace(/[\s+-]/g, "").length > 4; // Minimum length after removing formatting

    fields.forEach((field) => {
      const value = data.get(field);
      if (value) {
        // Only append phone_number if it's valid
        if (field === "phone_number") {
          if (isValidPhone) {
            payload.append(field, value);
          }
        } else {
          payload.append(field, value);
        }
      }
    });

    try {
      setProcessing(true);
      const response = await addNewDirector(payload);

      if (response) {
        toast.success("New director added");
        window.dispatchEvent(new Event("addNewDirector"));

        setIsDirectorModalOpen(false);
        setFormData({
          title: "",
          full_name: "",
          email: "",
          professional_title: "",
          years_in_business: "",
          phone_number: "",
          about_director: "",
          selectedState: "",
          selectedLGA: "",
        });
        setSelectedAvatar(null);
        setActiveStep("options");
        handleBack();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to add director");
      }
    } finally {
      setProcessing(false);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    full_name: "",
    email: "",
    professional_title: "",
    years_in_business: "",
    phone_number: "",
    about_director: "",
    selectedState: "",
    selectedLGA: "",
  });

  const [isOwner, setIsOwner] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const { data: userProfile } = useFetch<any>(`user/profile`);

  useEffect(() => {
    if (userProfile) {
      setIsOwner(userProfile?.data?.user?.is_owner);
      setIsActive(userProfile?.data?.user?.is_active);
    }
  }, [userProfile]);

  const handleFormChange = (field: string, value: string) => {
    if (field === "avatar") {
      setSelectedAvatar((prev) => value as string | null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "selectedState" && { selectedLGA: "" }), // Reset LGA when state changes
      }));
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
          submitAction={submitDirectorForm}
          isProcessing={processing}
          chooseAvatar={() => setActiveStep("choose-avatar")}
          avatar={selectedAvatar}
          setAvatar={React.useCallback<Dispatch<SetStateAction<string | null>>>(
            (value) => {
              setSelectedAvatar(value);
            },
            [setSelectedAvatar]
          )}
          formData={formData}
          onFormChange={handleFormChange}
          is_active={isActive}
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
      if (company_id != null) {
        const stringCompanyId = String(company_id);
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
  const [isUserRestored, setIsUserRestored] = useState(false);
  const [isUserRestricted, setIsUserRestricted] = useState(false);

  const handleRestoreUser = async () => {
    if (!selectedRestrictedUser) return;

    const payload = {
      user_id: selectedRestrictedUser?.id,
      is_active: true,
    };

    setRestoring(true);
    try {
      const response = await restrictUserFromGroupChat(payload);
      if (response) {
        toast.success("User restored");
        setIsUserRestored(false);
      }
    } catch (error) {
    } finally {
      setRestoring(false);
    }
  };

  const [isCloseOnUpdate, setIsCloseOnUpdate] = useState(false);
  const [isCloseOnDelete, setIsCloseOnDelete] = useState(false);

  const handleUpdateDirector = async (data: FormData, id: string) => {
    const fields = [
      "title",
      "professional_title",
      "full_name",
      "alt_email",
      "years_in_business",
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
      const response = await updateDirector(payload, id);

      if (response) {
        toast.success("Director updated successfully");
        window.dispatchEvent(new Event("addNewDirector"));

        setIsCloseOnUpdate(false);
      }
    } catch (error) {
      toast.error("Failed to update director");
    } finally {
      setProcessing(false);
    }
  };

  const [formStateById, setFormStateById] = useState<
    Record<string, Record<string, string>>
  >({});

  useEffect(() => {
    if (cardView?.card) {
      const initialState = cardView.card.reduce((acc, director) => {
        acc[director.id] = {
          id: director.id.toString(),
          full_name: director.name || "",
          email: director.email || "",
          phone_number: director.phone_number || "",
          title: director.title || "",
          professional_title: director.professional_title || "",
          years_in_business: director.years_in_business || "",
          about_director: director.about_director || "",
          avatar: director?.picture || "",
        };
        return acc;
      }, {} as Record<string, Record<string, string>>);

      setFormStateById(initialState);
    }
  }, [cardView?.card]);

  const [activeStepById, setActiveStepById] = useState<
    Record<string, "options" | "choose-avatar">
  >({});

  const setStepForDirector = (
    id: string,
    step: "options" | "choose-avatar"
  ) => {
    setActiveStepById((prev) => ({
      ...prev,
      [id]: step,
    }));
  };

  const [activeDirectorId, setActiveDirectorId] = useState<string | null>(null);

  // PERMISSIONS TO RENDER COMPONENTS
  // 💀😈👿 BE CAREFUL NOT TO SPOIL THE BELOW PERMISSIONS 💀😈👿
  const director_id = usePersonalInfoStore((state) => state.director_id);
  const IS_COMPANY_OWNER = usePersonalInfoStore((state) => state.is_owner);
  const canManageDirectors = usePermission("director", "Add Other Directors");
  const canManageMessagesReviews = usePermission(
    "director",
    "Manage Messages & Reviews"
  );
  const canManageCompanyModules = usePermission(
    "director",
    "Change Company Module"
  );
  const canManageNotificationPreference = usePermission(
    "director",
    "Notification Preferences"
  );
  const canResetSystem = usePermission("director", "Reset System Settings");
  // 💀😈👿 BE CAREFUL NOT TO SPOIL THE ABOVE PERMISSIONS 💀😈👿

  return (
    <>
      <SettingsSection title="Director and Access Control">
        {/* COMPANY DIRECTORS */}

        <div className="custom-flex-col gap-6 mt-4">
          <SettingsSectionTitle
            title="Company Director"
            desc="Please provide the details of the additional user you wish to grant the same Director-level access as your account within the company."
          />
          <div className="">
            <AutoResizingGrid minWidth={284} gap={16}>
              {cardView?.card?.map((director) => {
                if (director.id === director_id) return null;

                const directorId = director.id.toString();
                const formData = formStateById[directorId];
                const activeStep = activeStepById[directorId] || "options";

                const handleFormChange = (field: string, value: string) => {
                  setFormStateById((prev) => ({
                    ...prev,
                    [directorId]: {
                      ...prev[directorId],
                      [field]: value,
                    },
                  }));
                };
                return (
                  <Modal
                    key={director.id}
                    state={{
                      isOpen:
                        isCloseOnUpdate && activeDirectorId === directorId,
                      setIsOpen: (isOpen) => {
                        if (!isOwner) return;
                        setIsCloseOnUpdate(isOpen);
                        setActiveDirectorId(isOpen ? directorId : null);
                      },
                    }}
                  >
                    <ModalTrigger
                      disabled={!isOwner}
                      onClick={() => {
                        if (!isOwner)
                          toast.error(
                            "Only the company owner can edit directors."
                          );
                      }}
                    >
                      <UserCard
                        is_active={director.is_active}
                        key={director.id}
                        name={director.full_name}
                        email={director.email}
                        phone_number={director.phone_number}
                        picture_url={director.picture}
                        user_tag={director.professional_title}
                        badge_color={
                          director.tier_id === 2 ? "gray" : undefined
                        }
                        is_verified={director?.is_verified}
                      />
                    </ModalTrigger>

                    <ModalContent>
                      <LandlordTenantModalPreset
                        heading={
                          activeStep === "options"
                            ? "Director Details"
                            : "Choose Avatar"
                        }
                        back={
                          activeStep === "choose-avatar"
                            ? {
                                handleBack: () =>
                                  setStepForDirector(directorId, "options"),
                              }
                            : undefined
                        }
                      >
                        {activeStep === "options" ? (
                          <DirectorsForm
                            submitAction={(data: any) =>
                              handleUpdateDirector(data, director.id.toString())
                            }
                            isProcessing={processing}
                            chooseAvatar={() =>
                              setStepForDirector(directorId, "choose-avatar")
                            }
                            setAvatar={setSelectedAvatar}
                            avatar={selectedAvatar}
                            formData={formData}
                            onFormChange={handleFormChange}
                            isEditing={true}
                            initialImage={director.picture || ""}
                            setIsCloseUpdate={setIsCloseOnUpdate}
                            is_active={director?.is_active}
                          />
                        ) : (
                          <Avatars
                            onClick={(avatarUrl) => {
                              handleFormChange("avatar", avatarUrl);
                              setSelectedAvatar(avatarUrl);
                              setStepForDirector(directorId, "options");
                            }}
                          />
                        )}
                      </LandlordTenantModalPreset>
                    </ModalContent>
                  </Modal>
                );
              })}
              {(IS_COMPANY_OWNER || canManageDirectors) && (
                <Modal
                  state={{
                    isOpen: isDirectorModalOpen,
                    setIsOpen: setIsDirectorModalOpen,
                  }}
                >
                  <div className="card p-2 flex max-w-[290px] flex-col items-center justify-center border-dotted border-2 rounded-md border-borders-normal">
                    <ModalTrigger>
                      <div className="flex flex-col items-center gap-1 justify-center py-4">
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
                      back={
                        activeStep !== "options" ? { handleBack } : undefined
                      }
                    >
                      {modal_states[activeStep].content}
                    </LandlordTenantModalPreset>
                  </ModalContent>
                </Modal>
              )}
            </AutoResizingGrid>
          </div>
        </div>

        {/* RESTRICTED USERS */}
        <div className="custom-flex-col flex-wrap gap-6 mt-12 mb-6">
          <SettingsSectionTitle
            title="Access Control"
            desc="Select the property and the tenant(s) or occupant(s) you wish to restrict from the group chat.
Once restricted, they will no longer have access to participate in the property's group chat until the restriction is lifted."
          />
          <div className="">
            <AutoResizingGrid minWidth={284} gap={16}>
              {restrictedUsers?.data?.map((user) => {
                return (
                  <Modal
                    key={user.id}
                    state={{
                      isOpen: isUserRestored,
                      setIsOpen: setIsUserRestored,
                    }}
                  >
                    <ModalTrigger className="">
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

                    <ModalContent>
                      <LandlordTenantModalPreset heading="Access Control">
                        <RestoreRestrictedUserForm
                          submitAction={handleRestoreUser}
                          user={selectedRestrictedUser}
                          loading={restoring}
                        />
                      </LandlordTenantModalPreset>
                    </ModalContent>
                  </Modal>
                );
              })}

              <Modal
                state={{
                  isOpen: isUserRestricted,
                  setIsOpen: setIsUserRestricted,
                }}
              >
                <div className="card p-2 flex w-full max-w-[280px] flex-col items-center justify-center border-dotted border-2 rounded-md border-borders-normal">
                  <ModalTrigger>
                    <div className="py-4 flex flex-col items-center gap-1 justify-center">
                      <Image
                        src="/icons/profile.svg"
                        alt="add director"
                        width={30}
                        height={30}
                      />
                      <span> + Restrict User </span>
                    </div>
                  </ModalTrigger>
                </div>
                <div className="rounded-t-xl">
                  <ModalContent>
                    <LandlordTenantModalPreset
                      heading="Access Control"
                      style={{ maxHeight: "80vh", overflow: "visible" }}
                    >
                      <RestrictUserForm
                        submitAction={() => {}}
                        setIsUserRestricted={setIsUserRestricted}
                      />
                    </LandlordTenantModalPreset>
                  </ModalContent>
                </div>
              </Modal>
            </AutoResizingGrid>
          </div>
        </div>
      </SettingsSection>

      {/* COMPANY TYPE SETTINGS */}
      {(canManageCompanyModules || IS_COMPANY_OWNER) && (
        <SettingsSection title="Company Default Module">
          <div className="custom-flex-col gap-8">
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

          <div className="flex justify-end mt-2">
            {/* 
            Enable this when other company module
            is available 
          <SettingsUpdateButton
            
            action={handleCompanyModuleUpdate}
            loading={updatingModule}
          /> */}
            <Button disabled className="bg-opacity-70 mt-4">
              Update
            </Button>
          </div>
        </SettingsSection>
      )}

      {/* MESSAGES & REVIEW SETTINGS */}
      {(canManageMessagesReviews || IS_COMPANY_OWNER) && (
        <SettingsSection title="Messages & Review Settings">
          <div className="custom-flex-col gap-8">
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
      )}

      {/* NOTIFICATIONS */}
      {(canManageNotificationPreference || IS_COMPANY_OWNER) && (
        <SettingsSection title="Notifications">
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

            <div className="toggle flex flex-col gap-6">
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
          <div className="flex justify-end mt-8">
            <SettingsUpdateButton
              loading={loadingNotification}
              action={saveSettings}
              //action={userPlan === "professional" ? saveSettings : undefined}
            />
          </div>
        </SettingsSection>
      )}

      {/* RESET SETTINGS */}
      {(canResetSystem || IS_COMPANY_OWNER) && (
        <SettingsSection title="Reset Settings">
          <h4 className="text-sm text-text-disabled">
            This section enables you to revert all modifications made in the
            settings back to their default state.
          </h4>
          <div className="mt-4 flex flex-col gap-6">
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
          <SettingsUpdateButton
            action={resetSettings}
            loading={loadingReset}
            text="Reset"
          />
        </SettingsSection>
      )}
    </>
  );
};

export default Others;
