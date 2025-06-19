import { useRenewRentContext } from "@/utils/renew-rent-context";
import { RentSectionTitle } from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { FeeDetail } from "../types";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import { formatFee } from "@/app/(nav)/management/rent-unit/data";

const RenewalFee = ({
  setIsUpfrontPaymentChecked,
}: {
  setIsUpfrontPaymentChecked: (checked: boolean) => void;
}) => {
  const { isRental, unitData, currency, isUpfrontPaymentChecked } =
    useRenewRentContext();
  const shouldChargeTenantAgencyFee =
    unitData?.whoToChargeRenew?.toLowerCase() === "tenants" ||
    unitData?.whoToChargeRenew?.toLowerCase() === "both";

  // Calculate agency fee (% of renewalTenantPrice)
  const agencyFeeAmount = shouldChargeTenantAgencyFee
    ? Number(unitData.renew_fee_amount) *
      (Number(unitData?.agency_fee || 0) / 100)
    : 0;

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
    ...(shouldChargeTenantAgencyFee
      ? [
          {
            name: "Agency Fee",
            amount:
              formatFee(agencyFeeAmount, unitData?.currency || "naira") || "₦0",
          },
        ]
      : []),
  ];

  const TOTAL_FEE = Number(unitData.renewalTenantTotalPrice as any);
  const periodString = unitData.fee_period.charAt(0).toUpperCase() + unitData.fee_period.slice(1);

  // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE e.g renewal-rent-wrapper💀💀💀👿
  return (
    <div className="space-y-6">
      <div className="renewal-rent-wrapper">
        <RentSectionTitle>
          {isRental ? "Renewal Rent" : "Renewal Fee"}
        </RentSectionTitle>
        <FeeDetails
          title={isRental ? "Breakdown" : `${periodString} Fee`}
          feeDetails={feeDetails}
          // total_package={Number(unitData.renewalTenantTotalPrice)}
          total_package={TOTAL_FEE}
          id={unitData.propertyId as string}
          currency={currency}
          noEdit
        />
      </div>
      <div className="flex gap-1 flex-col renew-rent-option-container">
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
      {/* {isUpfrontPaymentChecked && ( */}
      {/* <FeeDetails
          title={isRental ? "Breakdown" : "Annual Fee"}
          feeDetails={feeDetails}
          // total_package={Number(unitData.renewalTenantTotalPrice)}
          total_package={TOTAL_FEE}
          id={unitData.propertyId as string}
          currency={currency}
          noEdit
        /> */}
      {/* )} */}
    </div>
  );
};

export default RenewalFee;
