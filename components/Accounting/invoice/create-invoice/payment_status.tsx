import { RentSectionTitle } from "@/components/Management/Rent And Unit/rent-section-container";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";

const SwitchUnitPaymentStatus = ({
  desc,
  amount,
}: {
  desc: string;
  amount: string | number;
}) => {
  const currencySymbol = currencySymbols["naira"] || "₦";
  return (
    <div className="payment-status-wrapper space-y-1">
      <RentSectionTitle>Payment Status</RentSectionTitle>
      <p className="text-sm">• {desc}</p>
      <div className="mt-2">
        <p className="text-md font-semibold mt-3 text-text-secondary dark:text-darkText-1">
          Total
        </p>
        <p className="text-lg lg:text-xl text-brand-9 font-bold">
          {currencySymbol}
          {formatNumber(Math.abs(Number(amount)))}
        </p>
      </div>
    </div>
  );
};

export default SwitchUnitPaymentStatus;
