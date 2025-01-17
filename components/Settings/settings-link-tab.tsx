import React, { act } from "react";
import Link from "next/link";

// Types
import type { SettingsLinkTabProps } from "./types";

// Images
import {
  AppearanceIcon,
  EnrollmentIcon,
  ManagementIcon,
  ProfileIcon,
  SecurityIcon,
  ServicesIcon,
  SettingsIcon,
  SubscriptionIcon,
} from "@/public/icons/icons";
import clsx from "clsx";

const SettingsLinkTab: React.FC<SettingsLinkTabProps & { className?: string }> = ({ type, active, className }) => {
  const active_color = "#fff";
  const default_color = "#000";

  const color = active ? '#000' : '#fff';

  return (
    <Link
      href={`manager/settings/${type}`}
      className={clsx(
        "py-[14px] w-[138px] flex items-center justify-center gap-1 border-b-[2px] border-solid",
        {
          "bg-white border-brand-9 dark:bg-darkText-primary dark:text-white":  active,
          "border-transparent hover:bg-neutral-3 hover:dark:bg-darkText-primary": !active,
        },
        className
      )}
    >
      {type === "profile" ? (
        <ProfileIcon />
      ) : type === "management" ? (
        <ManagementIcon />
      ) : type === "security" ? (
        <SecurityIcon />
      ) : type === "others" ? (
        <SettingsIcon />
      ) : null}
      <p className={`text-base font-normal capitalize ${active ? 'dark:text-white' : 'dark:text-darkText-1 dark:hover:text-white'}`}>
        {type}
      </p>
    </Link>
  );
};

export default SettingsLinkTab;