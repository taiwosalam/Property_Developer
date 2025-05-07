import { useRenewRentContext } from "@/utils/renew-rent-context";
import { RentSectionTitle } from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { FeeDetail } from "../types";
import Checkbox from "@/components/Form/Checkbox/checkbox";

const RenewalFee = ({
  setIsUpfrontPaymentChecked,
}: {
  setIsUpfrontPaymentChecked: (checked: boolean) => void;
}) => {
  const { isRental, unitData, currency, isUpfrontPaymentChecked } =
    useRenewRentContext();

  const feeDetails: FeeDetail[] = [
    {
      name: isRental ? "Rent" : "Fee",
      amount: unitData.renewalTenantPrice,
    },
    {
      name: "Service Charge",
      amount: unitData.renew_service_charge as any,
    },
    {
      name: "VAT Amount",
      amount: unitData.renew_vat_amount as any,
    },
    {
      name: "Other Charges",
      amount: unitData.renew_other_charge as any,
    },
  ];

  const TOTAL_FEE = Number(unitData.renewalTenantTotalPrice as any);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 flex-col">
        <div className="flex gap-2">
          <RentSectionTitle>
            {isRental ? "Renewal Rent" : "Renewal Fee"}
          </RentSectionTitle>
          <Checkbox
            radio
            checked={isUpfrontPaymentChecked}
            onChange={() => setIsUpfrontPaymentChecked(true)}
          />
        </div>
        <p>
          Select this option if the client wishes to make a partial advance
          payment of the total amount.
        </p>
      </div>
      {isUpfrontPaymentChecked && (
        <FeeDetails
          title={isRental ? "Breakdown" : "Annual Fee"}
          feeDetails={feeDetails}
          // total_package={Number(unitData.renewalTenantTotalPrice)}
          total_package={TOTAL_FEE}
          id={unitData.propertyId as string}
          currency={currency}
          noEdit
        />
      )}
    </div>
  );
};

export default RenewalFee;
