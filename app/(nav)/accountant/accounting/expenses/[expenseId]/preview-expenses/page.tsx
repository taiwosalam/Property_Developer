"use client";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";

const PreviewExpenses = () => {
  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "Expenses id": "",
              "Customer name": "",
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
        <AccountingTitleSection title="Expenses Details">
          <div className="p-6 bg-white dark:bg-darkText-primary rounded-lg space-y-5">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{}}
                chunkSize={2}
                direction="column"
                referenceObject={{
                  "Annual fee": "",
                  "non refundable agency fee": "",
                  "service charge": "",
                  "non refundable legal fee": "",
                  "refundable caution fee": "",
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total amount</p>
              <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Deducted Payment">
          <div className="p-6 bg-white dark:bg-darkText-primary rounded-lg space-y-5">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "25 January 2024": "₦650,000",
                  "26 January 2024": "₦650,000",
                  "27 January 2024": "₦650,000",
                  "28 January 2024": "₦650,000",
                  "29 January 2024": "₦650,000",
                }}
                chunkSize={2}
                direction="column"
                referenceObject={{
                  "25 January 2024": "",
                  "26 January 2024": "",
                  "27 January 2024": "",
                  "28 January 2024": "",
                  "29 January 2024": "",
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total payment</p>
              <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
            </div>
          </div>
        </AccountingTitleSection>
        <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1 p-6">
          <p className="text-[#747474]">total balance</p>
          <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
        </div>
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-end">
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
            download
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            print
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default PreviewExpenses;
