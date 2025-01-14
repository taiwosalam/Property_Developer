"use client";

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
  ProfileUploadProps,
  GroupRadioProps,
  ZoomSettingsProps,
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
import {
  ActiveFullScreenIcon,
  F11MinusIcon,
  ResetZoomIcon,
  ZoomMinusIcon,
  ZoomPlusIcon,
} from "@/public/icons/icons";
import Picture from "../Picture/picture";
import ImageBlue from "@/public/icons/image-blue.svg";
import { useEffect, useState } from "react";

export const SettingsVerifiedBadge = ({
  status,
}: {
  status: "verified" | "unverified";
}) => (
  <div
    className={`flex items-center py-[2px] px-2 rounded-full border-[0.1px] ${
      status === "verified" ? "bg-status-success-1" : "bg-[#FF8EE] border-[#FFBB53]"
    }`}
  >
    <p
      className={`text-[10px] ${status === "verified" ? "text-status-success-primary" : "text-[#FFBB53]"} font-normal ${secondaryFont.className}`}
    >
      {status}
    </p>
    <BadgeIcon color={status === "verified" ? "green" : "yellow"} />
  </div>
);

export const SettingsSectionTitle: React.FC<SettingsTitleProps> = ({
  title,
  desc,
}) => (
  <div className="custom-flex-col gap-[2px]">
    {title && (
      <p className="text-text-quaternary dark:text-white text-base font-medium capitalize">
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
  submit,
  action,
  loading,
  next,
}) => {
  const button_props: ButtonProps = {
    size: "base_bold",
    className: "py-[10px] px-8",
    ...(submit && { type: "submit" }),
  };

  const remove_props: ButtonProps = {
    ...button_props,
    variant: "light_red",
  };

  const add_more_props: ButtonProps = {
    ...button_props,
    variant: "sky_blue",
  };

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (next) {
      setModalOpen(true);
    }
  }, [next])

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
      <Button {...button_props} onClick={() => setModalOpen(true)}>
        {loading ? "Please wait..." : text}
      </Button>
      <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          {type === "default" ? (
            <SettingsUpdateModal />
          ) : type === "otp" ? (
            <SettingsOTPFlow isForgetWallet={false} />
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
  checked,
  groupName,
  selectedGroup,
  setSelectedGroup,
}) => {
  const isChecked = selectedGroup === groupName;

  return (
    <div className="flex justify-between">
      <div className="first flex gap-1 items-start">
        <span className="dark:text-white flex-shrink-0 text-black">{icon}</span>
        <div className="flex flex-col">
          <h4 className="text-text-quaternary dark:text-white text-base">
            {title}
          </h4>
          <p className="text-text-disabled text-sm font-normal max-w-[900px]">
            {desc}
          </p>
        </div>
      </div>

      <div className="second flex justify-end items-end h-full">
        <div className="ml-auto">
          {groupName && (
            <GroupRadio
              checked={isChecked}
              groupName={groupName}
              onClick={() => setSelectedGroup && setSelectedGroup(groupName)}
            />
          )}
          {!groupName && (
            <DocumentCheckbox darkText checked={isChecked}>
              {" "}
            </DocumentCheckbox>
          )}
        </div>
      </div>
    </div>
  );
};

