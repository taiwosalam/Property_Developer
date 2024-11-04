import type { FeeDetail } from "./types";
import { RentSectionTitle, FeeDetails } from "./rent-section-container";

export const FeeBreakdown: React.FC<{
  feeDetails: FeeDetail[];
  isRental: boolean;
}> = ({ feeDetails, isRental }) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>  
        {isRental ? "Commission & Fees" : "Estate Fee"}
      </RentSectionTitle>
      <FeeDetails
        title={isRental ? "New Tenant Fee" : "Occupant Fee"}
        feeDetails={feeDetails}
      />
    </div>
  );
};
