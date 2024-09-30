import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import AccountingLogoContactHeader from "@/components/Accounting/accounting-logo-contact-header";
import Input from "@/components/Form/Input/input";

const PreviewExpenses = () => {
  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <AccountingLogoContactHeader />
        <div className="rounded-lg bg-white p-8 flex">
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
          <p className="font-normal text-[14px] text-[#6C6D6D]">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-3 gap-x-[34px] gap-y-6">
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
          <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
          <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
            <p className="text-[#747474]">total package</p>
            <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Payment">
          <div className="p-6 custom-flex-col gap-4 bg-white rounded-lg">
            <div className="grid grid-cols-3 gap-[18px]">
              <Input
                id="payment-title"
                placeholder="Tax Charges"
                label="payment title"
              />
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
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <p className="text-brand-9 text-[14px] font-normal">
          <span className="text-status-error-primary text-2xl">*</span>You
          cannot add payment to paid receipts.
        </p>
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
            Exit
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewExpenses;
