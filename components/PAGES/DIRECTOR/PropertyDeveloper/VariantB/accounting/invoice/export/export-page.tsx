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

const ExportInvoice = () => {
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  const [fullContent, setFullContent] = useState(false);

  const { accounting_invoices, accounting_statistics, otherCurrencies } =
    useGlobalStore((s) => ({
      accounting_invoices: s.accounting_invoices,
      accounting_statistics: s.accounting_statistics,
      otherCurrencies: s.otherCurrencies,
    }));

  const filteredAccountingInvoices = useGlobalStore(
    (s) => s.accounting_invoices
  );
  const filteredAccountingStatistics = useGlobalStore(
    (s) => s.accounting_statistics
  );

  const printRef = useRef<HTMLDivElement>(null)
  if (!filteredAccountingStatistics)
    return <div>No invoice data available.</div>;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <div className="custom-flex-col gap-6">
            <h1 className="text-black my-4 dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
              Invoice Summary -{" "}
              <span className="px-2">{`(${dayjs().format(
                "Do MMMM YYYY"
              )})`}</span>
            </h1>
            <AutoResizingGrid gap={24} minWidth={350}>
              <AccountStatsCard
                title="Total Invoice Created"
                balance={accounting_statistics.total_receipt}
                trendDirection={
                  accounting_statistics.percentage_change_total < 0
                    ? "down"
                    : "up"
                }
                trendColor={
                  accounting_statistics.percentage_change_total < 0
                    ? "red"
                    : "green"
                }
                variant="blueIncoming"
                noSymbol
                percentage={accounting_statistics.percentage_change_total}
                otherCurrency={otherCurrencies?.total}
                // timeRangeLabel={getTimeRangeLabel()}
              />
              <AccountStatsCard
                title="Total Paid Invoice"
                balance={accounting_statistics.total_paid_receipt}
                trendDirection={
                  accounting_statistics.percentage_change_paid < 0
                    ? "down"
                    : "up"
                }
                trendColor={
                  accounting_statistics.percentage_change_paid < 0
                    ? "red"
                    : "green"
                }
                variant="greenIncoming"
                noSymbol
                percentage={accounting_statistics.percentage_change_paid}
                otherCurrency={otherCurrencies?.paid}
                // timeRangeLabel={getTimeRangeLabel()}
              />
              <AccountStatsCard
                title="Total Pending Invoice"
                balance={accounting_statistics.total_pending_receipt}
                trendDirection={
                  accounting_statistics.percentage_change_pending < 0
                    ? "down"
                    : "up"
                }
                trendColor={
                  accounting_statistics.percentage_change_pending < 0
                    ? "red"
                    : "green"
                }
                variant="yellowCard"
                noSymbol
                percentage={accounting_statistics.percentage_change_pending}
                otherCurrency={otherCurrencies?.pending}
                // timeRangeLabel={getTimeRangeLabel()}
              />
            </AutoResizingGrid>
            <CustomTable
              className={`${fullContent && "max-h-none"}`}
              fields={invoiceExportTableFields}
              // data={transformedInvoiceTableData}
              data={filteredAccountingInvoices || []}
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
      </div>
      <ExportPageFooter printRef={printRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportInvoice;
