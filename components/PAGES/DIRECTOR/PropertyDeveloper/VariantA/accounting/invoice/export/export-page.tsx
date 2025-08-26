"use client";
// Imports
import ExportPageHeader from "@/components/reports/export-page-header";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import CustomTable from "@/components/Table/table";
import {
  invoiceTableData,
  invoiceExportTableFields,
  transformInvoiceData,
} from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useEffect, useRef, useState } from "react";
import { InvoiceListResponse, TransformedInvoiceData } from "../types";
import { useGlobalStore } from "@/store/general-store";
import dayjs from "dayjs";
import { mockInvoiceStatistics } from "../invoice-page";

const ExportInvoice = () => {
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  const [fullContent, setFullContent] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />

          <div
            style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
            className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary mt-6"
          >
            <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "invoice id": "6736878",
                  "property name": "House On Hill",
                  "account officer": "Ajadi Kola",
                  "customer name": "Kunle Afod",
                  date: "12 July 1990",
                  "unit id": "767638932",
                }}
                direction={"column"}
                chunkSize={2}
                referenceObject={{
                  "invoice id": "",
                  "property name": "",
                  "account officer": "",
                  "customer name": "",
                  date: "",
                  "unit id": "",
                }}
              />
            </div>
          </div>
          <div className="custom-flex-col gap-6">
            <h1 className="text-black my-4 dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
              Invoice Summary -{" "}
              <span className="px-2">{`(${dayjs().format(
                "Do MMMM YYYY"
              )})`}</span>
            </h1>
            <AutoResizingGrid gap={24} minWidth={350} containerClassName="py-6">
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total Paid Invoice"
                balance={mockInvoiceStatistics.percentage_change_total}
                trendDirection={
                  mockInvoiceStatistics.percentage_change_paid < 0
                    ? "down"
                    : "up"
                }
                otherCurrency={"₦6,000,000"}
                trendColor={
                  mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
                }
                variant="greenIncoming"
                percentage={mockInvoiceStatistics.percentage_change_pending}
                //timeRangeLabel={getTimeRangeLabel()}
                noSymbol
              />
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total Invoice Created"
                balance={mockInvoiceStatistics.percentage_change_total}
                trendDirection={
                  mockInvoiceStatistics.percentage_change_paid < 0
                    ? "down"
                    : "up"
                }
                otherCurrency={"₦2,000,000"}
                trendColor={
                  mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
                }
                variant="blueIncoming"
                percentage={mockInvoiceStatistics.percentage_change_pending}
                //timeRangeLabel={getTimeRangeLabel()}
                noSymbol
              />
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total Pending Invoice"
                balance={"100,0000"}
                trendDirection={
                  mockInvoiceStatistics.percentage_change_paid < 0
                    ? "down"
                    : "up"
                }
                otherCurrency={"₦2,000,000"}
                trendColor={
                  mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
                }
                variant="redOutgoing"
                percentage={mockInvoiceStatistics.percentage_change_pending}
                //timeRangeLabel={getTimeRangeLabel()}
                noSymbol
              />
            </AutoResizingGrid>
            <CustomTable
              className={`${fullContent && "max-h-none"}`}
              fields={invoiceExportTableFields}
              // data={transformedInvoiceTableData}
              data={invoiceTableData}
              //tableHeadCellSx={{ fontSize: "1rem" }}
             
            />
            <Signature />
          </div>
        </div>
      </div>
      <ExportPageFooter printRef={printRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportInvoice;
