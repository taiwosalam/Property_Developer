import { useState, useEffect } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { SectionSeparator } from "@/components/Section/section-components";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";
import { calculateDueDate, CheckBoxOptions } from "../data";
import { useRenewRentContext } from "@/utils/renew-rent-context";
import Button from "@/components/Form/Button/button";

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
  const isWebUser = unitData?.occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = unitData?.occupant?.userTag?.toLowerCase() === "mobile";
  const [localDueDate, setLocalDueDate] = useState<Dayjs | null>(null);
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
    rent_agreement: true,
  });

  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    { label: "Email Alert", key: "email_alert" },
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

  const handleCheckboxChange =
    (optionKey: keyof CheckboxStates) => (checked: boolean) => {
      if (optionKey === "mobile_notification" && isWebUser) return;
      if (
        optionKey === "create_invoice" &&
        (!isMobileUser ||
          (currency !== "naira" && isMobileUser) ||
          startDate?.isBefore(dayjs(), "day"))
      ) {
        return;
      }
      setCheckboxStates((prev) => ({ ...prev, [optionKey]: checked }));
    };

  const nonNaira = currency !== "naira";

  if (!isUpfrontPaymentChecked) {
    return null; // Or return a placeholder if needed
  }

  return (
    <div className="renew-rent-date-checkboxoptions-wrapper">
      <SectionSeparator className="mt-4" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <DateInput
          id="payment_date"
          label="Payment Date"
          // disablePast
          lastYear
          value={startDate}
          onChange={setStartDate}
        />
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        {checkboxOptions.map(({ label, key }) => (
          <Checkbox
            sm
            key={key}
            checked={checkboxStates[key as keyof CheckboxStates]}
            onChange={handleCheckboxChange(key as keyof CheckboxStates)}
            disabled={
              (key === "mobile_notification" && isWebUser) ||
              (key === "create_invoice" &&
                (!isMobileUser ||
                  (currency !== "naira" && isMobileUser) ||
                  startDate?.isBefore(dayjs(), "day")))
            }
          >
            {label}
          </Checkbox>
        ))}

        {startDate?.isBefore(dayjs(), "day") ? (
          <div className="custom-flex-col gap-1">
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              You have selected a past date for the occupant, which indicates
              that you are recording an outstanding rent balance for the client,
              not initiating a new rent payment.
            </p>
            {nonNaira && (
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                Your property was listed in a currency other than Naira. As a
                result, automatic payments and wallet transactions are not
                supported. You will need to handle all payments manually.
              </p>
            )}
          </div>
        ) : isWebUser ? (
          <div className="custom-flex-col gap-1">
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              Confirms that you have received payment for the{" "}
              {isRental ? "rent" : "fee"} renewal.
            </p>
            {nonNaira && (
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                Your property was listed in a currency other than Naira. As a
                result, automatic payments and wallet transactions are not
                supported. You will need to handle all payments manually.
              </p>
            )}
          </div>
        ) : (
          <div className="custom-flex-col gap-1">
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              {checkboxStates.create_invoice
                ? `${isRental ? "Rent" : "Fee"} will commence upon ${
                    isRental ? "tenant" : "occupant"
                  } making payment for the generated invoice.`
                : `Confirms that you have received payment for the ${
                    isRental ? "rent" : "fee"
                  } renewal.${
                    currency === "naira"
                      ? ` However, if you intend to receive the payment, you can click 'create invoice' for ${
                          isRental ? "tenant" : "occupant"
                        } to make the payment.`
                      : ""
                  }`}
            </p>
            {nonNaira && (
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                Your property was listed in a currency other than Naira. As a
                result, automatic payments and wallet transactions are not
                supported. You will need to handle all payments manually.
              </p>
            )}
          </div>
        )}

        <Button
          size="base_medium"
          className="py-2 px-6"
          onClick={action}
          type="button"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Update"}
        </Button>
      </div>
    </div>
  );
};
