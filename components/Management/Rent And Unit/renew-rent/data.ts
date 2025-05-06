import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { FeeDetail } from "../types";
import { formatOwingPeriod } from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { RentPeriod } from "../data";

interface UnitData {
  fee_period?: string;
  renewalTenantTotalPrice?: number | string;
  propertyId?: string;
}

interface FeeDetailsParams {
  isRental: boolean;
  currency: keyof typeof currencySymbols;
  owingAmount: number;
  overduePeriods: number;
  unitData: UnitData;
  penaltyAmount: number;
}

export const getOwingFeeDetails = ({
  isRental,
  currency,
  owingAmount,
  overduePeriods,
  unitData,
  penaltyAmount,
}: FeeDetailsParams): FeeDetail[] => {
  const formatCurrency = (amount: number): string =>
    `${currencySymbols[currency] || "₦"}${formatNumber(amount)}`;

  return [
    {
      name: isRental ? "Renewal Total Package" : "Renewal Total Fee",
      amount: unitData.renewalTenantTotalPrice
        ? formatCurrency(
            parseFloat(unitData.renewalTenantTotalPrice.toString())
          )
        : "",
    },
    {
      name: "Owing Period",
      amount: formatOwingPeriod(
        overduePeriods,
        (unitData.fee_period as RentPeriod) || ""
      ),
    },
    {
      name: "Owing Amount",
      amount: owingAmount ? formatCurrency(owingAmount) : "",
    },
    { name: "Rent Penalty", amount: formatCurrency(penaltyAmount) || "" }, // TODO: Fix the amount later
  ];
};
