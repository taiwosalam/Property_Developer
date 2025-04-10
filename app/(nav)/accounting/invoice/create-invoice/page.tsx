




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

const CreateInvoicePage = () => {
  const [isAddPaymentChecked, setIsAddPaymentChecked] = useState(true);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const handleGenerateInvoiceCheckboxChange = (checked: boolean) => {
    setIsSelectDisabled(checked);
  };

  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    []
  );
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const handleAddPaymentClick = () => {
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setPayments([
          ...payments,
          { title: paymentTitle, amount: parsedAmount },
        ]);
        setPaymentTitle("");
        setPaymentAmount("");
      }
    }
  };
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-7 pb-20">
      <BackButton>Create New Invoice</BackButton>
      {/* <ExportPageHeader /> */}
      <div className="flex flex-col gap-4">
        <Details />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            id="tenant_name"
            options={["Tenant 1", "Tenant 2"]}
            label="Tenant/Occupant"
            disabled={isSelectDisabled}
          />
          <Checkbox
            className="self-end items-start text-left"
            checked={isSelectDisabled}
            onChange={handleGenerateInvoiceCheckboxChange}
          >
            Click to generate invoive for all tenants and occupants of this
            property (mobile users)
          </Checkbox>
          <Select
            id="auto_generate"
            options={["Once", "Weekly", "Monthly"]}
            label="Auto Generate"
            placeholder="Select Options"
            disabled={!isSelectDisabled}
          />
        </div>
        <TextArea
          id="description"
          label="Description"
          required
          className="lg:max-w-[50%]"
        />
      </div>

      <div className="space-y-6">
        <div className="flex gap-1 flex-col">
          <div className="flex gap-2">
            <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Add Payment
            </h3>
            <Checkbox
              radio
              checked={isAddPaymentChecked}
              onChange={() => setIsAddPaymentChecked(true)}
            />
          </div>
          <p>Choose to create a manual payment for a specific bill or set it to auto-payment for a designated period.</p>
        </div>
        {isAddPaymentChecked && (
          <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="text"
                id="payment_title"
                label="Payment Title"
                value={paymentTitle}
                onChange={(value) => setPaymentTitle(value as string)}
              />
              <Input
                type="text"
                id="amount"
                label="Amount"
                className="w-full"
                CURRENCY_SYMBOL={"₦"}
                formatNumber
                value={paymentAmount}
                onChange={(value) => setPaymentAmount(value as string)}
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
        <div className="flex gap-1 flex-col">
          <div className="flex gap-2">
            <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Generated Rent Breakdown
            </h3>
            <Checkbox
              disabled={isSelectDisabled}
              radio
              checked={!isAddPaymentChecked}
              onChange={() => setIsAddPaymentChecked(false)}
            />
          </div>
          <p>Select to create a pending payment for tenants/occupants to pay their renewal fees.</p>
        </div>
        {!isAddPaymentChecked && <Breakdown />}
      </div>

      {payments.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
            Payment Added
          </h3>

          <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              {payments.map((payment, index) => (
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

      {/* <div className="space-y-4 text-[#3F4247] text-sm dark:text-darkText-1">
        <div className="flex gap-4">
          {["Notification", "SMS Alert", "Email Alert"].map((option) => (
            <Checkbox sm key={option} defaultChecked>
              {option}
            </Checkbox>
          ))}
        </div>
        <p>
          Payment will be reflected on the receipt page once the selected client
          makes a payment for this generated invoice
        </p>
      </div> */}
      <FixedFooter className="flex items-center justify-end gap-4">
        {/* <Button className="py-2 px-8" size="base_medium" variant="sky_blue">
          Cancel
        </Button> */}
        <Button type="submit" className="py-2 px-8" size="base_medium">
          Create
        </Button>
      </FixedFooter>
    </section>
  );
};

export default CreateInvoicePage;
