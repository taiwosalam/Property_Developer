"use client";

import React, { useState } from "react";
import {
  BillingTypeSelector,
  FeaturesList,
  FeaturesToggle,
  PlanHeader,
  PriceSection,
  QuantityCounter,
  SelectPlanButton,
} from "./settings-enrollment-components";

interface SettingsEnrollmentCardProps {
  planTitle: string;
  desc: string;
  planFor?: string;
  price: string;
  discount: string;
  discountText: string;
  duration: string;
  showFeatures: boolean;
  setShowFeatures: (show: boolean) => void;
  features: string[];
  billingType: "monthly" | "yearly";
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  isFree?: boolean;
  onBillingTypeChange: (type: "monthly" | "yearly") => void;
  isLifeTimePlan: boolean;
}

const SettingsEnrollmentCard: React.FC<SettingsEnrollmentCardProps> = ({
  planTitle,
  desc,
  planFor,
  price,
  discount,
  discountText,
  duration,
  showFeatures,
  setShowFeatures,
  features,
  billingType,
  quantity,
  incrementQuantity,
  decrementQuantity,
  isFree = false,
  onBillingTypeChange,
  isLifeTimePlan
}) => {

  const handleBillingTypeChange = (type: "monthly" | "yearly") => {
    if (!isFree) {
      if (type === "yearly") {
        decrementQuantity(); 
      }
      onBillingTypeChange(type);
    }
  };

  const handleCardClick = () => {
    setShowFeatures(!showFeatures);
  };

  const getFeaturesText = () =>
    isFree
      ? "Free Features"
      : `${
          planTitle.toLowerCase().includes("premium") ? "Premium" : "Basic"
        } Features`;

  const getThemeColor = () => {
    if (isFree) {
      return "border-[#38BDF8] text-[#38BDF8]";
    } else if (planTitle.toLowerCase().includes("premium")) {
      return "border-[#8C62FF] text-[#8C62FF] bg-[#F4F9FF]";
    } else {
      return "border-brand-9 text-brand-9";
    }
  };
  

  const themeColor = getThemeColor();

  return (
    <div
      className={`max-w-[344px] flex flex-col justify-between pricingCard rounded-lg bg-white overflow-hidden shadow-lg hover:border hover:border-opacity-100 transition-all duration-300 ease-in-out ${getThemeColor()}`}
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
        <PriceSection 
          price={price} 
          discount={discount} 
          isFree={isFree} 
          duration={duration}
        />
        <BillingTypeSelector
          billingType={billingType}
          handleBillingTypeChange={handleBillingTypeChange}
          isFree={isFree}
          discountText={discountText}
          isLifeTimePlan={isLifeTimePlan}
        />
        <QuantityCounter
          quantity={quantity}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          isFree={isFree}
          billingType={billingType}
          isLifeTimePlan={isLifeTimePlan}
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