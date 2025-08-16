import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import { Modal } from "@/components/Modal/modal";
import { ModalContent } from "@/components/Modal/modal";
import SponsorModal from "../Modals/sponsor-modal";
import { AnimatePresence, motion } from "framer-motion";
import { parseFormattedNumber } from "@/app/(nav)/accounting/invoice/create-invoice/data";
import { FormSteps } from "@/app/(onboarding)/auth/types";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import parse from "html-react-parser";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import { useRef, useState, useEffect } from "react";
import { toggleAutoRenewPlan } from "@/app/(nav)/settings/subscription/data";
import { toast } from "sonner";
import NavRequestCallback from "@/components/Nav/NavModals/nav-request-callback";

export const PlanHeader: React.FC<{
  planTitle?: string;
  desc?: string;
  planFor?: string;
  isFree?: boolean;
  themeColor?: string;
  expiry_date?: string;
}> = ({
  planTitle = "",
  desc = "",
  planFor = "",
  isFree = false,
  themeColor = "",
  expiry_date = "",
}) => {
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(customParseFormat);
  const currentExpiryDate = usePersonalInfoStore(
    (state) => state.currentExpiryDate
  );

  const getBgColor = () => {
    if (isFree) return "bg-[#38BDF8] bg-opacity-40";
    if (planTitle.toLowerCase() === "basic plan") return "bg-brand-9";
    if (planTitle.toLowerCase() === "premium plan") return "bg-[#8C62FF]";
    if (planTitle.toLowerCase() === "professional plan") return "bg-[#01ba4c]";
    return "bg-brand-9"; // Default fallback color
  };

  // Format expiry date and determine status
  let formattedExpiryDate: string;
  let statusText: string;

  if (expiry_date === "Lifetime") {
    formattedExpiryDate = "Lifetime";
    statusText = "Active for";
  } else {
    // Try parsing with multiple formats
    const parsedExpiryDate = expiry_date
      ? dayjs(expiry_date, ["YYYY-MM-DD", "DD/MM/YYYY"], true)
      : dayjs(currentExpiryDate, ["YYYY-MM-DD", "DD/MM/YYYY"], true);

    formattedExpiryDate = parsedExpiryDate.isValid()
      ? parsedExpiryDate.format("MMMM D, YYYY")
      : "";
    statusText =
      parsedExpiryDate.isValid() &&
      parsedExpiryDate.isSameOrBefore(dayjs(), "day")
        ? "Expired since"
        : "Active till";
  }

  const upperTitle = planTitle.toUpperCase();
  // const freeTitle = "FREE PLAN (Active until upgraded)";
  const freeTitle = "FREE PLAN";
  const title = !isFree ? upperTitle : freeTitle;

  return (
    <div
      className={`plan-title pt-5 px-4 bg-[#F4F9FF] dark:bg-[#3C3D37] dark:border dark:border-[#3C3D37] border-b  h-[155px] relative ${themeColor}`}
    >
      <h3
        className={`text-[16px] font-medium tracking-[0px] text-[${themeColor}]`}
      >
        {title}
        {formattedExpiryDate &&
          currentPlan
            .toLowerCase()
            .includes(planTitle.toLowerCase().split(" ")[0]) &&
          ` (${statusText} ${formattedExpiryDate})`}
      </h3>
      <p className="text-[14px] font-medium tracking-[0px] text-text-secondary dark:text-darkText-1">
        {parse(desc)}
      </p>
      <div className="absolute left-0 bottom-0 flex items-center justify-center w-full">
        <div
          className={`flex items-center justify-center h-1 w-[50px] rounded-t-[8px] ${getBgColor()}`}
        ></div>
      </div>
    </div>
  );
};

