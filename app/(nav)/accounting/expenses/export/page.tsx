"use client";

// Imports
import Signature from "@/components/Signature/signature";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import { expenseTableFields, expenseTableData } from "../data";

const Exportexpense = () => {
  // Filter out the action field for the export page
  const exportTableFields = expenseTableFields.filter(
    (field) => field.accessor !== "action"
  );
  const transformedTableData = expenseTableData().map((item) => ({
    ...item,
    amount: <p className="text-status-success-3">{item.amount}</p>,
    payment: <p className="text-status-error-2">{item.payment}</p>,
    balance: item.balance ? item.balance : "--- ---",
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
        <h1 className="text-black dark:text-white text-2xl font-medium text-center">
          Expenses Summary
        </h1>
        <AutoResizingGrid gap={30} minWidth={300}>
          <AccountStatsCard
            title="Total Expenses"
            balance={12345432}
            percentage={53}
            variant="redOutgoing"
            trendDirection="up"
            trendColor="red"
          />
          <AccountStatsCard
            title="Part Payment"
            balance={12345432}
            variant="blueIncoming"
            trendDirection="down"
            trendColor="green"
            percentage={4.3}
          />
          <AccountStatsCard
            title="Balance"
            balance={12345432}
            trendDirection="down"
            variant="yellowCard"
            trendColor="green"
            percentage={4.3}
          />
        </AutoResizingGrid>
        <CustomTable
          fields={exportTableFields}
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

export default Exportexpense;
