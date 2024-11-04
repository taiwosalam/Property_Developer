"use client";

// Imports
import Signature from "@/components/Signature/signature";
import CustomTable from "@/components/Table/table";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import { vatTableData, vatTableFields } from "../data";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportVat = () => {
  const transformedTableData = vatTableData.map((item) => ({
    ...item,
    total_vat: (
      <p className={item.total_vat ? "text-status-success-3" : ""}>
        {item.total_vat ? item.total_vat : "--- ---"}
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
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
          <KeyValueList
            data={{
              "summary id": "123456",
              "start date": "02/03/2024",
              "end date": "02/03/2024",
            }}
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
          VAT Summary
        </h1>
        <AutoResizingGrid gap={24} minWidth={330}>
          <AccountStatsCard
            title="Total Vat Created"
            balance={12345432}
            percentage={53}
            variant="blueIncoming"
            trendDirection="up"
            trendColor="green"
          />
          <AccountStatsCard
            title="Total Paid Vat"
            balance={12345432}
            percentage={73}
            variant="greenIncoming"
            trendDirection="down"
            trendColor="red"
          />
          <AccountStatsCard
            title="Total Pending Vat"
            balance={12345432}
            percentage={53}
            variant="yellowCard"
            trendDirection="down"
            trendColor="red"
          />
        </AutoResizingGrid>
        <CustomTable
          fields={vatTableFields}
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

export default ExportVat;
