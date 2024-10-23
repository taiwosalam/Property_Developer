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
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useRouter } from "next/navigation";

const ManageExpenses = () => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="custom-flex-col gap-10 pb-[150px] sm:pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
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
        <AccountingTitleSection title="Total Expenses">
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Rent"
                required
                CURRENCY_SYMBOL="₦"
                placeholder="1,000,000"
                style={{ backgroundColor: "white" }}
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: "white" }}
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: "white" }}
              />
              <Input
                id="non-refundable-agency-fee"
                label="non refundable agency fee"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: "white" }}
              />
              <Input
                id="non-refundable-legal-fee"
                label="non refundable legal fee"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: "white" }}
              />
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Payment" required>
          <div className="p-6 custom-flex-col gap-4 bg-white rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <Input id="payment-title" label="payment title" />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL="₦"
                placeholder="300,000"
                style={{ backgroundColor: "white" }}
              />
            </div>
            <div className="flex justify-end">
              <Button size="base_medium" className="py-2 px-14">
                add
              </Button>
            </div>
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
        <div className="flex gap-6">
          <Button
            onClick={back}
            variant="sky_blue"
            size="base_bold"
            className="py-2 px-8"
          >
            exit
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            save
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageExpenses;
