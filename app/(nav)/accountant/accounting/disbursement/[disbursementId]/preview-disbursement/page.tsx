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
        <AccountingTitleSection title="Disbursement Details">
          <div className="p-6 gap-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 bg-white dark:bg-darkText-primary rounded-lg">
            <EstateDetailItem
              label="description"
              value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
              truncate
              column
            />
            <EstateDetailItem
              label="tenant / occupant"
              value="Wasiu Ismail"
              column
            />
            <EstateDetailItem label="unit no/name" value="Room 407" column />
            <EstateDetailItem
              label="amount disburse"
              value="₦1,950,000"
              column
            />
            <div className="text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total</p>
              <p className="text-brand-9 text-xl font-bold">₦1,950,000</p>
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
