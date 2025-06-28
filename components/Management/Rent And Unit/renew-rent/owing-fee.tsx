"use client";

import { useState, useEffect, useMemo } from "react";
import {
  RentSectionContainer,
  RentSectionTitle,
} from "../rent-section-container";
import { FeeDetails } from "../rent-section-container";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import { calculateRentFeeAmountAndPeriods, getDueFeeDetails } from "./data";
import { calculateRentPenalty, convertToYesNo } from "@/app/(nav)/management/rent-unit/data";
import { RentPeriod } from "../data";
import { useOccupantStore } from "@/hooks/occupant-store";
import Button from "@/components/Form/Button/button";
import { parseAmount } from "../Edit-Rent/data";
import { DetailItem } from "../../detail-item";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CalculationsComp from "./calculations";

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

  console.log("unitData", unitData);

  const chargePenalty = unitData.chargePenalty ?? false;
  const rent_penalty_setting = unitData.rent_penalty_setting ?? {};
  const rentAmount = Number(unitData.fee_amount) || 0;
  const renewfeePeriod = unitData?.renew_fee_period || "monthly";
  const renewalTenantTotalPrice = Number(unitData.renewalTenantTotalPrice) || 0;

  const CURRENCY =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];

  // Warn about unusual daily fee period
  // if (renewfeePeriod === "daily" && renewalTenantTotalPrice > 10000) {
  //   console.warn(
  //     "Unusual daily fee period with high renewalTenantTotalPrice:",
  //     renewalTenantTotalPrice
  //   );
  // }

  useEffect(() => {
    if (
      start_date &&
      due_date &&
      renewfeePeriod &&
      renewalTenantTotalPrice > 0
    ) {
      // Calculate owing amount and periods
      const { overduePeriods, owingAmount } = calculateRentFeeAmountAndPeriods({
        start_date,
        due_date,
        feePeriod: renewfeePeriod as RentPeriod,
        renewalTenantTotalPrice,
      });

      // Calculate penalty using due_date
      const calculatedPenalty = calculateRentPenalty(
        chargePenalty,
        rent_penalty_setting,
        rentAmount,
        renewfeePeriod as RentPeriod,
        due_date
      );
      setOverduePeriods(overduePeriods);
      setOwingAmount(owingAmount);
      setPenaltyAmount(calculatedPenalty);
    } else {
      console.log("Missing data for owing calculation:", {
        start_date,
        due_date,
        renewfeePeriod,
        renewalTenantTotalPrice,
      });
    }
  }, [
    start_date,
    due_date,
    renewfeePeriod,
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

  // Filter out fee details with invalid amounts
  const validFeeDetails = feeDetails.filter((fee) => {
    const parsedAmount = parseAmount(fee.amount);
    return parsedAmount > 0;
  });

  const TOTAL = renewalTenantTotalPrice + owingAmount + penaltyAmount;

  const calculationFeeDetails = [
    // {
    //   name: "Charge Penalty",
    //   amount: convertToYesNo(unitData.chargePenalty),
    // },
    {
      name: "Renewal Period",
      amount: renewfeePeriod,
    },
    {
      name: "Renewal Amount",
      amount: `${CURRENCY}${formatNumber(
        parseFloat(renewalTenantTotalPrice.toString())
      )}`,
    },
    {
      name: "Owing Amount (overdue periods × renewal amount)",
      amount: `${overduePeriods} × ${CURRENCY}${formatNumber(
        parseFloat(renewalTenantTotalPrice.toString())
      )}`,
    },
    {
      name: "Penalty Amount",
      amount: `${CURRENCY}${formatNumber(
        parseFloat(penaltyAmount.toString())
      )}`,
    },
  ];
  // Render if show is true and either owingAmount or penaltyAmount is non-zero
  if (!show || (owingAmount <= 0 && penaltyAmount <= 0)) {
    console.log("OwingFee not rendered:", { show, owingAmount, penaltyAmount });
    return null;
  }

  return (
    <div className="outstanding-details-wrapper space-y-6">
      <RentSectionTitle>Outstanding Details</RentSectionTitle>
      <RentSectionContainer title={isRental ? "Breakdown" : "Breakdown"}>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-2">
            {validFeeDetails.map((fee, index) => (
              <DetailItem
                key={index}
                style={{ width: "120px" }}
                label={fee.name}
                value={`${fee?.amount}`}
              />
            ))}
          </div>
          {/* TOTAL */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <p className="text-[#747474] dark:text-white text-base font-normal">
                Total Package
              </p>
              <p className="text-lg lg:text-xl text-brand-9 font-bold">
                {TOTAL > 0
                  ? `${CURRENCY}${formatNumber(parseFloat(TOTAL.toString()))}`
                  : `${CURRENCY}0`}
              </p>
            </div>
            {/* BUTTON */}
            <Modal>
              <ModalTrigger asChild>
                <Button type="submit" className="py-1 px-2" size="base_medium">
                  Calculations
                </Button>
              </ModalTrigger>
              <ModalContent>
                <CalculationsComp
                  currency={CURRENCY}
                  total={TOTAL}
                  feeDetails={calculationFeeDetails}
                />
              </ModalContent>
            </Modal>
          </div>
          {/* TOTAL ENDS */}
        </div>
      </RentSectionContainer>
    </div>
  );
};

export default OwingFee;
