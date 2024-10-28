"use client";

// Imports
import Signature from "@/components/Signature/signature";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ExpensesStatCard from "@/components/Accounting/expenses/expenses-stat-card";
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
        <div className="rounded-lg bg-white p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "payment id": "",
              "customer name": "",
              "property name": "",
              "start date": "",
              "account officer": "",
              "end date": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black text-2xl font-medium text-center">
          Expenses Summary
        </h1>
        <AutoResizingGrid gap={30} minWidth={330}>
          <ExpensesStatCard
            title="Total Expenses"
            balance={12345432}
            upvalue={53}
          />
          <ExpensesStatCard
            title="Part Payment"
            balance={12345432}
            downValue={53}
          />
          <ExpensesStatCard title="Balance" balance={12345432} downValue={53} />
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
