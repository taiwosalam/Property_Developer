import { useState, useEffect, useMemo } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { FeeDetail } from "../types";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import {
  calculateOverduePeriods,
  formatOwingPeriod,
} from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { getOwingFeeDetails } from "./data";

const OwingFee = () => {
  const { isRental, unitData, currency, due_date, isUpfrontPaymentChecked } =
    useRenewRentContext();
  const [owingAmount, setOwingAmount] = useState<number>(0);
  const [overduePeriods, setOverduePeriods] = useState<number>(0);

  useEffect(() => {
    if (due_date && unitData.fee_period && unitData.renewalTenantTotalPrice) {
      const periods = calculateOverduePeriods(
        due_date,
        unitData.fee_period as any
      );
      const calculatedOwing =
        periods * Number(unitData.renewalTenantTotalPrice);
      setOwingAmount(calculatedOwing);
      setOverduePeriods(periods);
    }
  }, [due_date, unitData.fee_period, unitData.renewalTenantTotalPrice]);

  
  const feeDetails = useMemo(
    () =>
      getOwingFeeDetails({
        isRental,
        currency: currency as keyof typeof currencySymbols,
        owingAmount,
        overduePeriods,
        unitData,
      }),
    [isRental, currency, owingAmount, overduePeriods, unitData]
  );
  
  if (owingAmount <= 0 || !isUpfrontPaymentChecked) {
    return null;
  }
  // const feeDetails: FeeDetail[] = [
  //   {
  //     name: isRental ? "Renewal Total Package" : "Renewal Total Fee",
  //     amount: unitData?.renewalTenantTotalPrice?.toString()
  //       ? `${
  //           currencySymbols[currency as keyof typeof currencySymbols] || "₦"
  //         }${formatNumber(
  //           parseFloat(unitData.renewalTenantTotalPrice.toString())
  //         )}`
  //       : "",
  //   },
  //   {
  //     name: "Owing Period",
  //     amount: formatOwingPeriod(overduePeriods, unitData.fee_period as any),
  //   },
  //   {
  //     name: "Owing Amount",
  //     amount: owingAmount
  //       ? `${
  //           currencySymbols[currency as keyof typeof currencySymbols] || "₦"
  //         }${formatNumber(owingAmount)}`
  //       : "",
  //   },
  //   { name: "Rent Penalty", amount: "--- ---" },
  // ];

  return (
    <div className="space-y-6">
      <RentSectionTitle>Outstanding Details</RentSectionTitle>
      <FeeDetails
        owing
        noEdit
        currency={currency}
        title={isRental ? "Breakdown" : "Breakdown"}
        feeDetails={feeDetails}
        total_package={Number(unitData.renewalTenantTotalPrice) + owingAmount}
        id={unitData.propertyId as string}
      />
    </div>
  );
};

export default OwingFee;
