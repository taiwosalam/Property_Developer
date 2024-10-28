// Imports
import ExportPageHeader from "@/components/reports/export-page-header";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import CustomTable from "@/components/Table/table";
import { invoiceTableData, invoiceTableFields } from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportInvoice = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "090121212321"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
          Invoice Summary
        </h1>
        <AutoResizingGrid minWidth={330}>
          <InvoiceStatCards
            title="Total Receipts Created"
            balance={12345432}
            upvalue={53}
          />
          <InvoiceStatCards
            title="Total Paid Receipts"
            balance={12345432}
            downValue={53}
          />
          <InvoiceStatCards
            title="Total Pending Receipts"
            balance={12345432}
            downValue={53}
          />
        </AutoResizingGrid>
        <CustomTable
          fields={invoiceTableFields}
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
