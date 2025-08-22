"use client"

import { useState, useEffect } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { SectionSeparator } from "@/components/Section/section-components";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";
import { calculateDueDate, CheckBoxOptions } from "../data";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import Button from "@/components/Form/Button/button";
import { useGlobalStore } from "@/store/general-store";
import PaymentConfirmationText from "../payment-checkbox-texts";
import PaymentCheckBoxs from "../payment-checkbox";

interface CheckboxStates {
  create_invoice: boolean;
  mobile_notification: boolean;
  sms_alert: boolean;
  email_alert: boolean;
  rent_agreement: boolean;
}

export const RenewalRent = ({
  setStartDate,
  setDueDate,
  setSelectedCheckboxOptions,
  loading,
  action,
}: {
  setStartDate: (date: Dayjs | null) => void;
  setDueDate: (date: Dayjs | null) => void;
  setSelectedCheckboxOptions: (options: CheckBoxOptions) => void;
  loading?: boolean;
  action: () => void;
}) => {
  const {
    isRental,
    unitData,
    currency,
    startDate,
    dueDate,
    isUpfrontPaymentChecked,
  } = useRenewRentContext();
  const canSubmitRent = useGlobalStore((state) => state.canSubmitRent);
  const isWebUser = unitData?.occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = unitData?.occupant?.userTag?.toLowerCase() === "mobile";
  const [localDueDate, setLocalDueDate] = useState<Dayjs | null>(null);
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(
    {
      create_invoice: true,
      mobile_notification: true,
      sms_alert: true,
      email_alert: true,
      rent_agreement: true,
    }
  );

  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    // { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    // { label: "Email Alert", key: "email_alert" },
    { label: "Rent Agreement", key: "rent_agreement" },
  ];

  const visibleCheckboxOptions = isWebUser
    ? checkboxOptions.filter(
        (option) =>
          option.key !== "create_invoice" &&
          option.key !== "mobile_notification"
      )
    : checkboxOptions;

  // Update checkbox states based on user type and currency
  useEffect(() => {
    setCheckboxStates((prev) => ({
      ...prev,
      mobile_notification: isWebUser
        ? false
        : isMobileUser
        ? true
        : prev.mobile_notification,
      create_invoice:
        currency !== "naira" && isMobileUser
          ? false
          : !isMobileUser
          ? false
          : prev.create_invoice,
    }));
  }, [isWebUser, isMobileUser, currency]);

  // Handle past dates and due date calculation
  useEffect(() => {
    if (!startDate) {
      setLocalDueDate(null);
      setCheckboxStates((prev) => ({
        ...prev,
        create_invoice: true, // Reset to true when no start date
      }));
      return;
    }
    const calculatedDueDate = calculateDueDate(
      startDate,
      unitData.fee_period as any
    );
    setLocalDueDate(calculatedDueDate);
    // Force create_invoice to false for past dates
    if (startDate.isBefore(dayjs(), "day")) {
      setCheckboxStates((prev) => ({
        ...prev,
        create_invoice: false,
      }));
    }
  }, [startDate, unitData.fee_period]);

  // Update parent with selected checkbox options
  useEffect(() => {
    setSelectedCheckboxOptions({
      create_invoice: checkboxStates.create_invoice,
      mobile_notification: checkboxStates.mobile_notification,
      sms_alert: checkboxStates.sms_alert,
      email_alert: checkboxStates.email_alert,
      rent_agreement: checkboxStates.rent_agreement,
    });
  }, [checkboxStates, setSelectedCheckboxOptions]);

  // To use the PaymentCheckBoxs component: use (optionKey, checked) signature for toggling
  const handleCheckboxChange = (optionKey: string, checked: boolean) => {
    if (optionKey === "mobile_notification" && isWebUser) {
      return; // Prevent changing this option for web users
    }
    if (
      optionKey === "create_invoice" &&
      (!isMobileUser ||
        (currency !== "naira" && isMobileUser) ||
        startDate?.isBefore(dayjs(), "day"))
    ) {
      return;
    }
    setCheckboxStates((prev) => ({
      ...prev,
      [optionKey]: checked,
    }));
  };

  const nonNaira = currency !== "naira";

  if (!isUpfrontPaymentChecked) {
    return null;
  }

  return (
    <div className="renew-rent-date-checkboxoptions-wrapper">
      <SectionSeparator className="mt-4" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <DateInput
          id="payment_date"
          label="Payment Date"
          lastYear
          value={startDate}
          onChange={setStartDate}
        />
      </div>
      <div className="custom-flex-col gap-2">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex gap-4">
            <PaymentCheckBoxs
              options={visibleCheckboxOptions}
              selectedOptions={checkboxStates}
              onChange={handleCheckboxChange}
              isWebUser={isWebUser}
              isMobileUser={isMobileUser}
              currency={currency}
            />
          </div>
          <Button
            size="base_medium"
            className="py-2 px-6"
            onClick={action}
            type="button"
            disabled={loading || !canSubmitRent}
          >
            {loading ? "Please wait..." : "Update"}
          </Button>
        </div>
        <PaymentConfirmationText
          isWebUser={isWebUser}
          isRental={isRental}
          nonNaira={nonNaira}
          selectedOptions={checkboxStates}
          currency={currency}
          startDate={startDate}
        />
      </div>
    </div>
  );
};
