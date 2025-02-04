"use client";

import Link from "next/link";

// Images
import { ChevronRight } from "lucide-react";
import { ExclamationMark } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import { DashboardChart } from "@/components/dashboard/chart";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import BeneficiaryList from "@/components/Wallet/beneficiary-list";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import {
  determinePercentageDifference,
  determineTrend,
  walletChartConfig,
  walletTableFields,
} from "./data";
import CustomTable from "@/components/Table/table";
import { useWalletStore } from "@/store/wallet-store";
import FundsBeneficiary from "@/components/Wallet/SendFunds/funds-beneficiary";
import SendFundBeneficiary from "@/components/Wallet/SendFunds/send-fund-beneficiary";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { getTransactionIcon } from "@/components/Wallet/icons";

const Wallet = () => {
  const walletId = useWalletStore((state) => state.walletId);
  const recentTransactions = useWalletStore(
    (state) => state.recentTransactions
  );
  const transactions = useWalletStore(
    (state) => state.transactions
  );

  const stats = useWalletStore((state) => state.stats);
  const beneficiaries = useWalletStore((state) => state.beneficiaries);

  const fundsPercent = determinePercentageDifference(
    stats.previous_month.total_funds,
    stats.current_day.total_funds
  );
  const fundsUpDown = determineTrend(
    stats.current_day.total_funds,
    stats.previous_month.total_funds
  );

  // DEBIT
  const debitPercent = determinePercentageDifference(
    stats.previous_month.total_debit,
    stats.current_day.total_debit
  );
  const debitUpDown = determineTrend(
    stats.current_day.total_debit,
    stats.previous_month.total_debit
  );

  // CREDIT
  const creditPercent = determinePercentageDifference(
    stats.previous_month.total_credit,
    stats.current_day.total_credit
  );
  const creditUpDown = determineTrend(
    stats.current_day.total_credit,
    stats.previous_month.total_credit
  );

  const transformedWalletTableData = recentTransactions.map((t) => ({
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
        {getTransactionIcon(t.source, t.type)}
      </div>
    ),
  }));

  const walletChartData = transactions.map((t) => ({
    date: t.date,
    totalfunds: t.amount,
    credit: t.type === "credit" ? t.amount : 0,
    debit: t.type === "debit" ? t.amount : 0,
  }));

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex items-center gap-1">
        <h1 className="text-black dark:text-white text-2xl font-medium">
          Wallet
        </h1>
        <ExclamationMark />
      </div>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="custom-flex-col gap-10 flex-1">
          <div className="flex flex-col lg:flex-row gap-6">
            <WalletAnalytics
              title="funds"
              amount={Number(stats.current_day.total_funds)}
              trend={{
                from: "last month",
                type: fundsUpDown as "up" | "down" | "none",
                percent: Number(fundsPercent),
              }}
            />
            <WalletAnalytics
              title="debit"
              amount={Number(stats.current_day.total_debit)}
              trend={{
                from: "last month",
                type: debitUpDown as "up" | "down" | "none",
                percent: Number(debitPercent),
              }}
            />
            <WalletAnalytics
              title="credit"
              amount={Number(stats.current_day.total_credit)}
              trend={{
                from: "last month",
                type: creditUpDown as "up" | "down" | "none",
                percent: Number(creditPercent),
              }}
            />
          </div>
          <DashboardChart
            chartTitle="Analysis"
            visibleRange
            chartConfig={walletChartConfig}
            chartData={walletChartData}
          />
        </div>
        <div className="custom-flex-col gap-5 w-full xl:w-[315px]">
          <div className="flex items-center justify-between text-neutral-800 font-medium">
            <p className="text-sm dark:text-darkText-1">Wallet ID</p>
            <p className="text-xs dark:text-darkText-1">{walletId}</p>
          </div>
          <WalletBalanceCard noHeader />
          <div className="custom-flex-col gap-4 p-4 rounded-lg bg-white dark:bg-darkText-primary h-[339px] overflow-hidden">
            <div className="flex items-center justify-between text-base font-medium">
              <p className="text-black dark:text-white">Beneficiary</p>
              <Modal>
                <ModalTrigger className="flex items-center gap-1">
                  <span className="text-text-label dark:text-darkText-1">
                    See all
                  </span>
                  <ChevronRight color="#5A5D61" size={16} />
                </ModalTrigger>
                <ModalContent>
                  <BeneficiaryList />
                </ModalContent>
              </Modal>
            </div>
            <div className="custom-flex-col gap-2 h-full overflow-y-scroll custom-round-scrollbar">
              {beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary, idx) => (
                  <Modal key={idx}>
                    <ModalTrigger>
                      <FundsBeneficiary {...beneficiary} />
                    </ModalTrigger>
                    <ModalContent>
                      <WalletModalPreset
                        title={`Send Funds to ${beneficiary.name}`}
                      >
                        <SendFundBeneficiary {...beneficiary} />
                      </WalletModalPreset>
                    </ModalContent>
                  </Modal>
                ))
              ) : (
                <p className="text-text-label text-center text-sm dark:text-darkText-1">
                  No beneficiary yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="custom-flex-col gap-10">
        <div className="flex justify-between">
          <h2 className="text-text-primary dark:text-white text-xl font-medium">
            Recent Transaction
          </h2>
          <Link
            href="/wallet/transaction-history"
            className="flex items-center gap-1"
          >
            <span className="text-text-label dark:text-darkText-1">
              See all
            </span>
            <ChevronRight color="#5A5D61" size={16} />
          </Link>
        </div>
        <CustomTable
          fields={walletTableFields}
          className="max-h-[unset]"
          data={transformedWalletTableData}
          tableBodyCellSx={{
            paddingTop: "12px",
            paddingBottom: "12px",
            fontSize: "16px",
            whiteSpace: "nowrap",
          }}
          tableHeadCellSx={{
            paddingTop: "14px",
            paddingBottom: "14px",
            fontSize: "16px",
          }}
        />
      </div>
    </div>
  );
};

export default Wallet;
