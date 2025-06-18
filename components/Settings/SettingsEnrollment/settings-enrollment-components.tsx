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

export const PlanHeader: React.FC<{
  planTitle?: string;
  desc?: string;
  planFor?: string;
  isFree?: boolean;
  themeColor?: string;
}> = ({
  planTitle = "",
  desc = "",
  planFor = "",
  isFree = false,
  themeColor = "",
}) => {
  const getBgColor = () => {
    if (isFree) return "bg-[#38BDF8] bg-opacity-40";
    if (planTitle.toLowerCase() === "basic plan") return "bg-brand-9";
    if (planTitle.toLowerCase() === "premium plan") return "bg-[#8C62FF]";
    return "bg-brand-9"; // Default fallback color
  };

  return (
    <div
      className={`plan-title pt-5 px-4 bg-[#F4F9FF] dark:bg-[#3C3D37] dark:border dark:border-[#3C3D37] border-b  h-[155px] relative ${themeColor}`}
    >
      <h3
        className={`text-[16px] font-medium tracking-[0px] text-[${themeColor}]`}
      >
        {planTitle.toUpperCase()}
      </h3>
      <p className="text-[14px] font-medium tracking-[0px] text-text-secondary dark:text-darkText-1">
        {desc.split(planFor).map((part, index) =>
          index === 0 ? (
            part
          ) : (
            <>
              <strong key={index}>{planFor}</strong>
              {part}
            </>
          )
        )}
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
      className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary dark:text-white ${
        isFree ? "text-opacity-40 dark:text-opacity-40" : ""
      }`}
    >
      {isFree ? "₦0.00" : price}
      {duration &&
        duration.toUpperCase() !== "LIFE TIME PLAN" &&
        ` / ${duration}`}
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
  discountText?: string;
  isLifeTimePlan?: boolean;
}> = ({
  billingType = "monthly",
  handleBillingTypeChange = () => {},
  isFree = false,
  discountText = "",
  isLifeTimePlan = false,
}) => (
  <div
    className={`flex w-full justify-center my-5 bg-brand-1 dark:bg-[#3C3D37] min-h-[54px] gap-5 py-2 rounded-md ${
      isFree ? "bg-opacity-40 dark:bg-opacity-40" : ""
    }`}
  >
    <BillingTypeButton
      type="yearly"
      billingType={billingType}
      handleBillingTypeChange={handleBillingTypeChange}
      isFree={isFree}
      discountText={discountText}
      isLifeTimePlan={isLifeTimePlan}
    />
    <BillingTypeButton
      type="monthly"
      billingType={billingType}
      handleBillingTypeChange={handleBillingTypeChange}
      isFree={isFree}
      discountText={discountText}
      isLifeTimePlan={isLifeTimePlan}
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
}> = ({
  type,
  billingType = "monthly",
  handleBillingTypeChange = () => {},
  isFree = false,
  discountText = "",
  duration = "",
  isLifeTimePlan,
  planType,
}) => {
  const isYearlyLifeTimePlan =
    type === "yearly" && isLifeTimePlan && planType === "basic";

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 ${
        billingType === type
          ? "border rounded-md transition-all duration-300 ease-in-out " +
            (isFree
              ? "border-text-disabled dark:border-[#3C3D37]"
              : "border-brand-9 bg-white dark:bg-darkText-primary")
          : ""
      }`}
    >
      <button
        onClick={() => handleBillingTypeChange(type)}
        disabled={isFree}
        className={`flex flex-col items-center ${
          isFree
            ? "text-text-secondary dark:text-darkText-1 opacity-50 cursor-not-allowed text-sm"
            : "text-text-secondary dark:text-darkText-1 text-base"
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
            className={`${
              isFree
                ? "text-text-secondary dark:text-darkText-1 opacity-50 cursor-not-allowed"
                : "text-brand-9"
            }`}
          >
            {isFree || (isLifeTimePlan && type === "yearly")
              ? "Save stress"
              : billingType === "yearly"
              ? discountText
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
}> = ({
  showFeatures = false,
  getFeaturesText = () => "View Features",
  handleCardClick = () => {},
}) => (
  <div className="flex w-full px-6 py-4">
    <button
      className="text-brand-9 text-[18px] font-medium tracking-[0px] flex items-center gap-2"
      onClick={handleCardClick}
    >
      {showFeatures ? getFeaturesText() : "View Features"}
      <motion.div
        animate={{ rotate: showFeatures ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Image src={"/icons/up.svg"} alt="arrow-right" width={20} height={20} />
      </motion.div>
    </button>
  </div>
);

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
}

export const SelectPlanButton: React.FC<SelectPlanButtonProps> = ({
  isFree = false,
  price,
  planTitle,
  onSelectPlan,
  onSelect,
  page,
  changeStep,
}) => {
  const subCost = parseFormattedNumber(price);
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);

  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const thisPlanKeyword = planTitle?.split(" ")[0]?.toLowerCase();
  const isCurrentPlan = currentPlanKeyword === thisPlanKeyword;

  // Determine if the button should be disabled
  const isDisabled = (() => {
    if (isFree) return true; // Free plan button is always disabled
    if (currentPlanKeyword === "premium" && thisPlanKeyword === "basic") {
      // Disable Basic plan button for Premium users (no downgrading)
      return true;
    }
    return false; // Enable buttons for extend (current plan) or upgrade (higher-tier plans)
  })();

  // Determine button text
  const buttonText = (() => {
    if (isCurrentPlan) {
      if (currentPlanKeyword === "free") return "Current Plan";
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

  const handleSelectPlan = () => {
    if (page === "modal" && changeStep) {
      onSelectPlan?.();
      changeStep(3);
    }
  };
  return (
    <div className="px-6 pb-4 flex justify-end">
      <div
        className={`buynowbtn w-full flex items-center justify-center p-[8px] gap-[10px] rounded-[4px] ${
          isFree ? "bg-brand-9 bg-opacity-40 cursor-not-allowed" : "bg-brand-9"
        }`}
      >
        {page === "modal" ? (
          <button
            className={`text-center text-[14px] w-full text-white font-medium tracking-[0px] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isDisabled}
            onClick={handleSelectPlan}
          >
            {buttonText}
          </button>
        ) : (
          <Modal>
            <ModalTrigger asChild className="w-full text-white">
              <button
                className={`text-center text-[14px] w-full text-white font-medium tracking-[0px] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isDisabled}
              >
                {buttonText}
              </button>
            </ModalTrigger>
            <ModalContent>
              <SponsorModal
                page="subscription"
                count={10}
                cost={subCost ?? 0}
                message={true}
                onSubmit={onSelectPlan}
                onSelect={onSelect}
              />
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  );
};
