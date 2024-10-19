import Link from "next/link";
import Image from "next/image";

// Types
import type {
  ThemeCardProps,
  SettingsTitleProps,
  SettingsOthersProps,
  SettingsDirectorTypes,
  SettingsColorSchemeProps,
  SettingsUpdateButtonProps,
  SettingsOthersCheckBoxProps,
  SettingsEnrollmentCardProps,
  SettingsTenantOccupantTierProps,
} from "./types";

import type { ButtonProps } from "../Form/Button/types";

// Images
import { Check } from "lucide-react";

// Imports
import Button from "../Form/Button/button";
import { secondaryFont } from "@/utils/fonts";
import BadgeIcon from "../BadgeIcon/badge-icon";
import SettingsOTPFlow from "./Modals/settings-otp-flow";
import SettingsRemoveFlow from "./Modals/settings-remove-flow";
import SettingsUpdateModal from "./Modals/settings-update-modal";
import SettingsAddMoreFlow from "./Modals/settings-add-more-flow";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SettingsPaymentModal from "./Modals/settings-payment-modal";
import { HexColorPicker } from "react-colorful";
import DocumentCheckbox from "../Documents/DocumentCheckbox/document-checkbox";
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
  remove,
  addMore,
  text = "update",
  type = "default",
}) => {
  const button_props: ButtonProps = {
    size: "base_bold",
    className: "py-[10px] px-8",
  };

  const remove_props: ButtonProps = {
    ...button_props,
    variant: "light_red",
  };

  const add_more_props: ButtonProps = {
    ...button_props,
    variant: "sky_blue",
  };

  return (
    <div className="flex justify-end gap-4">
      {(remove || addMore) && (
        <Modal>
          <ModalTrigger asChild>
            <Button
              {...(remove
                ? { ...remove_props }
                : addMore
                  ? { ...add_more_props }
                  : null)}
            >
              {remove ? "remove" : addMore ? "add more" : ""}
            </Button>
          </ModalTrigger>
          <ModalContent>
            {remove ? (
              <SettingsRemoveFlow />
            ) : addMore ? (
              <SettingsAddMoreFlow />
            ) : null}
          </ModalContent>
        </Modal>
      )}
      <Modal>
        <ModalTrigger asChild>
          <Button {...button_props}>{text}</Button>
        </ModalTrigger>
        <ModalContent>
          {type === "default" ? (
            <SettingsUpdateModal />
          ) : type === "otp" ? (
            <SettingsOTPFlow />
          ) : type === "add domain" ? (
            <SettingsPaymentModal
              limitTransferFields
              title="Personalized Domain Price"
            />
          ) : type === "purchase unit" ? (
            <SettingsPaymentModal
              hideTitleOnProceed
              title="SMS Credit Price"
              annum={{ price: 2000, title: "5999 unit" }}
            />
          ) : type === "feature" ? (
            <SettingsPaymentModal
              hideTitleOnProceed
              annum={{ price: 1000, title: "1 mo" }}
              desc="Paying to feature your company will prioritize all your property listings, it appears first to all users and ranks first for potentials."
            />
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
};

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
          {desc}
        </p>
      </div>
    </div>

    <div className="second flex justify-end">
      <DocumentCheckbox darkText checked={true}>
        {''}
      </DocumentCheckbox>
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
        {desc}
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

export const ThemeCard: React.FC<ThemeCardProps> = ({
  img,
  value,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className={`themesWrapper flex items-center flex-wrap gap-4 cursor-pointer relative`}
      onClick={() => onSelect(value)} 
    >
      {isSelected === false && ( // Conditionally render the background
        <div className="absolute inset-0 bg-white bg-opacity-60 z-10" /> 
      )}
      <div className={`imgWrapper w-full h-full ${isSelected ? "border-2 border-blue-500 rounded-md w-full" : ""}`}>
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

export const CustomColorPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}> = ({ color, onChange, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl pb-6 w-[390px] flex flex-col items-center justify-center">
      <div className="w-full">
        <HexColorPicker
          color={color}
          onChange={onChange}
          className="w-full"
          style={{ width: "390px" }}
        />
      </div>
      <div className="p w-full flex flex-col items-center justify-center">
        <div className="flex gap-2 items-center justify-center w-[246px]">
          <p className="text-sm text-text-primary">Hex</p>
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 mt-4"
            placeholder="Enter hex color code"
          />
        </div>
        <div className="flex justify-center items-center w-full px-6">
          <button
            onClick={onClose}
            className={`w-full py-2 text-white rounded hover:opacity-90 transition-colors`}
            style={{ backgroundColor: color }}
          >
            Set Color
          </button>
        </div>
      </div>
    </div>
  );
};


// WEBBSITE COLOR SCHEME
interface ColorSchemeSelectorProps {
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}





export const WebsiteColorSchemes: React.FC<{
  websiteColorSchemes: string[];
  selectedColor: string | null; 
  onColorSelect: (color: string) => void;
}> = ({ websiteColorSchemes, selectedColor, onColorSelect }) => {
  return (
    <div className="themes flex gap-5 flex-wrap mt-6">
      {websiteColorSchemes.map((color, index) => (
        <div
          key={index}
          className={`h-[40px] w-[40px] my-2 rounded-md relative cursor-pointer ${
            selectedColor === color
              ? "border-2 border-blue-500 rounded-md h-[40px] w-[40px]"
              : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        >
          {selectedColor === color && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/icons/whitemark.svg"
                alt="Selected"
                width={24}
                height={24}
                priority
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
