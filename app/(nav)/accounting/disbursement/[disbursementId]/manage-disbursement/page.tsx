"use client";

// Imports
import { useState } from "react";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { empty } from "@/app/config";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteDisbursementModal from "@/components/Accounting/Disbursement/delete-disbursement-modal";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import DateInput from "@/components/Form/DateInput/date-input";

const ManageDisbursement = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];
  const [amountDisburse, setAmountDisburse] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 md:gap-0 flex-col md:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "transaction id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Disbursement Break Down">
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="disbursement-mode"
                label="disbursement mode"
                placeholder="Bank Transfer"
                inputClassName="bg-white"
              />
              <Input
                id="ammount-disburse"
                label="ammount disburse"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                value={amountDisburse}
                onChange={(value) =>
                  setAmountDisburse(formatCostInputValue(value))
                }
              />
              <DateInput
                id="transaction-date"
                label="transaction date"
                containerClassName="bg-white"
              />
              <Input
                id="transaction-description"
                label="transaction description"
                placeholder="Property Rent for moniya house"
                inputClassName="bg-white"
              />
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Disburse">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <Input
                id="payment-title"
                label="payment title"
                placeholder="Security Fee"
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                value={amount}
                onChange={(value) => setAmount(formatCostInputValue(value))}
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
