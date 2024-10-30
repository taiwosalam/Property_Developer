"use client";

import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteExpenseModal from "@/components/Accounting/expenses/delete-expense-modal";
import { empty } from "@/app/config";
import useDarkMode from "@/hooks/useCheckDarkMode";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useRouter } from "next/navigation";
import { SectionSeparator } from "@/components/Section/section-components";
import ModalPreset from "@/components/Modal/modal-preset";

const ManageExpenses = () => {
  const isDarkMode = useDarkMode();
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="custom-flex-col gap-10 pb-[150px] sm:pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Manage Expenses</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "payment id": "",
              "customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Description">
          <p className="text-sm text-text-secondary">
            New rent payment for 3 bedroom at Ajibade road 2, Lekki Lagos
          </p>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Expense">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <Input id="payment-title" label="payment title" />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
            </div>
            <div className="flex justify-end">
              <Button size="base_medium" className="py-2 px-14">
                add
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Expenses">
          <div className="flex bg-white w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Fee"
                required
                CURRENCY_SYMBOL="₦"
                placeholder="1,000,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
              <Input
                id="non-refundable-agency-fee"
                label="tax charges"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
              <Input
                id="non-refundable-legal-fee"
                label="security fee"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
            </div>
            <SectionSeparator />
            <div>
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Amount
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })
                  .format(1000000)
                  .split(".")}
              </p>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Deduct Payment">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <Input id="payment-title" label="payment title" />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: isDarkMode ? "" : "white" }}
              />
            </div>
            <div className="flex justify-end">
              <Button size="base_medium" className="py-2 px-14">
                deduct
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Payment">
          <div className="flex bg-white w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  25 January 2024
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  25 January 2024
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  25 January 2024
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Total Payment
                </p>
                <p className="font-bold text-xl text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
            </div>
            <SectionSeparator />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Amount
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })
                  .format(1000000)
                  .split(".")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
              Total Balance
            </p>
            <p className="font-bold text-xl text-brand-9">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              })
                .format(1000000)
                .split(".")}
            </p>
          </div>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-8">
              delete expense
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteExpenseModal />
          </ModalContent>
        </Modal>
        <div className="flex justify-end">
          <Modal>
            <ModalTrigger asChild>
              <Button size="base_bold" className="py-2 px-8">
                save
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalPreset className="w-full" type="success">
                <div className="flex flex-col gap-8">
                  <p className="text-[14px] text-text-secondary">
                    The expense has been successfully edited and updated
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/accounting/expenses");
                    }}
                  >
                    OK
                  </Button>
                </div>
              </ModalPreset>
            </ModalContent>
          </Modal>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageExpenses;