export const GroupRadio: React.FC<GroupRadioProps> = ({ checked, onClick }) => {
  return (
    <button className="flex gap-3 text-start rounded-full" onClick={onClick}>
      <div
        className={`rounded-full p-[2px] flex items-center justify-center ${checked ? "border border-blue-600" : ""
          }`}
      >
        <div
          className={`rounded-full w-5 h-5 border min-w-2 min-h-2 border-darkText-2 ${checked ? "bg-blue-600" : ""
            }`}
        ></div>
      </div>
    </button>
  );
};

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
  checked = false,
  value,
  onChange,
}) => (
  <div className="flex justify-between">
    <div className="flex flex-col">
      <h4 className="text-text-quaternary dark:text-white text-base">
        {title}
      </h4>
      <p className="text-text-disabled text-sm font-normal max-w-[900px]">
        {desc}
      </p>
    </div>

    <div className="second flex justify-end items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(value, e.target.checked)} // Call onChange with value and checked state
        />
        <div
          className={`w-11 h-6 ${checked ? "bg-status-success-primary" : "bg-gray-200"
            } peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
        />
      </label>
    </div>
  </div>
);

export const SettingsTenantOccupantTier: React.FC<
  SettingsTenantOccupantTierProps
> = ({ tier, desc, color }) => (
  <div
    className="py-2 px-3 rounded-lg bg-neutral-2 dark:bg-[#3C3D37] custom-flex-col font-normal"
    style={{ boxShadow: "5px 5px 20px 0px rgba(0, 0, 0, 0.02)" }}
  >
    <div className="flex gap-2">
      <p className="text-text-primary dark:text-darkText-1 text-sm capitalize">
        {tier}
      </p>
      <BadgeIcon color={color} />
    </div>
    <p className="text-text-disabled dark:text-darkText-disabled text-xs">
      {desc}
    </p>
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
  profile,
}) => {
  const [showProfessionalMessage, setShowProfessionalMessage] = useState(false);

  const handleClick = () => {
    console.log("value = ", value);
    if (value === "theme2" || value === "theme3") {
      setShowProfessionalMessage(true);
      setTimeout(() => setShowProfessionalMessage(false), 3000);
    } else {
      onSelect(value);
      isSelected = false;
      console.log("isSelected = ", isSelected);
    }
  };

  return (
    <div
      className={`themesWrapper flex items-center flex-wrap gap-4 cursor-pointer relative r`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center">
        <div className="relative max-h-[218px]">
          <Image
            src={img}
            alt="Theme"
            width={1000}
            height={1000}
            className={`w-full h-full object-contain ${isSelected ? "border-4 border-brand-9 rounded-lg" : ""
              }`}
          />
        </div>
        {isSelected && profile && (
          <Link
            href="#"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-9 text-white py-1 px-3 rounded flex items-center justify-center z-20 text-xs sm:text-md"
          >
            Preview Demo
          </Link>
        )}
        {showProfessionalMessage && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
            <p className="text-white text-center px-4 py-2 rounded">
              Sorry, this theme is for Professional Plan subscribers only
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomColorPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
  setModalOpen: (isOpen: boolean) => void;
}> = ({ color, onChange, setModalOpen }) => {
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
            className="w-full p-2 border border-gray-300 rounded mb-4 mt-4"
            placeholder="Enter hex color code"
          />
        </div>
        <div className="flex justify-center items-center w-full px-6">
          <button
            onClick={() => {
              onChange(color);
              setModalOpen(false);
            }}
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
          role="button"
          className={`h-[40px] w-[40px] my-2 rounded-md relative cursor-pointer ${selectedColor?.toLowerCase() === color.toLowerCase()
            ? "border-2 border-blue-500 rounded-md h-[40px] w-[40px]"
            : ""
            }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        >
          {selectedColor?.toLowerCase() === color.toLowerCase() && (
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

export const ProfileUpload: React.FC<ProfileUploadProps> = ({
  onChange,
  preview,
  onClick,
}) => {
  return (
    <div
      className="relative max-w-[100px] rounded-lg overflow-hidden bg-[#F7F7F7] group cursor-pointer"
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <Picture
        size={100}
        fit="contain"
        src={preview}
        alt="official signature"
      />
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}
        className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
      >
        <Picture src={ImageBlue} alt="image icon" size={20} />
        <p className="text-brand-9 text-xs font-normal" onClick={onClick}>
          Change Image
        </p>
      </div>
      <input
        id="file-input"
        name="picture"
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};

export const ZoomSettings: React.FC<ZoomSettingsProps> = ({
  resetZoom,
  increaseZoom,
  decreaseZoom,
  zoomLevel,
  setZoom,
  toggleFullscreen,
  fullScreen,
}) => {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={resetZoom}
        className="p-2 rounded-md border border-gray-300 bg-brand-9 text-white w-[52px] h-[52px] flex items-center justify-center"
      >
        <ResetZoomIcon />
      </button>
      <button
        onClick={increaseZoom}
        className="p-2 rounded-md border border-gray-300 bg-brand-9 text-white w-[52px] h-[52px] flex items-center justify-center"
      >
        <ZoomPlusIcon />
      </button>
      <button
        onClick={decreaseZoom}
        className="p-2 rounded-md border border-gray-300 bg-brand-9 text-white w-[52px] h-[52px] flex items-center justify-center"
      >
        <ZoomMinusIcon />
      </button>
      <div className="flex items-center justify-center max-w-[120px] rounded-md border border-text-label border-dashed px-4">
        <input
          type="number"
          value={zoomLevel}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          className="focus:outline-none dark:bg-darkText-primary w-full flex items-center justify-center"
        />
        <span className="text-black text-center w-full flex items-start justify-start">
          %
        </span>
      </div>
      <button
        onClick={toggleFullscreen}
        className="p-2 rounded-md border border-gray-300 bg-brand-9 text-white w-[52px] h-[52px] flex items-center justify-center"
      >
        {fullScreen ? <ActiveFullScreenIcon /> : <F11MinusIcon />}
      </button>
    </div>
  );
};
