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
        <div className="rounded-lg bg-white p-8 flex flex-col">
          <KeyValueList
            data={{
              "property status": "successful",
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "Vat id": "",
              "Payer name": "",
              "property status": "",
              "date and time": "",
              description: "",
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
        <AccountingTitleSection title="Account Details">
          <div className="p-6 bg-white rounded-lg space-y-5">
            <div className="flex flex-col">
              <KeyValueList
                data={{
                  "Account Number": "1234567879",
                  "Account Name": "John Doe & Co Estate surveyors",
                  "Bank Name": "Info Bank",
                }}
                chunkSize={1}
                direction="column"
                referenceObject={{
                  "Account Number": "",
                  "Account Name": "",
                  "Bank Name": "",
                }}
              />
            </div>
          </div>
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
