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
import { expenseTableFields, expenseTableData, TransformedExpensesData, ExpenseStats, ExpensesApiResponse, transformExpensesData } from "../data";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const Exportexpense = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<TransformedExpensesData>({
    expenses: [],
    stats: {
      total_amount: 0,
      total_balance: 0,
      total_deduct: 0,
      percentage_change_amount: 0,
      percentage_change_deduct: 0,
      percentage_change_balance: 0,
    } as ExpenseStats,
  });

  const {
    expenses,
    stats
  } = pageData


  const { data, loading, isNetworkError, error } = useFetch<ExpensesApiResponse>("/expenses");

  useEffect(() => {
    if (data) {
      setPageData(transformExpensesData(data));
    }
  }, [data]);


  // Filter out the action field for the export page
  const exportTableFields = expenseTableFields.filter(
    (field) => field.accessor !== "action"
  );
  const transformedTableData = expenses.map((item) => ({
    ...item,
    amount: <p className="text-status-success-3">{item.amount}</p>,
    payment: <p className="text-status-error-2">{item.payment}</p>,
    balance: item.balance ? item.balance : "--- ---",
  }));

  if (loading) return <CustomLoader layout="page" pageTitle="Expenses" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
      <div className="custom-flex-col gap-[18px]">
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
        <h1 className="text-black dark:text-white text-2xl font-medium text-center">
          Expenses Summary
        </h1>
        <AutoResizingGrid gap={30} minWidth={300}>
          <AccountStatsCard
            title="Total Expenses"
            balance={Number(stats.total_amount)}
            percentage={stats.percentage_change_amount}
            variant="redOutgoing"
            trendDirection="up"
            trendColor="red"
          />
          <AccountStatsCard
            title="Part Payment"
            balance={Number(stats.total_deduct)}
            variant="blueIncoming"
            trendDirection="down"
            trendColor="green"
            percentage={stats.percentage_change_deduct}
          />
          <AccountStatsCard
            title="Balance"
            balance={Number(stats.total_balance)}
            trendDirection="down"
            variant="yellowCard"
            trendColor="green"
            percentage={stats.percentage_change_balance}
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
      </div>
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default Exportexpense;
