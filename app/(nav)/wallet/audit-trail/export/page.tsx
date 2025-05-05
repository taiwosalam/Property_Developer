"use client";

import clsx from "clsx";
import Signature from "@/components/Signature/signature";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import ExportPageHeader from "@/components/reports/export-page-header";
import CustomTable from "@/components/Table/table";
import { walletTableFields } from "../../data";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useGlobalStore } from "@/store/general-store";
import { getTransactionIcon } from "@/components/Wallet/icons";
import dayjs from "dayjs";
import { DateRangeSelector } from "../../transaction-history/components";
import { useRef, useState } from "react";

const ExportWallet = () => {
  const walletTransactions = useGlobalStore((s) => s.wallet_transactions) || [];
  const walletStats = useGlobalStore((s) => s.wallet_stats);
  const walletDateRange = useGlobalStore((s) => s.wallet_date_range);
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);

  // Format date range for display
  const dateRangeText = walletDateRange?.selectedDateRange?.from
    ? `${dayjs(walletDateRange.selectedDateRange.from).format(
        "D MMM"
      )} - ${dayjs(
        walletDateRange.selectedDateRange.to ||
          walletDateRange.selectedDateRange.from
      ).format("D MMM")}`
    : "No Date Range Selected";

  // Transform transactions for table
  const transformedWalletTableData = walletTransactions.map((t) => ({
    ...t,
    amount: (
      <span
        className={clsx({
          "text-status-success-3": t.type === "credit",
          "text-status-error-primary": t.type === "debit",
        })}
      >
        {`${t.type === "credit" ? "+" : t.type === "debit" ? "-" : ""}${
          t.amount
        }`}
      </span>
    ),
    icon: (
      <div
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-full",
          {
            "bg-status-error-1 text-status-error-primary": t.type === "debit",
            "bg-status-success-1 text-status-success-primary":
              t.type === "credit" || t.type === "DVA",
          }
        )}
      >
        {getTransactionIcon(t.source, t.transaction_type)}
      </div>
    ),
  }));

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <BackButton>Back</BackButton>
      <div ref={exportRef} className="space-y-9">
        <ExportPageHeader />
        <div className="flex justify-between items-center">
          <div className="custom-flex-col gap-1 text-center items-center justify-center w-full">
            <h1 className="text-black text-2xl font-medium dark:text-white">
              Summary
            </h1>
            <p className="text-text-label text-xl font-normal">
              {dateRangeText}
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <WalletAnalytics
            title="funds"
            amount={walletStats?.total_funds || 0}
            trend={
              walletStats?.funds_trend || {
                from: "previous period",
                type: "none",
                percent: 0,
              }
            }
          />
          <WalletAnalytics
            title="debit"
            amount={walletStats?.total_debit || 0}
            trend={
              walletStats?.debit_trend || {
                from: "previous period",
                type: "none",
                percent: 0,
              }
            }
          />
          <WalletAnalytics
            title="credit"
            amount={walletStats?.total_credit || 0}
            trend={
              walletStats?.credit_trend || {
                from: "previous period",
                type: "none",
                percent: 0,
              }
            }
          />
        </div>
        <CustomTable
          className={`${fullContent && "max-h-none"}`}
          fields={walletTableFields}
          data={transformedWalletTableData}
          tableBodyCellSx={{
            paddingTop: "12px",
            paddingBottom: "12px",
            fontSize: "16px",
          }}
          tableHeadCellSx={{
            paddingTop: "14px",
            paddingBottom: "14px",
            fontSize: "16px",
          }}
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportWallet;
