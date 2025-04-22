import type { FeeDetail } from "./types";
import { RentSectionTitle, FeeDetails } from "./rent-section-container";

export const FeeBreakdown: React.FC<{
  feeDetails: FeeDetail[];
  isRental: boolean;
  total_package: number;
  id: string;
}> = ({ feeDetails, isRental, total_package, id }) => {
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
      />
    </div>
  );
};
