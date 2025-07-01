"use client";

import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import NavRequestCallback from "@/components/Nav/NavModals/nav-request-callback";
import {
  BillingTypeButton,
  FeaturesList,
  FeaturesToggle,
  PlanHeader,
} from "@/components/Settings/SettingsEnrollment/settings-enrollment-components";
import { CounterButton } from "@/components/Wallet/AddFunds/payment-method";
import { useState } from "react";

const features = [
  "Unlimited Property Creations",
  "All plan Benefits",
  "Customize Request",
  "unlimited Access",
  "Custom Domain",
  "No Maximum Creation",
  "Whitelabel/SAAS Options",
  "24/7 Support Training",
];

interface ProfessionalCardProps {
  showFeatures: boolean;
  setShowFeatures: (showFeatures: boolean) => void;
}

const ProfessionalPlanCard = ({
  showFeatures,
  setShowFeatures,
}: ProfessionalCardProps) => {
  const [selectedBilling, setSelectedBilling] = useState<
    "annually" | "monthly" | null
  >(null);
  return (
    <div
      className={`min-w-[400px] min-h-[480px] flex flex-col justify-between rounded-lg bg-white dark:bg-darkText-primary overflow-hidden shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div
        className={`plan-title pt-5 px-4 bg-[#F4F9FF] dark:bg-[#3C3D37] dark:border dark:border-[#3C3D37] border-b  h-[155px] relative bg-[#01ba4c]`}
      >
        <h3 className={`text-[16px] font-medium tracking-[0px] text-[#01ba4c]`}>
          {/* PROFESSIONAL PLAN (Active till 12/02/2025) TODO: CHANGE TO THIS  LATER */}
          PROFESSIONAL PLAN
        </h3>
        <p className="text-[14px] font-medium tracking-[0px] text-text-secondary dark:text-darkText-1">
          If other available plans don&apos;t meet your needs, consider the
          Professional plan - ideal for established{" "}
          <strong>property manager company</strong>. It offers unlimited access
          and full brand customization.
        </p>
        <div className="absolute left-0 bottom-0 flex items-center justify-center w-full">
          <div
            className={`flex items-center justify-center bg-[#01ba4c] h-1 w-[50px] rounded-t-[8px]`}
          ></div>
        </div>
      </div>

      <div
        className={`priceWrapper w-full flex items-center justify-center flex-col px-4 mt-5`}
      >
        <div className="w-full max-w-[344px] flex-col flex items-center">
          <h3
            className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary dark:text-white`}
          >
            CONTACT FOR PRICE
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

        {/* COUNTER */}
        <div className="counter flex items-center justify-center w-full gap-2">
          <div
            className={`flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md "border-text-disabled dark:border-[#3C3D37]
            }`}
          >
            <p
              className={`count pl-1 text-[#000] dark:text-white text-[14px] font-medium tracking-[0px] opacity-50 cursor-not-allowed
              }`}
            >
              {0}
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

      {/* FEATURES */}
      <FeaturesToggle
        planTitle=""
        isFree={false}
        showFeatures={showFeatures}
        getFeaturesText={() => "Professional Features"}
        handleCardClick={() => setShowFeatures(!showFeatures)}
      />
      <FeaturesList showFeatures={showFeatures} features={features} />

      <div className="px-6 pb-4 w-full flex justify-end items-center">
        <Modal>
          <ModalTrigger asChild>
            <Button
              className="w-full py-2 flex items-center justify-center"
              size="base_medium"
            >
              Upgrade Plan
            </Button>
          </ModalTrigger>
          <ModalContent>
            <NavRequestCallback />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ProfessionalPlanCard;
