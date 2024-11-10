"use client";

import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import Signature from "@/components/Signature/signature";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { exportStatementTableFields, statementTableData } from "../data";

const ExportStatementPage = () => {
  const transformedTableData = statementTableData.map((item) => ({
    ...item,
    credit: (
      <p className={item.credit ? "text-status-success-3" : ""}>
        {item.credit ? item.credit : "--- ---"}
      </p>
    ),
    debit: (
      <p className={item.debit ? "text-status-error-2" : ""}>
        {item.debit ? item.debit : "--- ---"}
      </p>
    ),
  }));

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
            chunkSize={1}
            direction="column"
            referenceObject={{
              "statement id": "",
              "start date": "",
              "end date": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black dark:text-white text-2xl font-medium text-center">
          Statement Summary
        </h1>
        <AutoResizingGrid minWidth={300} gap={24}>
          <AccountStatsCard
            title="Total Amount"
            balance={12345432}
            variant="blueIncoming"
            trendDirection="up"
            trendColor="green"
            percentage={53}
          />
          <AccountStatsCard
            title="Total Credit"
            balance={12345432}
            variant="greenIncoming"
            trendDirection="down"
            trendColor="red"
            percentage={43}
          />
          <AccountStatsCard
            title="Total Debit"
            balance={12345432}
            variant="redOutgoing"
            trendDirection="down"
            trendColor="red"
            percentage={43}
          />
        </AutoResizingGrid>
        <CustomTable
          fields={exportStatementTableFields}
          data={transformedTableData}
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

export default ExportStatementPage;
