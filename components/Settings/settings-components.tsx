"use client";

import type {
  SettingsTitleProps,
  SettingsColorSchemeProps,
  SettingsServicesTagProps,
  SettingsUpdateButtonProps,
  SettingsTenantOccupantTierProps,
  SettingsDirectorTypes,
  SettingsOthersCheckBoxProps,
  SettingsOthersProps,
  SettingsEnrollmentCardProps,
} from "./types";

import { HexColorPicker } from 'react-colorful';
// Images
import { Check } from "lucide-react";

// Imports
import clsx from "clsx";
import Image from "next/image";
import Button from "../Form/Button/button";
import { secondaryFont } from "@/utils/fonts";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { useState } from "react";
import Link from "next/link";

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




export const SettingsEnrollmentCard: React.FC<SettingsEnrollmentCardProps> = ({
  planTitle,
  desc,
  planFor,
  price,
  discount,
  showFeatures,
  setShowFeatures,
  features,
  billingType,
  quantity,
  incrementQuantity,
  decrementQuantity,
  isFree = false,
  onBillingTypeChange,
}) => {
  const handleBillingTypeChange = (type: "monthly" | "yearly") => {
    if (!isFree) {
      onBillingTypeChange(type);
    }
  };

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    free: false,
    basic: false,
    premium: false,
  });

  const handleCardClick = () => {
    const cardName = planTitle.toLowerCase();
    setIsOpen((prevState) => ({
      ...prevState,
      [cardName]: !prevState[cardName],
    }));
    setShowFeatures(!showFeatures);
  };

  const cardMaxHeight = isOpen[planTitle.toLowerCase()] ? 'h-auto' : 'max-h-[500px]';
  const getFeaturesText = () => isFree ? "Free Features" : `${planTitle.toLowerCase().includes("premium") ? "Premium" : "Basic"} Features`;

  const themeColor = isFree ? "border-[#38BDF8]" : "text-brand-9 border-brand-9";

  return (
    <div className={`max-w-[420px] pricingCard bg-white rounded-lg shadow-md hover:border-2 ${themeColor} ${cardMaxHeight}`}>
      <PlanHeader planTitle={planTitle} desc={desc} planFor={planFor} isFree={isFree} themeColor={themeColor} />
      <div className={`priceWrapper w-full flex items-center justify-center flex-col px-4 mt-5 ${isFree ? "bg-white bg-opacity-40 z-50" : ""}`}>
        <PriceSection price={price} discount={discount} isFree={isFree} />
        <BillingTypeSelector billingType={billingType} handleBillingTypeChange={handleBillingTypeChange} isFree={isFree} />
        <QuantityCounter quantity={quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} isFree={isFree} billingType={billingType} />
      </div>
      <FeaturesToggle showFeatures={showFeatures} getFeaturesText={getFeaturesText} handleCardClick={handleCardClick} />
      <FeaturesList showFeatures={showFeatures} features={features} />
      <SelectPlanButton isFree={isFree} />
    </div>
  );
};

// Sub-components
const PlanHeader: React.FC<{ planTitle: string; desc: string; planFor: string; isFree: boolean; themeColor: string }> = ({ planTitle, desc, planFor, isFree, themeColor }) => (
  <div className={`plan-title py-5 px-4 bg-[#F4F9FF] border-b relative ${themeColor}`}>
    <h3 className={`text-[16px] font-medium tracking-[0px] ${themeColor}`}>
      {planTitle.toUpperCase()}
    </h3>
    <p className="text-[14px] font-medium tracking-[0px] text-text-secondary">
      {desc.split(planFor).map((part, index) => 
        index === 0 ? part : <><strong key={index}>{planFor}</strong>{part}</>
      )}
    </p>
    <div className="absolute bottom-0 flex items-center justify-center w-full">
      <div className={`flex items-center justify-center py-[3px] px-10 rounded-t-md ${themeColor}`}></div>
    </div>
  </div>
);

