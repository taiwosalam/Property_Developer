"use client";

import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { SectionSeparator } from "@/components/Section/section-components";
import { empty } from "@/app/config";
import { useState } from "react";
import ExportPageHeader from "@/components/reports/export-page-header";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";
import { currencySymbols } from "@/utils/number-formatter";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";

const paymentModes = [
  "Bank Transfer",
  "Cash Deposit",
  "Cash Payment",
  "Wallet",
  "Other Mode of Payment",
];

const CreateDisbursement = () => {
  const [isAddPaymentChecked, setIsAddPaymentChecked] = useState(true);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const handleGenerateInvoiceCheckboxChange = (checked: boolean) => {
    setIsSelectDisabled(checked);
  };

  // Two separate arrays for each payment type
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>([]);
  const [unitPayments, setUnitPayments] = useState<{ title: string; amount: number }[]>([]);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Use the appropriate array based on isAddPaymentChecked
  const handleAddPaymentClick = () => {
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        if (isAddPaymentChecked) {
          setPayments([...payments, { title: paymentTitle, amount: parsedAmount }]);
        } else {
          setUnitPayments([...unitPayments, { title: paymentTitle, amount: parsedAmount }]);
        }
        setPaymentTitle("");
        setPaymentAmount("");
      }
    }
  };

  // Handle deletion based on isAddPaymentChecked flag
  const handleDeletePayment = (index: number) => {
    if (isAddPaymentChecked) {
      setPayments(payments.filter((_, i) => i !== index));
    } else {
      setUnitPayments(unitPayments.filter((_, i) => i !== index));
    }
  };

  // Determine which payment list to display
  const displayedPayments = isAddPaymentChecked ? payments : unitPayments;
  const totalAmount = displayedPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const CURRENCY_SYMBOL = currencySymbols.naira;

  return (
    <section className="space-y-7 pb-20">
      <BackButton>Create New Disbursement</BackButton>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
          <Select
            required
            id="property"
            label="property"
            options={["property 1", "property 2", "property 3"]}
          />
          <Select
            id="disbursement-mode"
            label="disbursement mode"
            placeholder="Bank Transfer"
            options={paymentModes}
            className="self-end"
            inputContainerClassName="bg-white"
          />
        </div>
        <TextArea
          id="description"
          label="Disbursement Description"
          required
          className="lg:max-w-[50%]"
        />
      </div>

      <div className="space-y-6">
        <div className="flex gap-1 flex-col">
          <div className="flex gap-2">
            <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Add Property Disbursement
            </h3>
            <Checkbox
              radio
              checked={isAddPaymentChecked}
              onChange={() => setIsAddPaymentChecked(true)}
            />
          </div>
          <p>Select this option if you are recording a disbursement for the entire property, and assign a title based on the event.</p>
        </div>
        {isAddPaymentChecked && (
          <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="text"
                id="payment_title"
                label="Payment Title"
                value={paymentTitle}
                onChange={(value) => setPaymentTitle(value)}
              />
              <Input
                type="text"
                id="amount"
                label="Amount"
                className="w-full"
                CURRENCY_SYMBOL={"₦"}
                formatNumber
                value={paymentAmount}
                onChange={(value) => setPaymentAmount(value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <Button
                size="base_medium"
                className="py-2 px-8"
                onClick={handleAddPaymentClick}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* <div className="flex items-center gap-4">
          <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
            Add Unit Disbursement
          </h1>
          <Checkbox
            radio
            checked={!isAddPaymentChecked}
            onChange={() => setIsAddPaymentChecked(false)}
          />
        </div> */}
        <div className="flex gap-1 flex-col">
          <div className="flex gap-2">
            <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Add Unit Disbursement
            </h3>
            <Checkbox
              radio
              checked={!isAddPaymentChecked}
              onChange={() => setIsAddPaymentChecked(false)}
            />
          </div>
          <p>Select whether you are disbursing payment for a specific unit or multiple units within the same property.</p>
        </div>
        {!isAddPaymentChecked && (
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
              <Select
                id="unit"
                label="Unit name"
                placeholder="Select Options"
                options={["unit 1", "unit 2"]}
                value={paymentTitle}
                onChange={(v) => setPaymentTitle(v)}
              />
              <Input
                id="amount"
                label="Amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                value={paymentAmount}
                onChange={(v) => setPaymentAmount(v)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="base_medium"
                className="py-2 px-14"
                onClick={handleAddPaymentClick}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      {displayedPayments.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
            Payment Added
          </h3>

          <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              {displayedPayments.map((payment, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1 capitalize">
                    {payment.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(payment.amount)}
                    </p>
                    <Modal>
                      <ModalTrigger aria-label={`Delete ${payment.title}`}>
                        <DeleteIconX />
                      </ModalTrigger>
                      <ModalContent>
                        <DeleteItemWarningModal
                          item={payment.title}
                          amount={payment.amount}
                          handleDelete={() => handleDeletePayment(index)}
                          useCase="invoices"
                        />
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              ))}
            </div>
            <SectionSeparator />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Added Payment
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}

      <FixedFooter className="flex items-center justify-end gap-4">
        <Button className="py-2 px-8" size="base_medium" variant="sky_blue">
          Cancel
        </Button>
        <Button type="submit" className="py-2 px-8" size="base_medium">
          Create
        </Button>
      </FixedFooter>
    </section>
  );
};

export default CreateDisbursement;