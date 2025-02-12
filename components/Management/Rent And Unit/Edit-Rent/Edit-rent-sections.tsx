import {
  RentSectionTitle,
  RentSectionContainer,
  FeeDetails,
} from "../rent-section-container";
import { EstateDetailItem as DetailItem } from "../detail-item";
import { getRenewalRentDetailItems, renewalRentDetailItems, RentPreviousRecords } from "../data";
import { SectionSeparator } from "@/components/Section/section-components";
import { useState } from "react";
import DateInput from "@/components/Form/DateInput/date-input";
import Input from "@/components/Form/Input/input";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Modal/modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import type { FeeDetail } from "../types";
import SwitchUnitModal from "./SwitchUnitModal";
import SwitchPropertyModal from "@/components/Management/Rent And Unit/Edit-Rent/SwitchPropertyModal";
import { Dayjs } from "dayjs";

export const RentDetails: React.FC<{
  isRental: boolean;
  startDate: string;
  dueDate: string;
  rentFee: string;
  otherFee: string;
  period?: string;
}> = ({ isRental, startDate, dueDate, rentFee, otherFee, period }) => {
  const renewalRentDetailItems = [
    { label: "Start Date", value: startDate },
    { label: "Due Date", value: dueDate },
    { label: `${period} Rent`, value: rentFee },
    { label: "Other Fees", value: otherFee },
  ];
  return (
    <div className="space-y-6">
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
}> = ({ isRental, total, action, loading, setStart_Date, }) => {
  const CURRENCY_SYMBOL = currencySymbols.naira;
  // const [reqLoading, setReqLoading] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleStartDate = (date: Dayjs | null) => {
    setStartDate(date);
    if (setStart_Date) {
      setStart_Date(date?.format("YYYY-MM-DD") || null);
    }
  }

  const handleUpdate = async () => {
    if (action) {
      await action();
      setModalIsOpen(true);
    }
  }

  return (
    <div>
      <RentSectionTitle>{`Add Upfront ${isRental ? "Payment" : "Fee"
        }`}</RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <DateInput
          disablePast
          id="payment_date"
          label="Payment Date"
          value={startDate}
          onChange={handleStartDate}
          containerClassName="bg-white"
        />
        <Input
          id="amount_paid"
          placeholder="300,000"
          label="Renewal Fee"
          inputClassName="bg-white"
          value={formatNumber(total)}
          readOnly
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          formatNumber
        />
      </div>
      <div className="flex items-center justify-end">
        {/* <ModalTrigger asChild> */}
        <Button
          size="base_medium"
          className="py-2 px-6"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Please wait." : "Update"}
        </Button>
        {/* </ModalTrigger> */}
        <Modal
          state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}
        >
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
    </div>
  );
};

export const AddPartPayment: React.FC<{
  action?: () => void;
  loading?: boolean;
  setAmt?: (amount: string) => void;
  setStart_Date?: (date: string | null) => void;
}> = ({ action, loading, setStart_Date, setAmt }) => {
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const [createInvoice, setCreateInvoice] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleStartDate = (date: Dayjs | null) => {
    setStartDate(date);
    if (setStart_Date) {
      setStart_Date(date?.format("YYYY-MM-DD") || null);
    }
  }

  const handleUpdate = async () => {
    if (action) {
      await action();
      setModalIsOpen(true);
    }
  }

  const handleAmount = (amount: string) => {
    if (setAmt) {
      setAmt(amount);
    }
  }

  return (
    <div>
      <RentSectionTitle>Add Part Payment</RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Input
          id="amount"
          placeholder=""
          label="Amount"
          formatNumber
          onChange={handleAmount}
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          inputClassName="bg-white"
        />
        <DateInput
          id="date"
          label="Date"
          value={startDate}
          onChange={handleStartDate}
          containerClassName="bg-white"
          disablePast
        />
      </div>
      <div className="flex items-center justify-between gap-4 mb-2">
        <Checkbox sm checked={createInvoice} onChange={setCreateInvoice}>
          Create Invoice
        </Checkbox>
        {/* <ModalTrigger asChild> */}
        <Button
          size="base_medium"
          className="py-2 px-6"
          onClick={handleUpdate}
          type="button"
          disabled={loading}
        >
          {loading ? "Please wait." : "Update"}
        </Button>
        {/* </ModalTrigger> */}
        <Modal
          state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}
        >
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
      <p className="text-sm font-medium text-text-secondary dark:text-darkText-1 w-fit ml-auto">
        {createInvoice
          ? "Partial payment will be reflected once the tenant makes a payment towards the generated invoice."
          : "Clicking 'update' confirms the partial payment. However, if you intend to receive the payment, you can click 'create invoice' for tenants to make the payment."}
      </p>
    </div>
  );
};

