import Link from "next/link";
import Image from "next/image";

export const PlanHeader: React.FC<{
  planTitle: string;
  desc: string;
  planFor: string;
  isFree: boolean;
  themeColor: string;
}> = ({ planTitle, desc, planFor, isFree, themeColor }) => (
  <div
    className={`plan-title py-5 px-4 bg-[#F4F9FF] border-b relative ${themeColor}`}
  >
    <h3 className={`text-[16px] font-medium tracking-[0px] ${themeColor}`}>
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
    <div className="absolute bottom-0 flex items-center justify-center w-full">
      <div
        className={`flex items-center justify-center py-[3px] px-10 rounded-t-md ${themeColor}`}
      ></div>
    </div>
  </div>
);

export const PriceSection: React.FC<{
  price: string;
  discount: string;
  isFree: boolean;
}> = ({ price, discount, isFree }) => (
  <div className="w-full max-w-[344px] flex-col flex items-center">
    <h3
      className={`text-[20px] font-bold tracking-[0px] leading-[150%] text-text-secondary ${
        isFree ? "text-opacity-40" : ""
      }`}
    >
      {isFree ? "₦0.00" : price}
    </h3>
    {!isFree && <p>{discount}</p>}
  </div>
);

export const BillingTypeSelector: React.FC<{
  billingType: string;
  handleBillingTypeChange: (type: "monthly" | "yearly") => void;
  isFree: boolean;
}> = ({ billingType, handleBillingTypeChange, isFree }) => (
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
    />
    <BillingTypeButton
      type="monthly"
      billingType={billingType}
      handleBillingTypeChange={handleBillingTypeChange}
      isFree={isFree}
    />
  </div>
);

export const BillingTypeButton: React.FC<{
  type: "monthly" | "yearly";
  billingType: string;
  handleBillingTypeChange: (type: "monthly" | "yearly") => void;
  isFree: boolean;
}> = ({ type, billingType, handleBillingTypeChange, isFree }) => (
  <div
    className={`flex flex-col items-center justify-center px-6 ${
      billingType === type
        ? "border border-brand-9 rounded-md transition-all duration-300 ease-in-out bg-white"
        : ""
    }`}
  >
    <button
      onClick={() => handleBillingTypeChange(type)}
      disabled={isFree}
      className={`${isFree ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isFree
        ? `Free ${type === "yearly" ? "Annually" : "Monthly"}`
        : `Pay ${type === "yearly" ? "Yearly" : "Monthly"}`}
    </button>
    {type === "yearly" && (
      <Link
        href="#"
        className={`${
          isFree ? "opacity-50 cursor-not-allowed" : "text-brand-9"
        }`}
      >
        {isFree ? "No stress" : "Get Discount"}
      </Link>
    )}
  </div>
);

export const QuantityCounter: React.FC<{
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  isFree: boolean;
  billingType: string;
}> = ({
  quantity,
  incrementQuantity,
  decrementQuantity,
  isFree,
  billingType,
}) => (
  <div className="counter flex items-center justify-center w-full gap-2">
    <div className="flex items-center gap-6 w-full max-w-[74px] border border-neutral-3 px-2 rounded-md">
      <p className="count pl-1 text-[#000] text-[14px] font-medium tracking-[0px]">
        {isFree ? 0 : quantity}
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
    <p className={`${isFree ? "opacity-50 cursor-not-allowed" : ""}`}>
      {" "}
      Total {billingType === "monthly" ? "Months" : "Years"}{" "}
    </p>
  </div>
);

export const CounterButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  icon: string;
  alt: string;
}> = ({ onClick, disabled, icon, alt }) => (
  <button
    className="text-white rounded-md"
    onClick={onClick}
    disabled={disabled}
  >
    <Image src={icon} alt={alt} width={20} height={20} />
  </button>
);

export const FeaturesToggle: React.FC<{
  showFeatures: boolean;
  getFeaturesText: () => string;
  handleCardClick: () => void;
}> = ({ showFeatures, getFeaturesText, handleCardClick }) => (
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

export const FeaturesList: React.FC<{
  showFeatures: boolean;
  features: string[];
}> = ({ showFeatures, features }) =>
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
  );

export const SelectPlanButton: React.FC<{ isFree: boolean }> = ({ isFree }) => (
  <div className="px-6 pb-4">
    <div
      className={`buynowbtn w-full flex items-center justify-center p-[8px] gap-[10px] rounded-[4px] ${
        isFree ? "bg-brand-9 bg-opacity-40 cursor-not-allowed" : "bg-brand-9"
      }`}
    >
      <button
        className={`text-center text-[14px] font-medium tracking-[0px] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={isFree}
      >
        Select Plan
      </button>
    </div>
  </div>
);
