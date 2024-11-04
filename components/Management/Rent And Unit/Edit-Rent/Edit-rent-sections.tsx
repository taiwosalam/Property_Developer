import {
  RentSectionTitle,
  RentSectionContainer,
  FeeDetails,
} from "../rent-section-container";
import { EstateDetailItem as DetailItem } from "../detail-item";
import { renewalRentDetailItems } from "../data";
import { SectionSeparator } from "@/components/Section/section-components";
import { useState } from "react";
import DateInput from "@/components/Form/DateInput/date-input";
import Input from "@/components/Form/Input/input";
import { currencySymbols } from "@/utils/number-formatter";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Modal/modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import type { FeeDetail } from "../types";
import SwitchUnitModal from "./SwitchUnitModal";
import SwitchPropertyModal from "@/components/Management/Rent And Unit/Edit-Rent/SwitchPropertyModal";

export const RentDetails: React.FC<{
  isRental: boolean;
}> = ({ isRental }) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>
        {isRental ? "Rent Details" : "Fee Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Fee" : "Fee"}>
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
}> = ({ isRental }) => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];
  return (
    <div>
      <RentSectionTitle>{`Edit Current ${
        isRental ? "Rent" : "Fee"
      }`}</RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <DateInput
          id="payment_date"
          label="Payment Date"
          containerClassName="bg-white"
        />
        <Input
          id="amount_paid"
          placeholder="300,000"
          label="Amount Paid"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          formatNumber
        />
      </div>
      <div className="flex items-center justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-6">
              Update
            </Button>
          </ModalTrigger>
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

export const AddPartPayment = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];
  const [createInvoice, setCreateInvoice] = useState(false);
  return (
    <div>
      <RentSectionTitle>Add Part Payment</RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Input
          id="amount"
          placeholder="300,000"
          label="Amount"
          formatNumber
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          inputClassName="bg-white"
        />
        <DateInput id="date" label="Date" containerClassName="bg-white" />
      </div>
      <div className="flex items-center justify-between gap-4 mb-2">
        <Checkbox sm checked={createInvoice} onChange={setCreateInvoice}>
          Create Invoice
        </Checkbox>
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-6">
              Update
            </Button>
          </ModalTrigger>
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

export const TransferTenants = ({ isRental }: { isRental: boolean }) => {
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
              Switch Property
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
            <SwitchUnitModal isRental={isRental} />
          </ModalContent>
        </Modal>
      </div>
    </RentSectionContainer>
  );
};

export const PreviousUnitBalance: React.FC<{ isRental: boolean }> = ({
  isRental,
}) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>Previous Unit Balance</RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Fee" : "Fee"}>
        <div className="space-y-6">
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
          <div className="space-y-2">
            <p className="text-[#747474] dark:text-white text-base font-normal">
              Balance
            </p>
            <p className="text-lg lg:text-xl font-bold text-brand-9">
              ₦300,000
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
}> = ({ isRental, feeDetails }) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>New Unit Cost</RentSectionTitle>
      <FeeDetails
        title={isRental ? "Annual Rent" : "Annual Fee"}
        feeDetails={feeDetails}
      />
    </div>
  );
};
