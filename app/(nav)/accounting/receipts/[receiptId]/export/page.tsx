"use client";

import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { receiptTableFields, receiptTableData } from "../../data";
import CustomTable from "@/components/Table/table";
import Signature from "@/components/Signature/signature";

const ExportReceipt = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={1}
            direction="column"
            referenceObject={{
              "summary id": "",
              "start date": "",
              "end date": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black dark:text-white text-2xl font-medium text-center">
          Receipt Summary
        </h1>
        <AutoResizingGrid minWidth={300} gap={24}>
          <AccountStatsCard
            title="Total Amount"
            balance={12345432}
            variant="blueIncoming"
            trendDirection="up"
            trendColor="red"
            percentage={53}
          />
          <AccountStatsCard
            title="Total Credit"
            balance={12345432}
            percentage={4.3}
            variant="greenIncoming"
            trendDirection="down"
            trendColor="green"
          />
          <AccountStatsCard
            title="Total Debit"
            balance={12345432}
            variant="redOutgoing"
            trendDirection="down"
            trendColor="green"
            percentage={4.3}
          />
        </AutoResizingGrid>
        <CustomTable
          fields={receiptTableFields}
          data={receiptTableData()}
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

export default ExportReceipt;