export const TransferTenants = ({
  isRental,
  propertyId
}: {
  isRental: boolean,
  propertyId?: number;
}) => {
  return (
    <RentSectionContainer
      title={`Transfer ${isRental ? "Tenants" : "Occupants"}`}
    >
      <p className="text-sm text-text-secondary dark:text-darkText-2 font-normal mb-6">
        Transfer {isRental ? "tenants" : "occupants"} to another unit within the
        same property with the option to calculate and deduct outstanding
        amounts from the new unit.
        <br />
        Alternatively move the same {isRental ? "tenants" : "occupants"} from
        their current {isRental && "rental"} property to another{" "}
        {isRental ? "rental" : "property"} with the option to pay either the
        outstanding amounts or previous package or new package and also
        calculate and deduct any outstanding payments.
      </p>
      <div className="flex items-center gap-2 justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button type="submit" className="py-2 px-6" size="base_medium">
              Switch {isRental ? "Property" : "Facility"}
            </Button>
          </ModalTrigger>
          <ModalContent>
            <SwitchPropertyModal isRental={isRental} />
          </ModalContent>
        </Modal>
        <Modal>
          <ModalTrigger asChild>
            <Button type="submit" className="py-2 px-6" size="base_medium">
              Switch Unit
            </Button>
          </ModalTrigger>
          <ModalContent>
            <SwitchUnitModal isRental={isRental} propertyId={propertyId as number} />
          </ModalContent>
        </Modal>
      </div>
    </RentSectionContainer>
  );
};

export const PreviousUnitBalance: React.FC<{
  isRental: boolean;
  items: RentPreviousRecords[];
  total?: string;
  calculation?: boolean
  deduction?: boolean
}> = ({
  isRental,
  items,
  total,
  calculation,
  deduction,
}) => {
    // const displayDetails = feeDetails.length > 0 ? feeDetails : [{ label: "No Fee Details", value: "N/A" }];
    const sub_title = deduction ? "Do not deduct the current outstanding rent balance from the cost of the new unit that the tenants are moving into." : "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost.";

    return (
      <div className="space-y-1">
        <RentSectionTitle>Previous Unit Balance</RentSectionTitle>
        <p className="text-xs"> {sub_title} </p>
        <RentSectionContainer title={isRental ? "Rent Details" : "Fee"}>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {getRenewalRentDetailItems(items).map((item, index) => (
                <DetailItem
                  key={index}
                  label={item.label}
                  value={item.value as string}
                  style={{ width: "150px" }}
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[#747474] dark:text-white text-base font-normal">
                Balance
              </p>
              <p className="text-lg lg:text-xl font-bold text-brand-9">
                ₦{formatNumber(Number(total))}
              </p>
            </div>
          </div>
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
  title?: string;
  noEdit?: boolean;
}> = ({
  isRental,
  feeDetails,
  total,
  id,
  calculation,
  deduction,
  title,
  noEdit
}) => {
    const feeTitle = isRental ? (deduction ? "Rent Details" : "Rent Calculation") : "Annual Fee";
    const finalTitle = calculation ? `${feeTitle}` : `${feeTitle}`;
    const sub_title = calculation ? "Calculate the total package of the new rent, including caution deposit, Service Charge, agency fee, legal fee and other Charges for the tenants that you are transferring to the new unit." : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before.";
    return (
      <div className="space-y-1">
        <RentSectionTitle>{title || "New Unit Cost"}</RentSectionTitle>
        {!noEdit && <p className="text-xs">{sub_title}</p>}
        <FeeDetails
          noEdit={noEdit}
          title={finalTitle}
          feeDetails={feeDetails}
          total_package={total as number}
          deduction={deduction}
          id={id as string}
        />
      </div>
    );
  };
