"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { empty } from "@/app/config";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteDisbursementModal from "@/components/Accounting/Disbursement/delete-disbursement-modal";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { currencySymbols } from "@/utils/number-formatter";
import TextArea from "@/components/Form/TextArea/textarea";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { DeleteIconX } from "@/public/icons/icons";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { SectionSeparator } from "@/components/Section/section-components";

const paymentModes = [
  "Bank Transfer",
  "Cash Deposit",
  "Cash Payment",
  "Wallet",
  "Other Mode of Payment",
];

const ManageDisbursement = () => {
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    [
      {
        title: "Unit 1",
        amount: 1000000,
      },
      {
        title: "Unit 2",
        amount: 1000000,
      },
      {
        title: "Unit 3",
        amount: 1000000,
      },
      {
        title: "Unit 4",
        amount: 1000000,
      },
      {
        title: "Unit 5",
        amount: 1000000,
      },
    ]
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
  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalExpenses = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  // deducted payment
  const [deductions, setDeductions] = useState<
    { date: Dayjs; amount: number }[]
  >([]);
  const [deductionDate, setDeductionDate] = useState<Dayjs | null>(null);
  const [deductionAmount, setDeductionAmount] = useState<string>("");

  const handleDeductClick = () => {
    if (deductionDate && deductionAmount) {
      const parsedAmount = parseFloat(deductionAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setDeductions([
          ...deductions,
          { date: deductionDate, amount: parsedAmount },
        ]);
        setDeductionDate(null);
        setDeductionAmount("");
      }
    }
  };
  const handleDeleteDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const totalDeductions = deductions.reduce(
    (total, deduction) => total + deduction.amount,
    0
  );

  const totalBalance = totalExpenses - totalDeductions;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "disbursement id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "unit name": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
            <TextArea
              id="transaction-description"
              className="sm:col-span-2"
              inputSpaceClassName="bg-white !h-[120px]"
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
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Disbursement">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
              <Select
                id="unit"
                label="Unit name"
                required
                placeholder="Select Options"
                options={["unit 1", "unit 2"]}
                value={paymentTitle}
                onChange={(v) => setPaymentTitle(v)}
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                // placeholder="300,000"
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
                add
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        {/* ADDED PAYMENT */}
        <AccountingTitleSection title="Disbursement">
          <div className="space-y-8 bg-white dark:bg-darkText-primary w-full p-6 rounded-lg">
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
                          useCase="disbursement"
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
                Total Expenses
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(totalExpenses)}
              </p>
            </div>
          </div>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex gap-4 items-center justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_bold" variant="light_red" className="py-2 px-8">
              delete disbursement
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteDisbursementModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button size="base_bold" className="py-2 px-8">
            save
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageDisbursement;
