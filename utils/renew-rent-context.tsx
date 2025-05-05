"use client";

import { createContext, useContext } from "react";
import { Dayjs } from "dayjs";
import { Currency } from "@/utils/number-formatter";
import { CheckBoxOptions } from "@/components/Management/Rent And Unit/data";
import { initDataProps } from "@/app/(nav)/management/rent-unit/data";

interface RenewRentContextProps {
  unitData: initDataProps;
  startDate: Dayjs | null;
  dueDate: Dayjs | null;
  amt: string;
  selectedCheckboxOptions: CheckBoxOptions;
  isUpfrontPaymentChecked: boolean;
  reqLoading: boolean;
  isRental: boolean;
  currency: Currency;
  propertySettingsData: any;
  rentalData: any;
  start_date: string;
  due_date: string;
}

export const RenewRentContext = createContext<
  RenewRentContextProps | undefined
>(undefined);

export const useRenewRentContext = () => {
  const context = useContext(RenewRentContext);
  if (!context) {
    throw new Error(
      "useRenewRentContext must be used within a RenewRentProvider"
    );
  }
  return context;
};
