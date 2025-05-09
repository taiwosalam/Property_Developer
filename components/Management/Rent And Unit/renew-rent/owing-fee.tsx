import { useState, useEffect, useMemo } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { FeeDetail } from "../types";
import { currencySymbols } from "@/utils/number-formatter";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import { calculateOverduePeriods } from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { getOwingFeeDetails } from "./data";
import { calculateRentPenalty } from "@/app/(nav)/management/rent-unit/data";
import { useOccupantStore } from "@/hooks/occupant-store";

const OwingFee = ({ show=false }: { show?: boolean }) => {
  const { isRental, unitData, currency, due_date, isUpfrontPaymentChecked } =
    useRenewRentContext();
  // Zustand store
  const { penaltyAmount, setPenaltyAmount } = useOccupantStore();
  const [owingAmount, setOwingAmount] = useState<number>(0);
  // const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [overduePeriods, setOverduePeriods] = useState<number>(0);

  // const chargePenalty = unitData.chargePenalty;
  const chargePenalty = true; //TODO: UNCOMMENT THE TOP
  const rent_penalty_setting = unitData.rent_penalty_setting;
  const feePeriod = unitData.fee_period;
  const rentAmount = Number(unitData.fee_amount);

  useEffect(() => {
    if (due_date && unitData.fee_period && unitData.renewalTenantTotalPrice) {
      const periods = calculateOverduePeriods(
        due_date,
        unitData.fee_period as any
      );
      const calculatedOwing =
        periods * Number(unitData.renewalTenantTotalPrice);
      const penaltyAmount = calculateRentPenalty(
        chargePenalty,
        rent_penalty_setting,
        rentAmount,
        feePeriod as any,
        periods
      );
      setPenaltyAmount(penaltyAmount);
      setOwingAmount(calculatedOwing);
      setOverduePeriods(periods);
    }
  }, [
    due_date,
    unitData.fee_period,
    unitData.renewalTenantTotalPrice,
    chargePenalty,
    rent_penalty_setting,
    setPenaltyAmount,
  ]);

  const feeDetails = useMemo(
    () =>
      getOwingFeeDetails({
        isRental,
        currency: currency as keyof typeof currencySymbols,
        owingAmount,
        overduePeriods,
        unitData,
        penaltyAmount,
      }),
    [isRental, currency, owingAmount, overduePeriods, unitData]
  );

  // if (owingAmount <= 0 || !isUpfrontPaymentChecked) {
  //   return null;
  // }

  if (!show || owingAmount <= 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <RentSectionTitle>Outstanding Details</RentSectionTitle>
      <FeeDetails
        owing
        noEdit
        currency={currency}
        title={isRental ? "Breakdown" : "Breakdown"}
        feeDetails={feeDetails}
        total_package={
          Number(unitData.renewalTenantTotalPrice) + owingAmount + penaltyAmount
        }
        id={unitData.propertyId as string}
      />
    </div>
  );
};

export default OwingFee;
