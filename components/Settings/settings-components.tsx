import type {
  SettingsTitleProps,
  SettingsColorSchemeProps,
  SettingsServicesTagProps,
  SettingsUpdateButtonProps,
  SettingsTenantOccupantTierProps,
  SettingsDirectorTypes,
  SettingsOthersCheckBoxProps,
  SettingsOthersProps,
  ThemeCardProps,
} from "./types";

// Images
import { Check } from "lucide-react";

// Imports
import clsx from "clsx";
import Image from "next/image";
import Button from "../Form/Button/button";
import { secondaryFont } from "@/utils/fonts";
import BadgeIcon from "../BadgeIcon/badge-icon";

export const SettingsVerifiedBadge = () => (
  <div className="flex items-center py-[2px] px-2 rounded-full bg-status-success-1">
    <p
      className={`text-[10px] text-status-success-primary font-normal ${secondaryFont.className}`}
    >
      Verified
    </p>
    <BadgeIcon color="green" />
  </div>
);

export const SettingsSectionTitle: React.FC<SettingsTitleProps> = ({
  title,
  desc,
}) => (
  <div className="custom-flex-col gap-[2px]">
    {title && (
      <p className="text-text-quaternary text-base font-medium capitalize">
        {title}
      </p>
    )}
    {desc && <p className="text-text-disabled text-sm font-normal">{desc}</p>}
  </div>
);

export const SettingsUpdateButton: React.FC<SettingsUpdateButtonProps> = ({
  text = "update",
}) => (
  <div className="flex justify-end">
    <Button size="base_bold" className="py-[10px] px-8">
      {text}
    </Button>
  </div>
);

export const SettingsOthersType: React.FC<SettingsOthersProps> = ({
  title,
  desc,
  icon,
}) => (
  <div className="flex justify-between">
    <div className="first flex gap-1 items-start">
      <Image src={icon} width={24} height={24} alt="user" />
      <div className="flex flex-col">
        <h4 className="text-text-quaternary text-base"> {title} </h4>
        <p className="text-text-disabled text-sm font-normal max-w-[900px]">
          {" "}
          {desc}{" "}
        </p>
      </div>
    </div>

    <div className="second flex justify-end">
      <input type="checkbox" />
    </div>
  </div>
);

export const SettingsColorScheme: React.FC<SettingsColorSchemeProps> = ({
  color,
  active,
}) => (
  <div
    style={{ backgroundColor: color }}
    className="w-10 h-10 rounded-lg flex items-center justify-center"
  >
    {active && <Check color="white" scale={16} />}
  </div>
);

export const SettingsOthersCheckBox: React.FC<SettingsOthersCheckBoxProps> = ({
  title,
  desc,
}) => (
  <div className="flex justify-between">
    <div className="flex flex-col">
      <h4 className="text-text-quaternary text-base"> {title} </h4>
      <p className="text-text-disabled text-sm font-normal max-w-[900px]">
        {" "}
        {desc}{" "}
      </p>
    </div>

    <div className="second flex justify-end items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-success-primary" />
      </label>
    </div>
  </div>
);

export const SettingsTenantOccupantTier: React.FC<
  SettingsTenantOccupantTierProps
> = ({ tier, desc, color }) => (
  <div
    className="py-2 px-3 rounded-lg bg-neutral-2 custom-flex-col font-normal"
    style={{ boxShadow: "5px 5px 20px 0px rgba(0, 0, 0, 0.02)" }}
  >
    <div className="flex gap-2">
      <p className="text-text-primary text-sm capitalize">{tier}</p>
      <BadgeIcon color={color} />
    </div>
    <p className="text-[#606060] text-xs">{desc}</p>
  </div>
);

export const DirectorCard: React.FC<SettingsDirectorTypes> = ({
  name,
  email,
  desc,
  position,
  img,
  phone,
  icon,
}) => (
  <div className="card p-2 flex justify-between max-w-[397px] border rounded-md bg-[#F9F9F9] border-brand-tertiary">
    <div className="flex items-center gap-4">
      <div className="imageWrapper max-h-[120px] max-w-[120px] rounded-md">
        <Image
          src={img}
          alt="User Pics"
          width={500}
          height={500}
          className="w-full h-full object-contain rounded-md"
        />
      </div>
      <div className="flex flex-col relative">
        <div className="flex gap-2 items-center">
          <h4 className="text-black font-bold leading-3 text-ellipsis line-clamp-1">
            {" "}
            {name}{" "}
          </h4>
          <Image
            alt="companyy_irector"
            src={`${icon ? icon : "/icons/unverified.svg"}`}
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <p className="text-sm"> {email} </p>
        {position && (
          <p className="text-xs text-brand-10 font-normal my-2"> {position} </p>
        )}
        {(!position || position === "") && (
          <div className="py-1 my-2 max-w-[100px] bg-status-success-1 rounded-md text-center text-status-success-3">
            mobile
          </div>
        )}
        <p className="text-md text-[#8D8D8D]"> {phone} </p>
      </div>
    </div>
    <p className="text-[#606060] text-xs">{desc}</p>
  </div>
);

export const SettingsServicesTag: React.FC<SettingsServicesTagProps> = ({
  active,
  children,
}) => (
  <div
    className={clsx("py-3 px-4 rounded-[4px]", {
      "bg-brand-1": active,
      "bg-neutral-3 opacity-50": !active,
    })}
  >
    <p
      className={clsx("text-sm font-normal", {
        "text-black": !active,
        "text-brand-9": active,
      })}
    >
      {children}
    </p>
  </div>
);

export const ThemeCard: React.FC<ThemeCardProps> = ({
  img,
  value,
  onSelect,
}) => {
  return (
    <div
      className="themesWrapper mt-4 flex items-center flex-wrap gap-4 cursor-pointer"
      onClick={() => onSelect(value)} // Trigger onSelect with value on click
    >
      <div className="imgWrapper w-[218px] h-[218px]">
        <Image
          src={img}
          alt="Theme"
          width={1000}
          height={1000}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
