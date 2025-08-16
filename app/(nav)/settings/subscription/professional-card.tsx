"use client";

import React, { useState } from "react";
import {
  BillingTypeButton,
  FeaturesList,
  FeaturesToggle,
  PlanHeader,
  SelectPlanButton,
} from "@/components/Settings/SettingsEnrollment/settings-enrollment-components";
import { CounterButton } from "@/components/Wallet/AddFunds/payment-method";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import NavRequestCallback from "@/components/Nav/NavModals/nav-request-callback";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const features = [
  "All plan Benefits",
  "Unlimited Access",
  "Unlimited Creations",
  "Customize Request",
  "Custom Domain",
  "Cloud Based Storage",
  "Whitelabel/SAAS Options",
  "24/7 Support & Training",
];

interface ProfessionalCardProps {
  showFeatures: boolean;
  setShowFeatures: (showFeatures: boolean) => void;
  autoRenew: boolean;
}

const ProfessionalPlanCard = ({
  showFeatures,
  setShowFeatures,
  autoRenew,
}: ProfessionalCardProps) => {
  const [selectedBilling, setSelectedBilling] = useState<
    "annually" | "monthly" | null
  >(null);
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentExpiryDate = usePersonalInfoStore(
    (state) => state.currentExpiryDate
  );
  const [isHovered, setIsHovered] = useState(false);

  const planTitle = "Professional Plan";
  const isCurrentPlan =
    currentPlan?.split(" ")[0]?.toLowerCase() === "professional";
  const themeColor = isCurrentPlan
    ? "border border-[#01ba4c] text-[#01ba4c]"
    : "border-none text-[#01ba4c]";
  const expiry_date = isCurrentPlan ? currentExpiryDate : undefined;

  // Mock price and other props to align with SettingsEnrollmentCard
  const price = "CONTACT FOR PRICE";
  const lifetimePrice = "CONTACT FOR PRICE";
  const page = "settings"; // Assume settings page for consistency

  // Mock onSelectPlan to handle plan selection (can be replaced with actual logic)
  const onSelectPlan = async () => {
    // Placeholder for actual plan selection logic
    return true;
  };

  return (
    <div
      className={`sm:min-w-[400px] min-w-[320px] min-h-[480px] flex flex-col justify-between rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3C3D37] overflow-hidden shadow-lg transition-all duration-300 ease-in-out ${themeColor}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PlanHeader
        planTitle={planTitle}
        desc="If other available plans don't meet your needs, consider the Professional plan - ideal for established <strong>property manager company</strong>. It offers unlimited access and full brand customization."
        isFree={false}
        themeColor={themeColor}
        expiry_date={expiry_date}
      />

      <div
        className={`priceWrapper w-full flex items-center justify-center flex-col px-4 mt-5`}
      >
        <div className="w-full max-w-[344px] flex-col flex items-center">
          <h3
            className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary dark:text-white`}
          >
            {price}
          </h3>
        </div>

        <div className="flex w-full justify-center my-5 bg-brand-1 dark:bg-[#3C3D37] min-h-[54px] gap-5 py-2 rounded-md">
          <div
            onClick={() => setSelectedBilling("annually")}
            className={`flex flex-col items-center justify-center py-2 px-6 bg-white dark:bg-darkText-primary cursor-pointer rounded-md
              ${
                selectedBilling === "annually"
                  ? "border-2 border-[#01ba4c]"
                  : "border border-transparent"
              }`}
          >
            <button className="flex flex-col items-center text-text-secondary dark:text-darkText-1">
              Pay Annually
            </button>
          </div>

          <div
            onClick={() => setSelectedBilling("monthly")}
            className={`flex flex-col items-center justify-center px-6 bg-white dark:bg-darkText-primary cursor-pointer rounded-md
              ${
                selectedBilling === "monthly"
                  ? "border-2 border-[#01ba4c]"
                  : "border border-transparent"
              }`}
          >
            <button className="flex flex-col items-center text-text-secondary dark:text-darkText-1">
              Pay Monthly
            </button>
          </div>
        </div>

        <div className="counter flex items-center justify-center w-full gap-2">
          <div
            className={`flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md border-text-disabled dark:border-[#3C3D37]`}
          >
            <p
              className={`count pl-1 text-[#000] dark:text-white text-[14px] font-medium tracking-[0px] opacity-50 cursor-not-allowed`}
            >
              0
            </p>
            <div className="btns flex flex-col">
              <CounterButton
                onClick={() => {}}
                icon="/icons/plus.svg"
                alt="plus"
              />
              <CounterButton
                onClick={() => {}}
                icon="/icons/minus.svg"
                alt="minus"
              />
            </div>
          </div>
          <p className={`text-text-secondary opacity-50 cursor-not-allowed`}>
            Total
          </p>
        </div>
      </div>

      <FeaturesToggle
        planTitle={planTitle}
        isFree={false}
        showFeatures={showFeatures}
        getFeaturesText={() => "Professional Features"}
        handleCardClick={() => setShowFeatures(!showFeatures)}
        autoRenew={autoRenew}
      />
      <FeaturesList showFeatures={showFeatures} features={features} />

      <SelectPlanButton
        isFree={false}
        price={price}
        planTitle={planTitle}
        onSelectPlan={onSelectPlan}
        page={"modal"}
        expiry_date={expiry_date}
        hovered={isHovered}
      />
    </div>
  );
};

export default ProfessionalPlanCard;
