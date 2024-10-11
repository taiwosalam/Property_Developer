import type {
  SettingsTitleProps,
  SettingsColorSchemeProps,
  SettingsServicesTagProps,
  SettingsUpdateButtonProps,
  SettingsTenantOccupantTierProps,
  SettingsDirectorTypes,
  SettingsOthersCheckBoxProps,
  SettingsOthersProps,
} from "./types";

// Images
import { Check } from "lucide-react";

// Imports
import clsx from "clsx";
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
