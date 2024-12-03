"use client";
// Imports
import ExportPageHeader from "@/components/reports/export-page-header";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import CustomTable from "@/components/Table/table";
import { invoiceTableData, invoiceExportTableFields } from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportInvoice = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={1}
            direction="column"
            referenceObject={{
              "Summary ID": "",
              "Start Date": "",
              "End Date": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
          Invoice Summary
        </h1>
        <AutoResizingGrid gap={30} minWidth={300}>
          <AccountStatsCard
            title="Total Receipts Created"
            balance={12345432}
            percentage={53}
            variant="blueIncoming"
            trendDirection="up"
            trendColor="green"
          />
          <AccountStatsCard
            title="Total Paid Receipts"
            balance={12345432}
            variant="greenIncoming"
            trendDirection="down"
            trendColor="red"
            percentage={4.3}
          />
          <AccountStatsCard
            title="Total Pending Receipts"
            balance={12345432}
            variant="yellowCard"
            trendDirection="down"
            trendColor="red"
            percentage={4.3}
          />
        </AutoResizingGrid>
        <CustomTable
          fields={invoiceExportTableFields}
          data={invoiceTableData}
          tableHeadStyle={{ height: "76px" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
          tableBodyCellSx={{
            fontSize: "1rem",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
        />
        <Signature />
      </div>
      <ExportPageFooter />
    </div>
  );
};

export default ExportInvoice;