export const PriceSection: React.FC<{
  price?: string;
  discount?: string;
  isFree?: boolean;
  duration?: string;
}> = ({ price = "", discount = "", isFree = false, duration }) => (
  <div className="w-full max-w-[344px] flex-col flex items-center">
    <h3
      className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary dark:text-white`}
    >
      {price}
      {duration && duration.toLowerCase() !== "lifetime" && ` / ${duration}`}
    </h3>
    {!isFree && (
      <p className="text-text-disabled text-sm font-medium tracking-[0px]">
        {discount}
      </p>
    )}
  </div>
);

export const BillingTypeSelector: React.FC<{
  billingType?: string;
  handleBillingTypeChange?: (type: "monthly" | "yearly") => void;
  isFree?: boolean;
  isLifeTimePlan?: boolean;
  discountText?: string;
  planTitle?: string;
}> = ({
  billingType = "monthly",
  handleBillingTypeChange = () => {},
  isFree = false,
  discountText = "",
  isLifeTimePlan = false,
  planTitle = "",
}) => (
  <div
    className={`flex w-full justify-center my-5 bg-brand-1 dark:bg-[#3C3D37] min-h-[54px] gap-5 py-2 rounded-md`}
  >
    <BillingTypeButton
      type="yearly"
      billingType={billingType}
      handleBillingTypeChange={handleBillingTypeChange}
      isFree={isFree}
      discountText={discountText}
      isLifeTimePlan={isLifeTimePlan}
      planTitle={planTitle}
    />
    <BillingTypeButton
      type="monthly"
      billingType={billingType}
      handleBillingTypeChange={handleBillingTypeChange}
      isFree={isFree}
      discountText={discountText}
      isLifeTimePlan={isLifeTimePlan}
      planTitle={planTitle}
    />
  </div>
);

export const BillingTypeButton: React.FC<{
  type: "monthly" | "yearly";
  billingType?: string;
  discountText?: string;
  handleBillingTypeChange?: (type: "monthly" | "yearly") => void;
  isFree?: boolean;
  duration?: string;
  isLifeTimePlan?: boolean;
  planType?: "basic" | "premium" | "free";
  planTitle?: string;
}> = ({
  type,
  billingType = "monthly",
  handleBillingTypeChange = () => {},
  isFree = false,
  discountText = "",
  duration = "",
  isLifeTimePlan,
  planType,
  planTitle = "",
}) => {
  const isYearlyLifeTimePlan =
    type === "yearly" && isLifeTimePlan && planType === "basic";

  const getBgColor = () => {
    if (isFree) return "border border-[#38BDF8] rounded-md bg-opacity-40";
    if (planTitle.toLowerCase() === "basic plan")
      return "border border-brand-9 rounded-md";
    if (planTitle.toLowerCase() === "premium plan")
      return "border border-[#8C62FF] rounded-md";
    return "bg-brand-9 rounded-md"; // Default fallback color
  };

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 ${
        billingType === type && getBgColor()
      }`}
    >
      <button
        onClick={() => handleBillingTypeChange(type)}
        className={`flex flex-col items-center text-text-secondary dark:text-darkText-1 text-base ${
          billingType === type ? "font-bold" : ""
        }`}
      >
        {isFree
          ? `Free ${type === "yearly" ? "Annually" : "Monthly"}`
          : type === "yearly" && isLifeTimePlan
          ? "Pay Once"
          : `Pay ${type === "yearly" ? "Annually" : "Monthly"}`}

        {(type === "yearly" && !isLifeTimePlan) ||
        (type === "yearly" && isLifeTimePlan) ? (
          <span
            className={`text-brand-9 ${
              isFree || (isLifeTimePlan && type === "yearly")
                ? "opacity-50"
                : ""
            }`}
          >
            {isLifeTimePlan && type === "yearly"
              ? "Save stress"
              : billingType === "yearly"
              ? discountText
              : isFree
              ? ""
              : "Get Discount"}
          </span>
        ) : null}
      </button>
    </div>
  );
};

export const QuantityCounter: React.FC<{
  quantity?: number;
  incrementQuantity?: () => void;
  decrementQuantity?: () => void;
  isFree?: boolean;
  billingType?: string;
  isLifeTimePlan?: boolean;
  onPlanChange?: (planType: "basic" | "premium") => void;
}> = ({
  quantity = 1,
  incrementQuantity = () => {},
  decrementQuantity = () => {},
  isFree = false,
  billingType = "monthly",
  isLifeTimePlan,
  onPlanChange,
}) => {
  const handlePlanChange = (planType: "basic" | "premium") => {
    if (onPlanChange) {
      onPlanChange(planType);
    }
  };

  return (
    <div className="counter flex items-center justify-center w-full gap-2">
      <div
        className={`flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md ${
          isFree ? "border-text-disabled dark:border-[#3C3D37]" : ""
        }`}
      >
        <p
          className={`count pl-1 text-[#000] dark:text-white text-[14px] font-medium tracking-[0px] ${
            isFree ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLifeTimePlan ? 0 : isFree ? 0 : quantity}
        </p>
        <div className="btns flex flex-col">
          <CounterButton
            onClick={incrementQuantity}
            disabled={isFree}
            icon="/icons/plus.svg"
            alt="plus"
          />
          <CounterButton
            onClick={decrementQuantity}
            disabled={isFree}
            icon="/icons/minus.svg"
            alt="minus"
          />
        </div>
      </div>
      <p
        className={`${
          isFree ? "text-text-secondary opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Total {billingType === "monthly" ? "Months" : "Years"}
      </p>
    </div>
  );
};

export const CounterButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  icon: string;
  alt: string;
}> = ({ onClick = () => {}, disabled = false, icon, alt }) => (
  <button className="text-white rounded-md" onClick={onClick} type="button">
    <Image src={icon} alt={alt} width={20} height={20} />
  </button>
);

export const FeaturesToggle: React.FC<{
  showFeatures?: boolean;
  getFeaturesText?: () => string;
  handleCardClick?: () => void;
  planTitle: string;
  isFree: boolean;
  autoRenew?: boolean;
}> = ({
  showFeatures = false,
  getFeaturesText = () => "View Features",
  handleCardClick = () => {},
  planTitle = "",
  isFree = false,
  autoRenew = false,
}) => {
  const [autoRenewState, setAutoRenewState] = useState(autoRenew);
  const [isToggling, setIsToggling] = useState(false);
  const clickProcessed = useRef(false);
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);

  // Update local state when prop changes
  useEffect(() => {
    setAutoRenewState(autoRenew);
  }, [autoRenew]);

  const handleToggleAutoRenew = async () => {
    if (isToggling || clickProcessed.current) return;
    clickProcessed.current = true; // Mark click as processed
    setIsToggling(true);
    const newAutoRenew = !autoRenewState;
    setAutoRenewState(newAutoRenew);
    const payload = {
      auto_renew: newAutoRenew ? 1 : 0,
    };
    const SUCCESS_MESSAGE = newAutoRenew
      ? "Auto-Renewal enabled"
      : "Auto-Renewal disabled";
    try {
      const res = await toggleAutoRenewPlan(payload);
      if (res) {
        toast.success(SUCCESS_MESSAGE);
      } else {
        console.error("Failed to toggle Auto-Renewal");
      }
    } catch (error) {
      console.error("Error toggling Auto-Renewal:", error);
    } finally {
      setIsToggling(false);
      window.dispatchEvent(new Event("refetchEnrollments"));
      clickProcessed.current = false; // Reset for next click
    }
  };

  const isCurrentPlan =
    currentPlan &&
    planTitle &&
    currentPlan.split(" ")[0].toLowerCase() ===
      planTitle.split(" ")[0].toLowerCase();

  const showAutoRenew = isCurrentPlan && !isFree;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-2/3 px-6 py-3">
        <button
          className="text-brand-9 text-[18px] font-medium tracking-[0px] flex items-center gap-2"
          onClick={handleCardClick}
        >
          {showFeatures ? getFeaturesText() : "View Features"}
          <motion.div
            animate={{ rotate: showFeatures ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={"/icons/up.svg"}
              alt="arrow-right"
              width={20}
              height={20}
            />
          </motion.div>
        </button>
      </div>
      <div className="flex items-center justify-end w-1/3 ml-auto">
        {showAutoRenew && (
          <DocumentCheckbox
            darkText
            name="auto_renew"
            state={{
              isChecked: autoRenewState,
              setIsChecked: handleToggleAutoRenew,
            }}
          >
            Auto-Renewal
          </DocumentCheckbox>
        )}
      </div>
    </div>
  );
};

export const FeaturesList: React.FC<{
  showFeatures?: boolean;
  features?: string[];
}> = ({ showFeatures = false, features = [] }) => (
  <AnimatePresence>
    {showFeatures && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="featuresWrapper my-2 flex flex-col gap-2 w-full items-start justify-start px-6 overflow-hidden"
      >
        <div className="flex items-start gap-2 flex-col">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }} // Slight slide-in effect for each item
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }} // Staggered animation
              className="flex items-center gap-2"
            >
              <Image src="/icons/mark.svg" alt="mark" width={16} height={17} />
              <p className="text-brand-9 text-sm font-medium tracking-[0px]">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

interface SelectPlanButtonProps {
  isFree?: boolean;
  price: string;
  planTitle: string;
  onSelectPlan?: () => Promise<boolean | undefined>;
  onSelect?: () => void;
  page?: "modal" | "settings";
  changeStep?: (step: FormSteps | number) => void;
  hovered?: boolean;
  expiry_date?: string; // Add expiry_date prop
}

export const SelectPlanButton: React.FC<SelectPlanButtonProps> = ({
  isFree = false,
  price,
  planTitle,
  onSelectPlan,
  onSelect,
  page,
  changeStep,
  hovered,
  expiry_date, // Add expiry_date prop
}) => {
  const subCost = parseFormattedNumber(price);
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentExpiryDate = usePersonalInfoStore(
    (state) => state.currentExpiryDate
  );

  const isExpired = currentExpiryDate
    ? dayjs(currentExpiryDate).isSameOrBefore(dayjs(), "day")
    : false;

  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const thisPlanKeyword = planTitle?.split(" ")[0]?.toLowerCase();
  const isCurrentPlan = currentPlanKeyword === thisPlanKeyword;

  // const isProfessionalPlan = currentPlanKeyword === "professional";
  const isProfessionalPlan = thisPlanKeyword === "professional";

  // Plan rank mapping (higher number = higher rank)
  const planRank: { [key: string]: number } = {
    free: 0,
    basic: 1,
    premium: 2,
    professional: 3,
  };

  // Determine if the current plan is lifetime
  const isCurrentPlanLifetime = expiry_date === "Lifetime" && isCurrentPlan;

  // Determine if the button should be disabled
  const isDowngradeBlocked =
    (currentPlanKeyword &&
      thisPlanKeyword &&
      planRank[currentPlanKeyword] > planRank[thisPlanKeyword]) ||
    (currentPlanKeyword === "premium" && thisPlanKeyword === "basic");

  const isButtonDisabled =
    (isCurrentPlanLifetime &&
      planRank[currentPlanKeyword] >= planRank[thisPlanKeyword]) ||
    isDowngradeBlocked;

  // Determine button text based on plan context
  const buttonText = (() => {
    if (isCurrentPlan) {
      if (currentPlanKeyword === "free") return "Current Plan";
      if (expiry_date === "Lifetime") return "Current Plan"; // Lifetime plans can't be extended
      return "Extend Plan"; // For Basic or Premium, if it's the current plan
    }
    if (currentPlanKeyword === "free") {
      return "Upgrade Plan"; // Free plan users see "Upgrade" for Basic/Premium
    }
    if (currentPlanKeyword === "basic" && thisPlanKeyword === "premium") {
      return "Upgrade Plan"; // Basic plan users see "Upgrade" for Premium
    }
    if (currentPlanKeyword === "premium") {
      return thisPlanKeyword === "premium" ? "Extend Plan" : "Basic Plan"; // Premium users see "Extend" for Premium, "Basic Plan" for others
    }
    return "Select Plan"; // Fallback
  })();

  // Determine if the button should have an action
  const hasAction = !isButtonDisabled;

  // Determine if the modal should be used (only for actionable cases when not in modal page)
  const useModal = page !== "modal" && hasAction && !isFree;

  const notMessage = buttonText === "Extend Plan";

  const handleSelectPlan = async () => {
    if (!hasAction) return; // Prevent action if button is disabled
    if (page === "modal" && changeStep) {
      await onSelectPlan?.();
      window.dispatchEvent(new Event("refetchSubscriptionPlan"));
      window.dispatchEvent(new Event("refetchEnrollments"));
      changeStep(3);
    } else if (!useModal) {
      await onSelect?.(); // Direct action for non-modal actionable scenarios
      window.dispatchEvent(new Event("refetchSubscriptionPlan"));
      window.dispatchEvent(new Event("refetchEnrollments"));
    }
  };

  const displayText =
    isDowngradeBlocked && hovered
      ? "Plan cannot be downgraded"
      : isExpired && hovered && isCurrentPlan && expiry_date !== "Lifetime"
      ? "Renew Plan"
      : !hovered && isCurrentPlan
      ? "Current Plan"
      : buttonText;

  return (
    <div className="px-6 pb-4 flex justify-end">
      <div
        className={`buynowbtn w-full flex items-center justify-center p-[8px] gap-[10px] rounded-[4px] ${
          isFree ? "bg-brand-9 bg-opacity-40" : "bg-brand-9"
        } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {page === "modal" ? (
          <button
            className="text-center text-[14px] w-full text-white font-medium tracking-[0px]"
            onClick={hasAction ? handleSelectPlan : undefined}
            disabled={isButtonDisabled}
          >
            {displayText}
          </button>
        ) : useModal ? (
          <Modal>
            <ModalTrigger asChild className="w-full text-white">
              <button
                className="text-center text-[14px] w-full text-white font-medium tracking-[0px]"
                onClick={hasAction ? handleSelectPlan : undefined}
                disabled={isButtonDisabled}
              >
                {displayText}
              </button>
            </ModalTrigger>
            <ModalContent>
              {!isProfessionalPlan ? (
                <SponsorModal
                  page="subscription"
                  count={10}
                  cost={subCost ?? 0}
                  message={!notMessage}
                  onSubmit={onSelectPlan}
                  onSelect={onSelect}
                />
              ) : (
                <NavRequestCallback />
              )}
            </ModalContent>
          </Modal>
        ) : (
          <button
            className="text-center text-[14px] w-full text-white font-medium tracking-[0px]"
            onClick={hasAction ? handleSelectPlan : undefined}
            disabled={isButtonDisabled}
          >
            {displayText}
          </button>
        )}
      </div>
    </div>
  );
};
