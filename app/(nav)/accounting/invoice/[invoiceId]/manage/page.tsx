"use client";

import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import { useState } from "react";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import DeleteInvoiceModal from "@/components/Accounting/invoice/delete-invoice-modal";
import BackButton from "@/components/BackButton/back-button";
import { useRouter } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";

type InputField =
  | "annualRent"
  | "serviceCharge"
  | "refundableCautionFee"
  | "nonRefundableAgencyFee"
  | "nonRefundableLegalFee";

const ManageInvoice = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const [inputValues, setInputValues] = useState<Record<InputField, string>>({
    annualRent: "",
    serviceCharge: "",
    refundableCautionFee: "",
    nonRefundableAgencyFee: "",
    nonRefundableLegalFee: "",
  });

  const handleInputChange = (field: InputField, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: formatCostInputValue(value),
    }));
  };
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
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-darkText-1">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Rent"
                required
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="1,000,000"
                inputClassName="bg-white"
                value={inputValues.annualRent}
                onChange={(value) => handleInputChange("annualRent", value)}
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                value={inputValues.serviceCharge}
                onChange={(value) => handleInputChange("serviceCharge", value)}
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                value={inputValues.refundableCautionFee}
                onChange={(value) =>
                  handleInputChange("refundableCautionFee", value)
                }
              />
              <Input
                id="non-refundable-agency-fee"
                label="non refundable agency fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                value={inputValues.nonRefundableAgencyFee}
                onChange={(value) =>
                  handleInputChange("nonRefundableAgencyFee", value)
                }
              />
              <Input
                id="non-refundable-legal-fee"
                label="non refundable legal fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                value={inputValues.nonRefundableLegalFee}
                onChange={(value) =>
                  handleInputChange("nonRefundableLegalFee", value)
                }
              />
            </div>
          </div>
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-darkText-1 text-center">
            <span className="text-status-error-primary text-2xl">*</span>
            Receipts with payment cannot be edited or deleted.
          </p>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex items-center justify-between gap-4">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-8">
              delete invoice
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteInvoiceModal />
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

export default ManageInvoice;
