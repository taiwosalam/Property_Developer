"use client";
import { useOccupantStore } from "@/hooks/occupant-store";
import { useGlobalStore } from "@/store/general-store";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { RentSectionTitle } from "../rent-section-container";
import { getTotalPayable } from "./data";
import { useEffect } from "react";

export const ProceedPayAble: React.FC = () => {
  const { calculation, deduction, unitData, propertyType } = useOccupantStore();
  const { currentRentStats, setGlobalInfoStore } = useGlobalStore();
  const outstanding =
    Math.round((currentRentStats?.outstanding || 0) * 100) / 100; // Round to 2 decimal places

  const isRental = propertyType === "rental";
  const currency = unitData?.currency || "naira";
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";

  // Compute total payable
  const { totalPayable } = getTotalPayable(
    calculation,
    deduction,
    unitData,
    outstanding,
    currency
  );

  // Determine payment status
  const remainingBalance = totalPayable > 0 && deduction; // Client has remaining balance
  const clientOwes =
    (totalPayable < 0 && deduction) || (totalPayable > 0 && !deduction); // Client owes company
  const noBalance = totalPayable === 0; // No balance or debt

  // Subtitles (as specified by project manager)
  const subtitles = {
    zero: "Based on the calculation and your selected option, there is no outstanding balance. Neither your company nor the client owes any refund or payment.",
    refund:
      "Based on the calculation and your selected option, the client has an excess balance to be paid to your company.",
    excess:
      "Based on the calculation and your selected option, your company owes the client a refund balance.",
    remainingBalance:
      "Based on the calculation and your selected option, the client has a remaining balance with your company.", // Added for clarity
  };

  const subtitle = noBalance
    ? subtitles.zero
    : clientOwes
    ? subtitles.refund
    : remainingBalance
    ? subtitles.remainingBalance
    : subtitles.excess;

  const detail = {
    label: noBalance
      ? "No Payment Due"
      : clientOwes
      ? deduction
        ? "Client Owes"
        : "New Unit Cost"
      : remainingBalance
      ? "Remaining Client Balance"
      : "Refund to Client",
    amount: totalPayable,
  };

  // Save payment status to global store
  useEffect(() => {
    setGlobalInfoStore("paymentStatus", {
      desc: subtitle,
      amount: detail.amount,
    });
  }, [subtitle, detail.amount, setGlobalInfoStore]);

  // Return null if unitData is not available
  if (!unitData) {
    console.warn("ProceedPayAble: unitData is not available");
    return null;
  }

  // Log for debugging
  console.log({
    outstanding,
    newUnitTotal: calculation
      ? unitData?.newTenantTotalPrice
      : unitData?.renewalTenantTotalPrice,
    totalPayable,
    subtitle,
    calculation,
    deduction,
  });

  return (
    <div className="payment-status-wrapper space-y-1">
      <RentSectionTitle>Payment Status</RentSectionTitle>
      <p className="text-sm">• {subtitle}</p>
      <div className="mt-2">
        <p className="text-md font-semibold mt-3 text-text-secondary dark:text-darkText-1">
          Total
        </p>
        <p className="text-lg lg:text-xl text-brand-9 font-bold">
          {currencySymbol}
          {formatNumber(Math.abs(detail.amount))}
        </p>
      </div>
    </div>
  );
};
