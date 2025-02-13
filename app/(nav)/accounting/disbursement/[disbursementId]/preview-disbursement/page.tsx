"use client";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { EstateDetailItem } from "@/components/Management/Rent And Unit/detail-item";

const PreviewDisbursement = () => {
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
              "transaction id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Description">
          <p className="text-sm text-text-secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </AccountingTitleSection>
        <AccountingTitleSection title="Disbursement Details">
          <div className="p-6 bg-white dark:bg-darkText-primary rounded-lg space-y-5">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "Unit 1": "₦650,000",
                  "Unit 2": "₦650,000",
                  "Unit 3": "₦650,000",
                  "UNit 4": "₦650,000",
                  "Unit 5": "₦650,000",
                }}
                chunkSize={2}
                direction="column"
                referenceObject={{
                  "Unit 1": "",
                  "Unit 2": "",
                  "Unit 3": "",
                  "UNit 4": "",
                  "Unit 5": "",
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
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-end">
        <Button variant="sky_blue" size="base_bold" className="py-2 px-8">
          download
        </Button>
        <Button size="base_bold" className="py-2 px-8">
          print
        </Button>
      </FixedFooter>
    </div>
  );
};

export default PreviewDisbursement;
