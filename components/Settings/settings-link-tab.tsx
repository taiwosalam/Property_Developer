import React, { act } from "react";
import Link from "next/link";

// Types
import type { SettingsLinkTabProps } from "./types";

// Images
import {
  AppearanceIcon,
  EnrollmentIcon,
  ManagementIcon,
  PreferenceIcon,
  ProfileIcon,
  SecurityIcon,
  ServicesIcon,
  SettingsIcon,
  SubscriptionIcon,
} from "@/public/icons/icons";
import clsx from "clsx";
import Cookies from "js-cookie";
import { getSettingsPath } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { usePermission } from "@/hooks/getPermission";

const SettingsLinkTab: React.FC<
  SettingsLinkTabProps & { className?: string }
> = ({ type, active, className }) => {
  const { role } = useRole();
  const path = getSettingsPath(role);
  const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner) || role === "manager";

  // Permission checks
  const permissions: Record<string, { check: boolean; icon: React.FC }> = {
    company: {
      check:
        usePermission(role, "Modify Company Information") || isCompanyOwner,
      icon: ProfileIcon,
    },
    management: {
      check:
        usePermission(role, "Access Management Settings") || isCompanyOwner,
      icon: ManagementIcon,
    },
    "add-on": {
      check: usePermission(role, "Activate Add-on") || isCompanyOwner,
      icon: SubscriptionIcon,
    },
    services: {
      check: usePermission(role, "Edit Services") || isCompanyOwner,
      icon: ServicesIcon,
    },
    security: { check: true, icon: SecurityIcon },
    subscription: {
      check:
        usePermission(role, "Manage Subscription Settings") || isCompanyOwner,
      icon: EnrollmentIcon,
    },
    appearance: {
      check: usePermission(role, "Customize Appearance") || isCompanyOwner,
      icon: AppearanceIcon,
    },
    others: { check: true, icon: SettingsIcon },
    preference: { check: true, icon: PreferenceIcon },
  };

  // Get the permission config for the current type
  const config = permissions[type];

  // If the user doesn't have permission, don't render the link
  if (!config?.check) return null;

  return (
    <Link
      href={`${path}settings/${type}`}
      className={clsx(
        "py-[14px] w-[138px] flex items-center justify-center gap-1 border-b-[2px] border-solid",
        {
          "bg-white border-brand-9 dark:bg-darkText-primary dark:text-white":
            active,
          "border-transparent hover:bg-neutral-3 hover:dark:bg-darkText-primary":
            !active,
        },
        className
      )}
    >
      <config.icon />
      <p
        className={clsx("text-base font-normal capitalize", {
          "dark:text-white": active,
          "dark:text-darkText-1 dark:hover:text-white": !active,
        })}
      >
        {type}
      </p>
    </Link>
  );
};

export default SettingsLinkTab;
