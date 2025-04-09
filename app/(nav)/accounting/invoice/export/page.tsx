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
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const ExportInvoice = () => {
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );

  const { data, error, loading, isNetworkError, silentLoading } =
    useFetch<InvoiceListResponse>("/invoice/list");

  useEffect(() => {
    if (data) {
      const transformed = transformInvoiceData(data);
      setInvoiceData(transformed);
    }
  }, [data]);

  const printRef = useRef<HTMLDivElement>(null);

  if (loading)
    return <CustomLoader layout="page" view="table" pageTitle="Invoices" />;
  if (error) return <div>Error loading invoice data.</div>;
  if (!invoiceData) return <div>No invoice data available.</div>;
  if (isNetworkError) return <NetworkError />;

  const { statistics, invoices } = invoiceData;
  const transformedInvoiceTableData = invoices.map((i) => ({
    ...i,
    client_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{i.client_name}</span>
        {i.badge_color && <BadgeIcon color={i.badge_color} />}
      </p>
    ),
  }));

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
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
          <div className="custom-flex-col gap-6">
            <h1 className="text-black my-4 dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
              Invoice Summary
            </h1>
            <AutoResizingGrid gap={24} minWidth={350}>
              <AccountStatsCard
                title="Total Invoice Created"
                balance={statistics.total_receipt}
                trendDirection="up"
                trendColor="green"
                variant="blueIncoming"
                percentage={statistics.percentage_change_total}
              />
              <AccountStatsCard
                title="Total Paid Invoice"
                balance={statistics.total_receipt}
                trendDirection="down"
                trendColor="red"
                variant="greenIncoming"
                percentage={statistics.percentage_change_paid}
              />
              <AccountStatsCard
                title="Total Pending Invoice"
                balance={statistics.total_pending_receipt}
                trendDirection="down"
                trendColor="red"
                variant="yellowCard"
                percentage={Number(statistics.total_pending_receipt)}
              />
            </AutoResizingGrid>
            <CustomTable
              fields={invoiceExportTableFields}
              data={transformedInvoiceTableData}
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
      <ExportPageFooter printRef={printRef} />
    </div>
  );
};

export default ExportInvoice;
