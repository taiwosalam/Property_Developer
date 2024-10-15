"use client";

import React, { useState } from "react";

// Types
import type { SettingsEnrollmentCardProps } from "../types";
import {
  BillingTypeSelector,
  FeaturesList,
  FeaturesToggle,
  PlanHeader,
  PriceSection,
  QuantityCounter,
  SelectPlanButton,
} from "../SettingsEnrollment/settings-enrollment-components";

const SettingsEnrollmentCard: React.FC<SettingsEnrollmentCardProps> = ({
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
    setShowFeatures(!showFeatures);
  };

  const getFeaturesText = () =>
    isFree
      ? "Free Features"
      : `${
          planTitle.toLowerCase().includes("premium") ? "Premium" : "Basic"
        } Features`;

  const themeColor = isFree
    ? "border-[#38BDF8] text-[#38BDF8]  "
    : "text-brand-9 border-brand-9";

  return (
    <div
      className={`max-w-[420px] flex flex-col justify-between pricingCard bg-white rounded-lg shadow-md hover:border-2 ${themeColor}`}
    >
      <PlanHeader
        planTitle={planTitle}
        desc={desc}
        planFor={planFor}
        isFree={isFree}
        themeColor={themeColor}
      />
      <div
        className={`priceWrapper w-full flex items-center justify-center flex-col px-4 mt-5 ${
          isFree ? "bg-white bg-opacity-40 z-50" : ""
        }`}
      >
        <PriceSection price={price} discount={discount} isFree={isFree} />
        <BillingTypeSelector
          billingType={billingType}
          handleBillingTypeChange={handleBillingTypeChange}
          isFree={isFree}
        />
        <QuantityCounter
          quantity={quantity}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          isFree={isFree}
          billingType={billingType}
        />
      </div>
      <FeaturesToggle
        showFeatures={showFeatures}
        getFeaturesText={getFeaturesText}
        handleCardClick={handleCardClick}
      />
      <FeaturesList showFeatures={showFeatures} features={features} />
      <SelectPlanButton isFree={isFree} />
    </div>
  );
};

export default SettingsEnrollmentCard;
