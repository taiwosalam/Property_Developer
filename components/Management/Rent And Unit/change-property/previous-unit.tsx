"use client";
import { useGlobalStore } from "@/store/general-store";
import { useOccupantStore } from "@/hooks/occupant-store";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { useEffect } from "react";
import {
  RentSectionContainer,
  RentSectionTitle,
} from "../rent-section-container";
import { RentPreviousRecords } from "../data";
import {
  getCurrentRentDetailItems,
  getUnitDetails,
  getDeductionsArrays,
  getTotalPayable,
} from "./data";
import { getBalanceBreakdown } from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import { DetailItem } from "../../detail-item";
import TenantCalculationSwitch from "./switch-deduction-calculation";

export const ProceedPreviousUnitBalance: React.FC<{
  title?: string;
  workings?: boolean;
}> = ({ title, workings }) => {
  const {
    calculation,
    page,
    deduction,
    unitBalance,
    unitData,
    startDate,
    dueDate,
    propertyType,
  } = useOccupantStore();
  const { currentRentStats, currentUnit } = useGlobalStore();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const isUnit = page === "unit";
  const isRental = propertyType === "rental";
  const currencySymbol =
    currencySymbols[unitData?.currency as keyof typeof currencySymbols] || "₦";
  const prevUBreakdown = currentRentStats?.prevUBreakdown || [];
  const breakdown = currentRentStats?.breakdown || [];

  // Compute total payable and related values
  const { newUnitTotal, newUnitTotalFormatted, totalPayable } = getTotalPayable(
    calculation,
    deduction,
    unitData,
    currentRentStats?.outstanding || 0,
    unitData?.currency
  );

  // Generate deductions arrays
  const { deductionsCal, deductionsRes } = getDeductionsArrays(
    calculation,
    deduction,
    newUnitTotalFormatted,
    totalPayable,
    currentRentStats?.oustandingObj || [],
    unitData,
    unitData?.currency
  );

  // Update balance breakdown in global store
  const record = unitBalance?.data?.[0];
  const records = unitBalance?.data || [];
  const rent = currentUnit?.newTenantTotalPrice;
  const renewalTenantPrice = parseCurrency(currentUnit?.renewalTenantPrice);
  const period = currentUnit?.fee_period;

  useEffect(() => {
    const newBalanceBreakdown = record
      ? getBalanceBreakdown(
          rent,
          record,
          records,
          period,
          currencySymbol,
          renewalTenantPrice
        )
      : { duration: "-", breakdown: [] };
    const currentStats = useGlobalStore.getState().currentRentStats;
    if (JSON.stringify(currentStats) !== JSON.stringify(newBalanceBreakdown)) {
      setGlobalStore("currentRentStats", newBalanceBreakdown);
    }
  }, [
    record,
    period,
    currencySymbol,
    rent,
    renewalTenantPrice,
    setGlobalStore,
  ]);

  // Generate detail items
  const currentRentDetailItems = getCurrentRentDetailItems(
    unitData,
    startDate,
    breakdown,
    unitData?.currency
  );
  const unitDetails = getUnitDetails(
    unitData,
    unitData?.currency,
    startDate,
    dueDate
  );
  // const unitDetails = getUnitDetails(unitData, unitData?.currency);
  const detailsArr = isUnit ? unitDetails : currentRentDetailItems;

  // Return null if unitData is not available
  if (!unitData) return null;
  // If no valid items, return null
  if (detailsArr.length === 0) return null;

  return (
    <div className="space-y-1">
      <RentSectionTitle>{title ?? "Previous Unit Balance"}</RentSectionTitle>
      {workings && <TenantCalculationSwitch switches={["deduction"]} />}
      <RentSectionContainer
        title={
          workings ? "Breakdown" : isRental ? "Breakdown" : "Apply Deduction"
        }
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {!workings &&
              detailsArr?.map((item, index) => (
                <DetailItem
                  key={index}
                  label={item.label}
                  value={item.value as string}
                  style={{ width: "150px" }}
                />
              ))}
            {workings &&
              deductionsCal?.map((item: any, index: number) => (
                <DetailItem
                  key={index}
                  label={item.label}
                  value={item.value as string}
                  style={{ width: "150px" }}
                />
              ))}
          </div>
        </div>
        {workings && (
          <div className="space-y-2 mt-4">
            <p className="text-[#747474] dark:text-white text-base font-normal">
              Balance
            </p>
            <p className="text-lg lg:text-xl font-bold text-brand-9">
              {currencySymbol}
              {formatNumber(Math.abs(Number(totalPayable)))}
            </p>
          </div>
        )}
      </RentSectionContainer>
    </div>
  );
};
