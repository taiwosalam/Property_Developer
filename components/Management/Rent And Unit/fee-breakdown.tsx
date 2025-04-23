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
  return (
    <div className="space-y-6">
      <RentSectionTitle>
        {isRental ? "New Tenant Fee" : "New Occupant Fee"}
      </RentSectionTitle>
      <FeeDetails
        noEdit
        title={isRental ? "Rent Package" : "Occupant Fee"}
        feeDetails={feeDetails}
        total_package={total_package}
        id={id}
        currency={currency}
      />
    </div>
  );
};