const PriceSection: React.FC<{ price: string; discount: string; isFree: boolean }> = ({ price, discount, isFree }) => (
  <div className="w-full max-w-[344px] flex-col flex items-center">
    <h3 className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary ${isFree ? "text-opacity-40" : ""}`}>
      {isFree ? "₦0.00" : price}
    </h3>
    {!isFree && <p>{discount}</p>}
  </div>
);

const BillingTypeSelector: React.FC<{ billingType: string; handleBillingTypeChange: (type: "monthly" | "yearly") => void; isFree: boolean }> = ({ billingType, handleBillingTypeChange, isFree }) => (
  <div className={`flex w-full justify-center my-5 bg-brand-1 min-h-[54px] gap-5 py-2 rounded-md ${isFree ? "bg-opacity-40" : ""}`}>
    <BillingTypeButton type="yearly" billingType={billingType} handleBillingTypeChange={handleBillingTypeChange} isFree={isFree} />
    <BillingTypeButton type="monthly" billingType={billingType} handleBillingTypeChange={handleBillingTypeChange} isFree={isFree} />
  </div>
);

const BillingTypeButton: React.FC<{ type: "monthly" | "yearly"; billingType: string; handleBillingTypeChange: (type: "monthly" | "yearly") => void; isFree: boolean }> = ({ type, billingType, handleBillingTypeChange, isFree }) => (
  <div className={`flex flex-col items-center justify-center px-6 ${billingType === type ? "border border-brand-9 rounded-md transition-all duration-300 ease-in-out bg-white" : ""}`}>
    <button
      onClick={() => handleBillingTypeChange(type)}
      disabled={isFree}
      className={`${isFree ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isFree ? `Free ${type === "yearly" ? "Annually" : "Monthly"}` : `Pay ${type === "yearly" ? "Yearly" : "Monthly"}`}
    </button>
    {type === "yearly" && (
      <Link href="#" className={`${isFree ? "opacity-50 cursor-not-allowed" : "text-brand-9"}`}>
        {isFree ? "No stress" : "Get Discount"}
      </Link>
    )}
  </div>
);

const QuantityCounter: React.FC<{ quantity: number; incrementQuantity: () => void; decrementQuantity: () => void; isFree: boolean; billingType: string }> = ({ quantity, incrementQuantity, decrementQuantity, isFree, billingType }) => (
  <div className="counter flex items-center justify-center w-full gap-2">
    <div className="flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md">
      <p className="count pl-1 text-[#000] text-[14px] font-medium tracking-[0px]">
        {isFree ? 0 : quantity}
      </p>
      <div className="btns flex flex-col">
        <CounterButton onClick={incrementQuantity} disabled={isFree} icon="/icons/plus.svg" alt="plus" />
        <CounterButton onClick={decrementQuantity} disabled={isFree} icon="/icons/minus.svg" alt="minus" />
      </div>
    </div>
    <p className={`${isFree ? "opacity-50 cursor-not-allowed" : ""}`}> Total {billingType === "monthly" ? "Months" : "Years"} </p>
  </div>
);

const CounterButton: React.FC<{ onClick: () => void; disabled: boolean; icon: string; alt: string }> = ({ onClick, disabled, icon, alt }) => (
  <button className="text-white rounded-md" onClick={onClick} disabled={disabled}>
    <Image src={icon} alt={alt} width={20} height={20} />
  </button>
);

const FeaturesToggle: React.FC<{ showFeatures: boolean; getFeaturesText: () => string; handleCardClick: () => void }> = ({ showFeatures, getFeaturesText, handleCardClick }) => (
  <div className="flex w-full py-5 px-6">
    <button
      className="text-brand-9 text-[18px] font-medium tracking-[0px] flex items-center gap-2"
      onClick={handleCardClick}
    >
      {showFeatures ? getFeaturesText() : "View Features"}
      <Image
        src={showFeatures ? "/icons/up.svg" : "/icons/down.svg"}
        alt="arrow-right"
        width={20}
        height={20}
      />
    </button>
  </div>
);

const FeaturesList: React.FC<{ showFeatures: boolean; features: string[] }> = ({ showFeatures, features }) => (
  showFeatures && (
    <div className="featuresWrapper my-2 flex flex-col gap-2 w-full items-start justify-start px-6">
      <div className="flex items-start gap-2 flex-col">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Image src="/icons/mark.svg" alt="mark" width={16} height={17} />
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </div>
  )
);

const SelectPlanButton: React.FC<{ isFree: boolean }> = ({ isFree }) => (
  <div className="px-6 pb-4">
    <div className={`buynowbtn w-full flex items-center justify-center p-[8px] gap-[10px] rounded-[4px] ${isFree ? "bg-brand-9 bg-opacity-40 cursor-not-allowed" : "bg-brand-9"}`}>
      <button
        className={`text-center text-[14px] font-medium tracking-[0px] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={isFree}
      >
        Select Plan
      </button>
    </div>
  </div>
);



interface ThemeCardProps {
    img: string;
    value: string;
    onSelect: (value: string) => void;
    isSelected: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ img, value, onSelect, isSelected }) => {
    return (
        <div 
            className={`cursor-pointer ${isSelected ? 'border-2 border-[#0033C4]' : ''}`}
            onClick={() => onSelect(value)}
        >
            <Image src={img} alt={value} width={200} height={150} />
        </div>
    );
};



interface CustomColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ color, onColorChange, onColorSelect, onClose }) => {
  const handleSubmit = () => {
    onColorSelect(color);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Choose a Custom Color</h3>
        <HexColorPicker color={color} onChange={onColorChange} />
        <div className="mt-4 flex justify-between">
          <input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="border rounded px-2 py-1 w-28"
          />
          <div className="w-10 h-10 rounded" style={{ backgroundColor: color }} />
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-500 text-white rounded">Apply</button>
        </div>
      </div>
    </div>
  );
};