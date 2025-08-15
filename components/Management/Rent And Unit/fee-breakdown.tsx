import type { FeeDetail } from "./types";
import { RentSectionTitle, FeeDetails } from "./rent-section-container";
import { Currency } from "@/utils/number-formatter";

export const FeeBreakdown: React.FC<{
  feeDetails: FeeDetail[];
  isRental: boolean;
  total_package: number;
  id: string;
  currency: Currency;
}> = ({ feeDetails, isRental, total_package, id, currency }) => {
  // Filter valid fee details to ensure no empty or invalid amounts
  const validFeeDetails: FeeDetail[] = feeDetails.filter(
    (fee) => fee.amount !== undefined && fee.amount !== ""
  );
  return (
    <div className="space-y-6 new-tenant-fee-card">
      <RentSectionTitle>
        {isRental ? "New Tenant Fee" : "New Occupant Fee"}
      </RentSectionTitle>

      {validFeeDetails.length > 0 && (
        <FeeDetails
          title={isRental ? "Rent Package" : "Occupant Fee"}
          feeDetails={validFeeDetails}
          total_package={total_package}
          id={id}
          currency={currency}
          noEdit
        />
      )}
    </div>
  );
};
