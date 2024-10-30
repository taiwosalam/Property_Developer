"use client";

import { useState } from "react";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Input from "@/components/Form/Input/input";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useRouter } from "next/navigation";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";

type MoneyField =
  | "annualRent"
  | "serviceCharge"
  | "refundableCautionFee"
  | "nonRefundableAgencyFee"
  | "nonRefundableLegalFee"
  | "amount";

const PreviewExpenses = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // to be dynamic
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const [inputValues, setInputValues] = useState<Record<MoneyField, string>>({
    annualRent: "",
    serviceCharge: "",
    refundableCautionFee: "",
    nonRefundableAgencyFee: "",
    nonRefundableLegalFee: "",
    amount: "",
  });

  const handleInputChange = (field: MoneyField, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: formatCostInputValue(value),
    }));
  };

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Add Payment</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "Invoice id": "",
              "Customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-white">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-3 gap-x-[34px] gap-y-6">
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
          <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
          <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
            <p className="text-[#747474] dark:text-white">total payment</p>
            <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Payment">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-3 gap-[18px]">
              <Input
                id="payment-title"
                placeholder="Tax Charges"
                label="payment title"
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                value={inputValues.amount}
                onChange={(value) => handleInputChange("amount", value)}
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
      <FixedFooter className="flex items-center justify-between">
        <p className="text-brand-9 text-[14px] font-normal">
          <span className="text-status-error-primary text-2xl">*</span>You
          cannot add payment to paid receipts.
        </p>
        <div className="flex gap-6">
          <Button
            onClick={back}
            variant="sky_blue"
            size="base_medium"
            className="py-2 px-8"
          >
            Exit
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            Save
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default PreviewExpenses;
