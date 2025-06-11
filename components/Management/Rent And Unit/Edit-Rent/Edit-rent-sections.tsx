import {
  RentSectionTitle,
  RentSectionContainer,
  FeeDetails,
} from "../rent-section-container";
import { EstateDetailItem as DetailItem } from "../detail-item";
import {
  CheckBoxOptions,
  getRenewalRentDetailItems,
  renewalRentDetailItems,
  RentPeriod,
  RentPreviousRecords,
} from "../data";
import { SectionSeparator } from "@/components/Section/section-components";
import { useEffect, useState } from "react";
import DateInput from "@/components/Form/DateInput/date-input";
import Input from "@/components/Form/Input/input";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Modal/modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import type { FeeDetail } from "../types";
import SwitchUnitModal from "./SwitchUnitModal";
import SwitchPropertyModal from "@/components/Management/Rent And Unit/Edit-Rent/SwitchPropertyModal";
import { Dayjs } from "dayjs";
import { useOccupantStore } from "@/hooks/occupant-store";
import {
  formatFee,
  UnitDataObject,
} from "@/app/(nav)/management/rent-unit/data";
import { getBalanceBreakdown } from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { useGlobalStore } from "@/store/general-store";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import { isValidAmount, parseAmount } from "./data";
import { toast } from "sonner";

export const RentDetails: React.FC<{
  isRental: boolean;
  startDate: string;
  dueDate: string;
  rentFee?: string;
  otherFee?: string;
  period?: string;
  totalPackage?: string;
  vat?: string;
  unitData?: any;
}> = ({
  isRental,
  startDate,
  dueDate,
  rentFee,
  otherFee,
  period,
  vat,
  unitData,
}) => {
  const renewalRentDetailItems = [
    { label: "Start Date", value: startDate },
    { label: "Due Date", value: dueDate },
    { label: `${period} ${isRental ? "Rent" : "Fee"}`, value: rentFee },
    { label: `Inspection Fee`, value: unitData.inspectionFee },
    { label: `Legal Fee`, value: unitData.legalFee },
    { label: `Caution Fee`, value: unitData.caution_fee },
    { label: `VAT Amount`, value: unitData.vat_amount },
    { label: "Other Fees", value: unitData.other_charge },
  ].filter((item) => isValidAmount(item.value));

  // Only render the section if there are valid items
  if (renewalRentDetailItems.length === 0) return null;

  return (
    <div className="current-rent-details space-y-6">
      <RentSectionTitle>
        {isRental ? "Current Rent" : "Fee Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Details" : "Fee"}>
        <div className="grid md:grid-cols-2 gap-4">
          {renewalRentDetailItems.map((item, index) => (
            <DetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "150px" }}
            />
          ))}
        </div>
      </RentSectionContainer>
    </div>
  );
};

