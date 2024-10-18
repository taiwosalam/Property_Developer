
import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import { Modal } from "@/components/Modal/modal";
import { ModalContent } from "@/components/Modal/modal";

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
      className={`plan-title pt-5 px-4 bg-[#F4F9FF] border-b  h-[155px] relative ${themeColor}`}
    >
      <h3
        className={`text-[16px] font-medium tracking-[0px] text-[${themeColor}]`}
      >
        {planTitle.toUpperCase()}
      </h3>
      <p className="text-[14px] font-medium tracking-[0px] text-text-secondary">
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
      className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary ${
        isFree ? "text-opacity-40" : ""
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
    className={`flex w-full justify-center my-5 bg-brand-1 min-h-[54px] gap-5 py-2 rounded-md ${
      isFree ? "bg-opacity-40" : ""
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
            (isFree ? "border-text-disabled" : "border-brand-9 bg-white")
          : ""
      }`}
    >
      <button
        onClick={() => handleBillingTypeChange(type)}
        disabled={isFree}
        className={`flex flex-col items-center ${
          isFree
            ? "text-text-secondary opacity-50 cursor-not-allowed text-sm"
            : "text-text-secondary text-base"
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
                ? "text-text-secondary opacity-50 cursor-not-allowed"
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

// export const QuantityCounter: React.FC<{
//   quantity?: number;
//   incrementQuantity?: () => void;
//   decrementQuantity?: () => void;
//   isFree?: boolean;
//   billingType?: string;
//   isLifeTimePlan?: boolean;
// }> = ({
//   quantity = 1,
//   incrementQuantity = () => {},
//   decrementQuantity = () => {},
//   isFree = false,
//   billingType = "monthly",
//   isLifeTimePlan,
// }) => (
//   <div className="counter flex items-center justify-center w-full gap-2">
//     <div className="flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md">
//       <p
//         className={`count pl-1 text-[#000] text-[14px] font-medium tracking-[0px] ${
//           isFree ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         {isLifeTimePlan ? 0 : isFree ? 0 : quantity}
//       </p>
//       <div className="btns flex flex-col">
//         <CounterButton
//           onClick={incrementQuantity}
//           disabled={isFree}
//           icon="/icons/plus.svg"
//           alt="plus"
//         />
//         <CounterButton
//           onClick={decrementQuantity}
//           disabled={isFree}
//           icon="/icons/minus.svg"
//           alt="minus"
//         />
//       </div>
//     </div>
//     <p
//       className={`${
//         isFree ? "text-text-secondary opacity-50 cursor-not-allowed" : ""
//       }`}
//     >
//       Total {billingType === "monthly" ? "Months" : "Years"}
//     </p>
//   </div>
// );




export const QuantityCounter: React.FC<{
  quantity?: number;
  incrementQuantity?: () => void;
  decrementQuantity?: () => void;
  isFree?: boolean;
  billingType?: string;
  isLifeTimePlan?: boolean;
  onPlanChange?: (planType: "basic" | "premium") => void; // New prop to handle plan changes
}> = ({
  quantity = 1,
  incrementQuantity = () => {},
  decrementQuantity = () => {},
  isFree = false,
  billingType = "monthly",
  isLifeTimePlan,
  onPlanChange, // New prop to handle plan changes
}) => {
  const handlePlanChange = (planType: "basic" | "premium") => {
    if (onPlanChange) {
      onPlanChange(planType); // Call the function to handle plan change
    }
  };

  return (
    <div className="counter flex items-center justify-center w-full gap-2">
      <div className="flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md">
        <p
          className={`count pl-1 text-[#000] text-[14px] font-medium tracking-[0px] ${
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
  <button className="text-white rounded-md" onClick={onClick}>
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
  <div className="flex w-full px-6">
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

export const FeaturesList: React.FC<{
  showFeatures?: boolean;
  features?: string[];
}> = ({ showFeatures = false, features = [] }) =>
  showFeatures && (
    <div className="featuresWrapper my-2 flex flex-col gap-2 w-full items-start justify-start px-6">
      <div className="flex items-start gap-2 flex-col">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Image src="/icons/mark.svg" alt="mark" width={16} height={17} />
            <p className="text-brand-9 text-sm font-medium tracking-[0px]">
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

export const SelectPlanButton: React.FC<{ isFree?: boolean }> = ({
  isFree = false,
}) => (
  <div className="px-6 pb-4 flex justify-end">
    <div
      className={`buynowbtn w-full flex items-center justify-center p-[8px] gap-[10px] rounded-[4px] ${
        isFree ? "bg-brand-9 bg-opacity-40 cursor-not-allowed" : "bg-brand-9"
      }`}
    >
      <Modal>
        <ModalTrigger asChild>
          <button
            className={`text-center text-[14px] font-medium tracking-[0px] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isFree}
          >
            Select Plan
          </button>
        </ModalTrigger>
        <ModalContent>
          <AddFundsModal />
        </ModalContent>
      </Modal>
    </div>
  </div>
);
