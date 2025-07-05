import { useOccupantStore } from "@/hooks/occupant-store";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { RentSectionTitle } from "../rent-section-container";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { SectionSeparator } from "@/components/Section/section-components";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import OwingFee from "./owing-fee";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import PaymentCheckBoxs from "../payment-checkbox";
import PaymentConfirmationText from "../payment-checkbox-texts";
import { useGlobalStore } from "@/store/general-store";

export const RenewRentAddPartPayment: React.FC<{
  action?: () => void;
  isRental?: boolean;
  loading?: boolean;
  noBtn?: boolean;
  isCompletePayment?: boolean;
  setAmt?: (amount: string) => void;
  setStart_Date?: (date: string | null) => void;
  currency?: Currency;
  setIsUpfrontPaymentChecked?: (checked: boolean) => void;
  isUpfrontPaymentChecked?: boolean;
  setSelectedCheckboxOptions?: any;
  prevAmt?: string;
  disabled?: boolean;
}> = ({
  action,
  isRental,
  loading,
  noBtn,
  setStart_Date,
  setAmt,
  currency,
  setIsUpfrontPaymentChecked,
  isUpfrontPaymentChecked,
  setSelectedCheckboxOptions,
  isCompletePayment,
  prevAmt,
  disabled,
}) => {
  const { occupant } = useOccupantStore();
  const canSubmitRent = useGlobalStore((state) => state.canSubmitRent);
  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = occupant?.userTag?.toLowerCase() === "mobile";

  const CURRENCY_SYMBOL =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];
  const [createInvoice, setCreateInvoice] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleStartDate = (date: Dayjs | null) => {
    setStartDate(date);
    if (setStart_Date) {
      setStart_Date(date?.format("YYYY-MM-DD") || null);
    }
  };

  const handleUpdate = async () => {
    if (action) {
      await action();
      // setModalIsOpen(true);
    }
  };

  useEffect(() => {
    if (prevAmt && setAmt) {
      setAmt(prevAmt);
    }
  }, [prevAmt, setAmt]);

  const handleAmount = (amount: string) => {
    if (setAmt) {
      setAmt(amount);
    }
  };

  // ================ CHECKBOX LOGICS ===========================//
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
  });

  // TO USE THE PAYMENTCHECKBOX COMPONENT 👉: use (optionKey, checked) signature for toggling
  const handleCheckboxChange = (optionKey: string, checked: boolean) => {
    if (optionKey === "mobile_notification" && isWebUser) {
      return; // Prevent changing this option for web users
    }
    if (optionKey === "create_invoice" && !isMobileUser) {
      return; // Prevent changes for non-mobile users
    }
    setSelectedOptions((prev) => ({
      ...prev,
      [optionKey]: checked,
    }));
  };

  // Update selectedOptions when userTag changes
  useEffect(() => {
    setSelectedOptions((prev) => ({
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

  useEffect(() => {
    if (setSelectedCheckboxOptions) {
      setSelectedCheckboxOptions(selectedOptions);
    }
  }, [selectedOptions, setSelectedCheckboxOptions]);

  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    { label: "Email Alert", key: "email_alert" },
  ];

  const visibleCheckboxOptions = isWebUser
    ? checkboxOptions.filter(
        (option) =>
          option.key !== "create_invoice" &&
          option.key !== "mobile_notification"
      )
    : checkboxOptions;

  return (
    <div className="renew-rent-part-payment-wrapper">
      <div className="flex gap-1 flex-col">
        <div className="flex gap-2">
          <RentSectionTitle>
            {isCompletePayment ? "Finish Payment" : "Part Payment"}
          </RentSectionTitle>
          {!isCompletePayment && (
            <Checkbox
              // disabled={isUpfrontPaymentChecked}
              radio
              checked={!isUpfrontPaymentChecked}
              onChange={() =>
                setIsUpfrontPaymentChecked && setIsUpfrontPaymentChecked(false)
              }
            />
          )}
        </div>
        <p>
          {isCompletePayment
            ? "Click Update to settle the remaining balance following the initial partial payment."
            : "Select this option if the client wishes to make a partial advance payment of the total amount."}
        </p>
      </div>
      {/* <OwingFee show={!isUpfrontPaymentChecked} /> */}
      <SectionSeparator className="mt-4 mb-6" />
      {(!isUpfrontPaymentChecked || isCompletePayment) && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Input
              id="amount"
              placeholder=""
              label="Amount"
              formatNumber
              readOnly={disabled}
              onChange={handleAmount}
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              inputClassName="bg-white"
              //   value={prevAmt ?? ""}
              defaultValue={formatNumber(parseCurrency(prevAmt)) ?? 0}
            />
            <DateInput
              id="date"
              label="Date"
              value={startDate}
              lastYear
              onChange={handleStartDate}
              containerClassName="bg-white"
              disablePast
            />
          </div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4 flex-wrap">
              <PaymentCheckBoxs
                options={visibleCheckboxOptions}
                selectedOptions={selectedOptions}
                onChange={handleCheckboxChange}
                isWebUser={isWebUser}
                isMobileUser={isMobileUser}
                currency={currency}
              />
            </div>
            {/* <ModalTrigger asChild> */}
            {!noBtn && (
              <Button
                size="base_medium"
                className="py-2 px-6"
                onClick={handleUpdate}
                type="button"
                disabled={loading || !canSubmitRent}
              >
                {loading ? "Please wait..." : "Update"}
              </Button>
            )}
            {/* </ModalTrigger> */}
            <Modal state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}>
              <ModalContent>
                <ModalPreset type="success" className="w-full">
                  <div className="flex flex-col gap-10">
                    <p className="text-text-tertiary text-sm">
                      Record Added Successfully
                    </p>
                    <ModalTrigger asChild close>
                      <Button>Ok</Button>
                    </ModalTrigger>
                  </div>
                </ModalPreset>
              </ModalContent>
            </Modal>
          </div>
          {/* PAYMENT CONFIRMATION TEXTS */}
          <PaymentConfirmationText
            isWebUser={isWebUser}
            isRental={isRental ?? false}
            nonNaira={currency !== "naira"}
            selectedOptions={selectedOptions}
            currency={currency}
          />
        </>
      )}
    </div>
  );
};