export const EditCurrentRent: React.FC<{
  isRental: boolean;
  total: string;
  action?: () => void;
  loading?: boolean;
  setStart_Date?: (date: string | null) => void;
  currency?: Currency;
  setIsUpfrontPaymentChecked?: (checked: boolean) => void;
  isUpfrontPaymentChecked?: boolean;
  setSelectedCheckboxOptions?: any;
}> = ({
  isRental,
  total,
  action,
  loading,
  setStart_Date,
  currency,
  setIsUpfrontPaymentChecked,
  isUpfrontPaymentChecked,
  setSelectedCheckboxOptions,
}) => {
  const { occupant } = useOccupantStore();

  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = occupant?.userTag?.toLowerCase() === "mobile";
  const CURRENCY_SYMBOL =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];

  const nonNaira = currency !== "naira";
  // const [reqLoading, setReqLoading] = useState(false);
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

  // ================ CHECKBOX LOGICS START ===========================//
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
  });

  const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
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

  // =============== CHECKBOX LOGICS ENDS ===========================//
  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g upfront-payment-wrapper 😡🤬💀💀
  return (
    <div className="upfront-payment-wrapper">
      <div className="flex gap-1 flex-col">
        <div className="flex gap-2">
          <RentSectionTitle>
            {`Upfront ${isRental ? "Payment" : "Fee"}`}
          </RentSectionTitle>
          <Checkbox
            radio
            checked={isUpfrontPaymentChecked}
            onChange={() =>
              setIsUpfrontPaymentChecked && setIsUpfrontPaymentChecked(true)
            }
          />
        </div>
        <p>
          Select this option if the client wishes to renew with full payment
          made in advance.
        </p>
      </div>
      <SectionSeparator className="mt-4 mb-6" />
      {isUpfrontPaymentChecked && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <DateInput
              disablePast
              id="payment_date"
              label="Payment Date"
              value={startDate}
              lastYear
              onChange={handleStartDate}
              containerClassName="bg-white"
            />
            <Input
              id="amount_paid"
              label="Renewal Fee"
              inputClassName="bg-white"
              value={formatNumber(total)}
              readOnly
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              formatNumber
            />
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            {checkboxOptions.map(({ label, key }) => (
              <Checkbox
                sm
                key={key}
                checked={selectedOptions[key]}
                onChange={handleCheckboxChange(key)}
                disabled={
                  (key === "mobile_notification" && isWebUser) ||
                  (key === "create_invoice" &&
                    (!isMobileUser || (currency !== "naira" && isMobileUser)))
                }
              >
                {label}
              </Checkbox>
            ))}

            <Button
              size="base_medium"
              className="py-2 px-6"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Update"}
            </Button>

            {isWebUser ? (
              <div className="custom-flex-col gap-1">
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  {`Confirms that you have received payment for the 
          ${isRental ? "rent" : "counting"}.`}
                </p>
                {nonNaira && (
                  <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                    The property was listed in a currency other than Naira. You
                    will need to handle all payments manually.
                  </p>
                )}
              </div>
            ) : (
              <div className="custom-flex-col gap-1">
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  {selectedOptions["create_invoice"]
                    ? `Payment will be reflected once the ${
                        isRental ? "tenant" : "occupant"
                      } makes a payment towards the generated invoice. If you've already received the payment manually, you can uncheck 'Create Invoice' to reflect the rent immediately.`
                    : `Confirms that you have received payment for the ${
                        isRental ? "rent" : "counting"
                      }. ${
                        currency === "naira"
                          ? ` However, if you intend to receive the payment, you can click 'Create Invoice' for ${
                              isRental ? "tenant" : "occupant"
                            } to make the payment.`
                          : ""
                      }`}
                </p>
                {nonNaira && (
                  <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                    The property was listed in a currency other than Naira. As a
                    result, automatic payments and wallet transactions are not
                    supported. You will need to handle all payments manually.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end">
            {/* <ModalTrigger asChild> */}
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
        </>
      )}
    </div>
  );
};

export const AddPartPayment: React.FC<{
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
  // setSelectedCheckboxOptions?: (options: Record<string, boolean>) => void;
  prevAmt?: string;
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
}) => {
  const { occupant } = useOccupantStore();

  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = occupant?.userTag?.toLowerCase() === "mobile";
  // Non-naira currency message
  const nonNaira = currency !== "naira";

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

  const handleAmount = (amount: string) => {
    if (setAmt) {
      setAmt(amount);
    }
  };

  // Sync local startDate with parent startDate when it changes
  useEffect(() => {
    if (!startDate && setStart_Date) {
      setStartDate(null);
    }
  }, [setStart_Date]);

  useEffect(() => {
    if (prevAmt && setAmt) {
      setAmt(prevAmt);
    }
  }, [prevAmt, setAmt]);

  // ================ CHECKBOX LOGICS ===========================//
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
  });

  const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
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
  // useEffect(() => {
  //   setSelectedOptions((prev) => ({
  //     ...prev,
  //     mobile_notification: isWebUser
  //       ? false
  //       : isMobileUser
  //       ? true
  //       : prev.mobile_notification,
  //     create_invoice:
  //       currency !== "naira" && isMobileUser
  //         ? false
  //         : !isMobileUser
  //         ? false
  //         : prev.create_invoice,
  //   }));
  // }, [isWebUser, isMobileUser, currency]);

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
        currency === "naira" && isMobileUser
          ? // ? false
            true
          : !isMobileUser
          ? false
          : currency !== "naira" && isMobileUser
          ? false
          : true,
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

  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g part-payment-wrapper 😡🤬💀💀

  return (
    <div className="part-payment-wrapper">
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
      <SectionSeparator className="mt-4 mb-6" />
      {(!isUpfrontPaymentChecked || isCompletePayment) && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <DateInput
              id="date"
              label="Date"
              value={startDate}
              lastYear
              onChange={handleStartDate}
              containerClassName="bg-white"
              disablePast
            />
            <Input
              id="amount"
              placeholder=""
              label="Amount"
              formatNumber
              // readOnly={isCompletePayment}
              onChange={handleAmount}
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              inputClassName="bg-white"
              defaultValue={prevAmt ?? ""}
            />
          </div>
          <div className="flex items-center justify-between gap-4 mb-2">
            {/* <Checkbox sm checked={createInvoice} onChange={setCreateInvoice}>
              Create Invoice
            </Checkbox> */}
            <div className="flex items-center gap-4 flex-wrap">
              {checkboxOptions.map(({ label, key }) => (
                <Checkbox
                  sm
                  key={key}
                  checked={selectedOptions[key]}
                  onChange={handleCheckboxChange(key)}
                  disabled={
                    (key === "mobile_notification" && isWebUser) ||
                    (key === "create_invoice" &&
                      (!isMobileUser || (currency !== "naira" && isMobileUser)))
                  }
                >
                  {label}
                </Checkbox>
              ))}
            </div>
            {/* <ModalTrigger asChild> */}
            {!noBtn && (
              <Button
                size="base_medium"
                className="py-2 px-6"
                onClick={handleUpdate}
                type="button"
                disabled={loading}
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
          {isWebUser ? (
            <div className="custom-flex-col gap-1">
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                {`Confirms that you have received payment for the 
          ${isRental ? "rent" : "counting"}.`}
              </p>
              {nonNaira && (
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  The property was listed in a currency other than Naira. You
                  will need to handle all payments manually.
                </p>
              )}
            </div>
          ) : (
            <div className="custom-flex-col gap-1">
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                {selectedOptions["create_invoice"]
                  ? `Payment will be reflected once the ${
                      isRental ? "tenant" : "occupant"
                    } makes a payment towards the generated invoice. If you've already received the payment manually, you can uncheck 'Create Invoice' to reflect the rent immediately.`
                  : `Confirms that you have received payment for the ${
                      isRental ? "rent" : "counting"
                    }. ${
                      currency === "naira"
                        ? ` However, if you intend to receive the payment, you can click 'Create Invoice' for ${
                            isRental ? "tenant" : "occupant"
                          } to make the payment.`
                        : ""
                    }`}
              </p>
              {nonNaira && (
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  The property was listed in a currency other than Naira. As a
                  result, automatic payments and wallet transactions are not
                  supported. You will need to handle all payments manually.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const TransferTenants = ({
  isRental,
  propertyId,
  unitId,
  currency,
  has_part_payment,
}: {
  isRental: boolean;
  propertyId?: number;
  unitId?: number;
  currency?: Currency;
  has_part_payment?: boolean;
}) => {
  const [openPropertyModal, setOpenPropertyModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);

  const handleOpenPropertyModal = () => {
    if (has_part_payment)
      return toast.warning(
        "There's pending part payment. Finish the payment to start the rent"
      );
    setOpenPropertyModal(true);
  };

  const handleOpenUnitModal = () => {
    if (has_part_payment)
      return toast.warning(
        "There's pending part payment. Finish the payment to start the rent"
      );
    setOpenUnitModal(true);
  };

  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g transfer-tenants-wrapper 😡🤬💀💀

  return (
    <div className="transfer-tenants-wrapper">
      <RentSectionContainer
        title={`Transfer ${isRental ? "Tenants" : "Occupants"}`}
      >
        <p className="text-sm text-text-secondary dark:text-darkText-2 font-normal mb-6">
          Transfer {isRental ? "tenants" : "occupants"} to another unit within
          the same property with the option to calculate and deduct outstanding
          amounts from the new unit.
          <br />
          <br />
          Alternatively move the same {isRental ? "tenants" : "occupants"} from
          their current {isRental && "rental"} property to another{" "}
          {isRental ? "rental" : "property"} with the option to pay either the
          outstanding amounts or previous package or new package and also
          calculate and deduct any outstanding payments.
        </p>
        <div className="flex items-center gap-2 justify-end">
          <Modal
            state={{
              isOpen: openPropertyModal,
              setIsOpen: setOpenPropertyModal,
            }}
          >
            {/* <ModalTrigger asChild> */}
            <Button
              type="submit"
              className="py-2 px-6"
              size="base_medium"
              onClick={handleOpenPropertyModal}
            >
              Switch {isRental ? "Property" : "Facility"}
            </Button>
            {/* </ModalTrigger> */}
            <ModalContent>
              <SwitchPropertyModal
                isRental={isRental}
                propertyId={propertyId ?? 0}
                currency={currency || "naira"}
              />
            </ModalContent>
          </Modal>
          <Modal state={{ isOpen: openUnitModal, setIsOpen: setOpenUnitModal }}>
            {/* <ModalTrigger asChild> */}
            <Button
              onClick={handleOpenUnitModal}
              type="submit"
              className="py-2 px-6"
              size="base_medium"
            >
              Switch Unit
            </Button>
            {/* </ModalTrigger> */}
            <ModalContent>
              <SwitchUnitModal
                isRental={isRental}
                propertyId={propertyId as number}
                unitId={unitId ?? 0} //FIX BY REMOVING 0 AFTER INTEGRATING OTHER ROLES
              />
            </ModalContent>
          </Modal>
        </div>
      </RentSectionContainer>
    </div>
  );
};

export const PreviousUnitBalance: React.FC<{
  isRental: boolean;
  items: RentPreviousRecords[];
  total?: string;
  calculation?: boolean;
  workings?: boolean;
  deduction?: boolean;
  currency?: Currency;
  title?: string;
  currentUnit?: any;
  startDate?: string;
  dueDate?: string;
  page?: "unit" | "property";
  deductionsCal?: any;
  deductionsRes?: any;
}> = ({
  isRental,
  items,
  total,
  calculation,
  deduction,
  currency,
  workings,
  title,
  currentUnit,
  startDate,
  dueDate,
  page,
  deductionsCal,
  deductionsRes,
}) => {
  const isUnit = page === "unit";
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const currentRentStats = useGlobalStore((s) => s.currentRentStats);
  const period = currentUnit.fee_period;
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";
  const prevUBreakdown = currentRentStats?.prevUBreakdown || [];
  const breakdown = currentRentStats?.breakdown || [];

  console.log("prevUBreakdown", prevUBreakdown);
  console.log("currentUnit", currentUnit);

  const record = items[0];
  const records = items;
  const rent = currentUnit.newTenantTotalPrice;
  const renewalTenantPrice = parseCurrency(currentUnit.renewalTenantPrice);
  console.log("renewalTenantPrice parent", renewalTenantPrice);

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
    // Only update if the value has changed
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

  // const balanceBreakdown = record
  //   ? getBalanceBreakdown(record, period, currencySymbol)
  //   : { duration: "-", breakdown: [] };

  // useEffect(() => {
  //   const newBalanceBreakdown = record
  //     ? getBalanceBreakdown(rent, record, records, period, currencySymbol)
  //     : { duration: "-", breakdown: [] };
  //   // Only update if the value has changed
  //   const currentStats = useGlobalStore.getState().currentRentStats;
  //   if (JSON.stringify(currentStats) !== JSON.stringify(newBalanceBreakdown)) {
  //     setGlobalStore("currentRentStats", newBalanceBreakdown);
  //   }
  // }, [record, period, currencySymbol, rent, setGlobalStore]);

  const currentRentDetailItems = [
    {
      label: `${currentUnit.fee_period} Rent`,
      value: formatFee(
        currentUnit.newTenantTotalPrice,
        currentUnit.currency || "naira"
      ),
    },
    { label: "Start Date", value: startDate },
    { label: "Due Date", value: dueDate },
    ...breakdown,
  ].filter((item) => {
    // Exclude items where value is undefined, empty, or an invalid placeholder
    if (item.value === undefined || item.value === "") return false;
    if (typeof item.value === "string" && /^_.*,.*,_*$/.test(item.value))
      return false;
    return true;
  });

  const unitDetails = [
    { label: "Start Date", value: startDate },
    { label: "Due Date", value: dueDate },
    {
      label: `${currentUnit.fee_period} Rent`,
      value: currentUnit.newTenantPrice,
    },
    { label: `Inspection Fee`, value: currentUnit.inspection_fee },
    { label: `Legal Fee`, value: currentUnit.legal_fee },
    { label: `Caution Fee`, value: currentUnit.caution_fee },
    { label: `VAT Amount`, value: currentUnit.vat_amount },
    { label: "Service Charge", value: currentUnit.service_charge },
    { label: "Agency Fee", value: currentUnit.unitAgentFee },
    { label: "Other Fee", value: currentUnit.other_charge },
    { label: "Total Package", value: currentUnit.newTenantPrice },
  ].filter((item) => {
    // Exclude items where value is undefined, empty, or an invalid placeholder
    if (item.value === undefined || item.value === "") return false;
    if (typeof item.value === "string" && /^_.*,.*,_*$/.test(item.value))
      return false;
    return true;
  });

  const detailsArr = isUnit ? unitDetails : currentRentDetailItems;

  // Only render the section if there are valid items
  if (renewalRentDetailItems.length === 0) return null;

  console.log("detailsArr", detailsArr);

  const sub_title = !deduction
    ? "Do not deduct the current outstanding rent balance from the cost of the new unit that the tenants are moving into."
    : "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost.";

  const Deductsub_title = calculation
    ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
    : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before.";

  return (
    <div className="space-y-1">
      <RentSectionTitle>{title ?? "Current Rent"}</RentSectionTitle>
      {workings && (
        <>
          <p className="text-sm">• {sub_title}</p>
          <p className="text-sm">• {Deductsub_title}</p>
        </>
      )}
      <RentSectionContainer
        title={
          workings ? "Breakdown" : isRental ? "Breakdown" : "Apply Deduction"
        }
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {!workings &&
              detailsArr.map((item, index) => (
                <DetailItem
                  key={index}
                  label={item.label}
                  value={item.value as string}
                  style={{ width: "150px" }}
                />
              ))}
            {/* PREVIOUS UNIT BREAKDOWN */}
            {workings && (
              <>
                {deductionsCal.map((item: any, index: number) => (
                  <DetailItem
                    key={index}
                    label={item.label}
                    value={item.value as string}
                    style={{ width: "150px" }}
                  />
                ))}
              </>
            )}
          </div>
          {/*  CALCULATIONS & RESULT */}
        </div>
        {/* {workings && (
          <div className="my-4">
            <span className="font-medium text-brand-10 text-base">
              {title ?? "Current Rent"}
            </span>
            <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 mb-4" />
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {deductionsRes.map((item: any, index: number) => (
                  <DetailItem
                    key={index}
                    label={item.label}
                    value={item.value as string}
                    style={{ width: "150px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )} */}
        {workings && (
          <div className="space-y-2 mt-4">
            <p className="text-[#747474] dark:text-white text-base font-normal">
              Balance
            </p>
            <p className="text-lg lg:text-xl font-bold text-brand-9">
              {currencySymbol}
              {formatNumber(Math.abs(Number(total)))}
            </p>
          </div>
        )}
      </RentSectionContainer>
    </div>
  );
};

export const NewUnitCost: React.FC<{
  isRental: boolean;
  feeDetails: FeeDetail[];
  total?: number;
  id?: string;
  calculation?: boolean;
  deduction?: boolean;
  isExcess?: boolean;
  title?: string;
  noEdit?: boolean;
  currency?: Currency;
}> = ({
  isRental,
  feeDetails,
  total,
  id,
  calculation,
  deduction,
  title,
  noEdit,
  currency,
  isExcess,
}) => {
  const feeTitle = isRental
    ? deduction
      ? "Breakdown"
      : "Breakdown"
    : "Annual Fee";
  const finalTitle = calculation ? `${feeTitle}` : `${feeTitle}`;
  const sub_title = !deduction
    ? "Do not deduct the current outstanding rent balance from the cost of the new unit that the tenants are moving into."
    : "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost.";

  const Deductsub_title = calculation
    ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
    : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before.";

  return (
    <div className="space-y-1">
      <RentSectionTitle>{title || "New Rent "}</RentSectionTitle>
      <>
        <p className="text-sm">• {sub_title}</p>
        <p className="text-sm">• {Deductsub_title}</p>
      </>
      {isExcess && <p className="text-sm">{Deductsub_title}</p>}
      <FeeDetails
        noEdit={noEdit}
        title={finalTitle}
        feeDetails={feeDetails}
        isExcess={isExcess}
        currency={currency}
        total_package={total as number}
        deduction={deduction}
        id={id as string}
      />
    </div>
  );
};

type PayAbleProps = {
  isRental: boolean;
  detail: { label: string; amount: number };
  calculation?: boolean;
  deduction?: boolean;
  isExcess?: boolean;
  currency?: Currency;
};

export const PayAble: React.FC<PayAbleProps> = ({
  isRental,
  detail,
  calculation,
  deduction,
  isExcess,
  currency,
}) => {
  const CURRENCY =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];

  const feeTitle = isRental ? "Breakdown" : "Annual Fee";
  // Subtitles
  const subtitles = {
    zero: "Based on the calculation and your selected option, there is no outstanding balance. Neither your company nor the client owes any refund or payment.",
    refund:
      "Based on the calculation and your selected option, the client has an excess balance to be paid to your company.",
    excess:
      "Based on the calculation and your selected option, your company owes the client a refund balance.",
  };

  // Determine subtitle based on totalPayable and isExcess
  const subtitle =
    detail.amount === 0
      ? subtitles.zero
      : isExcess
      ? subtitles.excess
      : subtitles.refund;

  return (
    <div className="space-y-1">
      <RentSectionTitle>Payment Status</RentSectionTitle>
      <p className="text-sm">• {subtitle}</p>
      <div className="mt-2">
        <p className="text-md font-semibold mt-3 text-text-secondary">Total</p>
        <p className="text-lg lg:text-xl text-brand-9 font-bold">
          {CURRENCY}
          {formatNumber(Math.abs(detail.amount))}
        </p>
      </div>
    </div>
  );
};

export const CompletePartPayment: React.FC<{
  total: number;
  feeDetails: FeeDetail[];
  currency?: Currency;
  setIsCompletePayment?: (checked: boolean) => void;
}> = ({ total, feeDetails, setIsCompletePayment, currency }) => {
  const [toggled, setToggled] = useState(false);
  const CURRENCY = currencySymbols[currency as keyof typeof currencySymbols];
  // Filter out fee details with invalid amounts
  const validFeeDetails = feeDetails.filter((fee) => {
    const parsedAmount = parseAmount(fee.amount);
    return parsedAmount > 0;
  });

  const handleClick = () => {
    const newValue = !toggled;
    setToggled(newValue);
    if (setIsCompletePayment) {
      setIsCompletePayment(newValue);
    }
  };

  return (
    <div className="complete-part-payment-wrapper space-y-1">
      <RentSectionTitle>Complete Part Payment</RentSectionTitle>
      <div className="mt-4 bg-white p-4 rounded-md">
        <div className="grid grid-cols-2">
          {validFeeDetails.map((fee, index) => (
            <DetailItem
              key={index}
              style={{ width: "120px" }}
              label={fee.name}
              value={`${fee?.amount}`}
            />
          ))}
        </div>
        <div className="flex items-end justify-end w-full mt-2">
          <Button
            // onClick={() => setIsCompletePayment && setIsCompletePayment(true)}
            onClick={handleClick}
            type="submit"
            className="py-2 px-6"
            size="base_medium"
          >
            {toggled ? "Cancel" : "Pay Balance"}
          </Button>
        </div>
      </div>
    </div>
  );
};
