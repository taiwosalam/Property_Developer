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
  const { currentRentStats } = useGlobalStore();
  const { setGlobalInfoStore } = useGlobalStore();
  const outstanding = currentRentStats?.outstanding || 0;

  const isRental = propertyType === "rental";
  const currency = unitData?.currency || "naira";
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";

  // Compute total payable
  const { totalPayable } = getTotalPayable(
    calculation,
    deduction,
    unitData,
    currentRentStats?.outstanding || 0,
    currency
  );

  const isExcess = totalPayable < 0;
  const feeTitle = isRental ? "Breakdown" : "Annual Fee";
  const detail = {
    label: isExcess ? "Client Excess" : "Refund Client",
    amount: totalPayable,
  };

  // Subtitles
  const subtitles = {
    zero: "Based on the calculation and your selected option, there is no outstanding balance. Neither your company nor the client owes any refund or payment.",
    refund:
      "Based on the calculation and your selected option, the client has an excess balance to be paid to your company.",
    excess:
      "Based on the calculation and your selected option, your company owes the client a refund balance.",
  };
  
  const tenantOwes = detail.amount > 0; // Tenant owes company
  const companyOwes = deduction && detail.amount < 0; // Company owes tenant
  const noOneOwes = detail.amount === 0; // Neither owes

  const subtitle = noOneOwes
    ? subtitles.zero
    : tenantOwes
    ? subtitles.refund
    : subtitles.excess;

  // Save payment status desc & amount to general store
  useEffect(() => {
    setGlobalInfoStore("paymentStatus", {
      desc: subtitle,
      amount: detail.amount,
    });
  }, [subtitle, detail.amount, setGlobalInfoStore]);

  // Return null if unitData is not available
  if (!unitData) return null;
  // Determine payment status
  // // Determine subtitle based on totalPayable and isExcess
  // const subtitle =
  //   detail.amount === 0
  //     ? subtitles.zero
  //     : isExcess
  //     ? subtitles.excess
  //     : subtitles.refund;

  // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE e.g payment-status-wrapper💀💀💀👿
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
