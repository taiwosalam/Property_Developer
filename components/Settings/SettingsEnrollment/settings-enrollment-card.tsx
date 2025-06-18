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
import { FormSteps } from "@/app/(onboarding)/auth/types";
import { usePersonalInfoStore } from "@/store/personal-info-store";

interface SettingsEnrollmentCardProps {
  planTitle: string;
  desc: string;
  planFor?: string;
  price: string;
  lifetimePrice: string | number;
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
  onSelectPlan?: () => Promise<boolean | undefined>;
  onSelect?: () => void;
  page?: "modal" | "settings";
  changeStep?: (step: FormSteps | number) => void;
}

const SettingsEnrollmentCard: React.FC<SettingsEnrollmentCardProps> = ({
  planTitle,
  desc,
  planFor,
  price,
  lifetimePrice,
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
  isLifeTimePlan,
  onSelectPlan,
  onSelect,
  page,
  changeStep,
}) => {
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const thisPlanKeyword = planTitle?.split(" ")[0]?.toLowerCase();
  const isCurrentPlan = currentPlanKeyword === thisPlanKeyword;

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
    const baseClasses = isCurrentPlan ? "border" : "border-none";
    if (isFree) {
      return `${baseClasses} border-[#38BDF8] dark:border-gray-800 text-[#38BDF8]`;
    } else if (planTitle.toLowerCase().includes("premium")) {
      return `${baseClasses} border-[#8C62FF] dark:border-gray-400 text-[#8C62FF] bg-[#F4F9FF]`;
    } else {
      return `${baseClasses} border-brand-9 text-brand-9 dark:border-gray-400`;
    }
  };

  const themeColor = getThemeColor();

  return (
    <div
      className={`min-w-[400px] flex flex-col justify-between pricingCard rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3C3D37] overflow-hidden shadow-lg hover:border hover:border-opacity-100 transition-all duration-300 ease-in-out ${getThemeColor()}`}
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
          isFree ? "bg-white bg-opacity-40 z-50 dark:bg-darkText-primary" : ""
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
      <SelectPlanButton
        isFree={isFree}
        price={duration === "lifetime" ? String(lifetimePrice) : price}
        planTitle={planTitle}
        onSelectPlan={page === "modal" ? onSelect : (onSelectPlan as any)}
        page={page}
        changeStep={changeStep}
      />
    </div>
  );
};

export default SettingsEnrollmentCard;
