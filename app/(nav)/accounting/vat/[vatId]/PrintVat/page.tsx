"use client";

import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Signature from "@/components/Signature/signature";
import CustomTable from "@/components/Table/table";
import { printVatTableData, printVatTableFields } from "./data";

const PrintVatPage = () => {
  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <h1 className="text-center my-7 font-medium text-2xl">VAT</h1>
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "VAT ID": "",
              "Payer name": "",
              "Payment status": "",
              "date and time": "",
              "desciption": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Payment Details">
          <div className="h-[2px] w-full max-w-[670px] bg-[#C0C2C8]" />
          <CustomTable
            fields={printVatTableFields}
            data={printVatTableData}
            tableHeadStyle={{ height: "76px" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          />
        </AccountingTitleSection>
        <Signature />
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

export default PrintVatPage;
