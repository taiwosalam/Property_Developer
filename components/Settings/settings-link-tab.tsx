import React from "react";
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

const SettingsLinkTab: React.FC<SettingsLinkTabProps> = ({ type, active }) => {
  const active_color = "#0033C4";
  const default_color = "#3F4247";

  const color = active ? active_color : default_color;

  return (
    <Link
      href={`/settings/${type}`}
      className={clsx(
        "py-[14px] w-[138px] flex items-center justify-center gap-1 border-b-[2px] border-solid",
        {
          "bg-white border-brand-9": active,
          "border-transparent hover:bg-neutral-3": !active,
        }
      )}
    >
      {type === "profile" ? (
        <ProfileIcon color={color} />
      ) : type === "management" ? (
        <ManagementIcon color={color} />
      ) : type === "subscription" ? (
        <SubscriptionIcon color={color} />
      ) : type === "services" ? (
        <ServicesIcon color={color} />
      ) : type === "security" ? (
        <SecurityIcon color={color} />
      ) : type === "enrollment" ? (
        <EnrollmentIcon color={color} />
      ) : type === "appearance" ? (
        <AppearanceIcon color={color} />
      ) : type === "others" ? (
        <SettingsIcon color={color} />
      ) : null}
      <p className="text-base font-normal capitalize" style={{ color }}>
        {type}
      </p>
    </Link>
  );
};

export default SettingsLinkTab;
