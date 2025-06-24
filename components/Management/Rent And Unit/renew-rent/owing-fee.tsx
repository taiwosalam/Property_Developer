"use client";

import { useState, useEffect, useMemo } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { currencySymbols } from "@/utils/number-formatter";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import { calculateRentFeeAmountAndPeriods, getDueFeeDetails } from "./data";
import { calculateRentPenalty } from "@/app/(nav)/management/rent-unit/data";
import { RentPeriod } from "../data";
import { useOccupantStore } from "@/hooks/occupant-store";

const OwingFee = ({ show = false }: { show?: boolean }) => {
  const {
    isRental,
    unitData,
    currency,
    due_date,
    start_date,
    isUpfrontPaymentChecked,
  } = useRenewRentContext();

  // Zustand store
  const { penaltyAmount, setPenaltyAmount, setOverduePeriods, overduePeriods } =
    useOccupantStore();
  const [owingAmount, setOwingAmount] = useState<number>(0);

  const chargePenalty = unitData.chargePenalty ?? false;
  const rent_penalty_setting = unitData.rent_penalty_setting ?? {};
  const rentAmount = Number(unitData.fee_amount) || 0;
  const feePeriod = unitData?.fee_period || "monthly";
  const renewalTenantTotalPrice = Number(unitData.renewalTenantTotalPrice) || 0;

  // Warn about unusual daily fee period
  // if (feePeriod === "daily" && renewalTenantTotalPrice > 10000) {
  //   console.warn(
  //     "Unusual daily fee period with high renewalTenantTotalPrice:",
  //     renewalTenantTotalPrice
  //   );
  // }

  useEffect(() => {
    if (start_date && due_date && feePeriod && renewalTenantTotalPrice > 0) {
      // Calculate owing amount and periods
      const { overduePeriods, owingAmount } = calculateRentFeeAmountAndPeriods({
        start_date,
        due_date,
        feePeriod: feePeriod as RentPeriod,
        renewalTenantTotalPrice,
      });

      // Calculate penalty using due_date
      const calculatedPenalty = calculateRentPenalty(
        chargePenalty,
        rent_penalty_setting,
        rentAmount,
        feePeriod as RentPeriod,
        due_date
      );
      setOverduePeriods(overduePeriods);
      setOwingAmount(owingAmount);
      setPenaltyAmount(calculatedPenalty);
    } else {
      console.log("Missing data for owing calculation:", {
        start_date,
        due_date,
        feePeriod,
        renewalTenantTotalPrice,
      });
    }
  }, [
    start_date,
    due_date,
    feePeriod,
    renewalTenantTotalPrice,
    chargePenalty,
    rent_penalty_setting,
    rentAmount,
    setPenaltyAmount,
    setOverduePeriods,
  ]);

  const feeDetails = useMemo(
    () =>
      getDueFeeDetails({
        isRental,
        currency: currency as keyof typeof currencySymbols,
        owingAmount,
        overduePeriods,
        unitData,
        penaltyAmount,
      }),
    [isRental, currency, owingAmount, overduePeriods, unitData, penaltyAmount]
  );


  // Render if show is true and either owingAmount or penaltyAmount is non-zero
  if (!show || (owingAmount <= 0 && penaltyAmount <= 0)) {
    console.log("OwingFee not rendered:", { show, owingAmount, penaltyAmount });
    return null;
  }

  return (
    <div className="outstanding-details-wrapper space-y-6">
      <RentSectionTitle>Outstanding Details</RentSectionTitle>
      <FeeDetails
        owing
        noEdit
        currency={currency}
        title={isRental ? "Breakdown" : "Breakdown"}
        feeDetails={feeDetails}
        total_package={renewalTenantTotalPrice + owingAmount + penaltyAmount}
        id={unitData.propertyId as string}
      />
    </div>
  );
};

export default OwingFee;
