import Link from "next/link";

// Images
import { ChevronRight } from "lucide-react";
import { ExclamationMark } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import { DashboardChart } from "@/components/dashboard/chart";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import WalletBenefiary from "@/components/Wallet/wallet-benefiary";
import BeneficiaryList from "@/components/Wallet/beneficiary-list";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import {
  walletChartConfig,
  walletChartData,
  walletTableData,
  walletTableFields,
} from "./data";
import CustomTable from "@/components/Table/table";
import {
  RedOutgoingIcon,
  GreenIncomingIcon,
  BlueIncomingIcon,
} from "@/components/Accounting/icons";
import { BlueBuildingIcon } from "@/public/icons/dashboard-cards/icons";

const Wallet = () => {
  const transformedWalletTableData = walletTableData.map((t) => ({
    ...t,
    amount: (
      <span
        className={clsx("text-status-error-primary", {
          "text-status-success-3":
            t.transaction_type.toLowerCase() === "wallet top-up" ||
            t.transaction_type.toLowerCase() === "received",
        })}
      >
        {t.amount}
      </span>
    ),
    icon: (
      <div
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-full",
          {
            "bg-status-error-1 text-status-error-primary":
              t.transaction_type.toLowerCase() === "debit" ||
              t.transaction_type.toLowerCase() === "withdrawal",
            "bg-status-success-1 text-status-success-primary":
              t.transaction_type.toLowerCase() === "wallet top-up" ||
              t.transaction_type.toLowerCase() === "received",
          }
        )}
      >
        {t.transaction_type.toLowerCase() === "debit" ? (
          <RedOutgoingIcon size={25} />
        ) : t.transaction_type.toLowerCase() === "wallet top-up" ? (
          <BlueIncomingIcon color="#01BA4C" size={25} />
        ) : t.transaction_type.toLowerCase() === "withdrawal" ? (
          <BlueBuildingIcon />
        ) : t.transaction_type.toLowerCase() === "received" ? (
          <GreenIncomingIcon size={25} />
        ) : null}
      </div>
    ),
  }));

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex gap-1">
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
              amount={6505689}
              trend={{
                from: "yesterday",
                type: "up",
                percent: 53,
              }}
            />
            <WalletAnalytics
              title="debit"
              amount={6505689}
              trend={{
                from: "last week",
                type: "down",
                percent: 4.3,
              }}
            />
            <WalletAnalytics
              title="credit"
              amount={6505689}
              trend={{
                from: "yesterday",
                type: "up",
                percent: 53,
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
            <p className="text-xs dark:text-darkText-1">6564567689787</p>
          </div>
          <WalletBalanceCard noHeader mainBalance={1000} cautionDeposit={200} />
          <div className="custom-flex-col gap-4 p-4 rounded-lg bg-white dark:bg-darkText-primary max-h-[339px] overflow-hidden">
            <div className="flex items-center justify-between text-base font-medium">
              <p className="text-black dark:text-white">Beneficiary</p>
              <Modal>
                <ModalTrigger className="flex items-center gap-1">
                  <p className="text-text-label dark:text-darkText-1">
                    See all
                  </p>
                  <ChevronRight color="#5A5D61" size={16} />
                </ModalTrigger>
                <ModalContent>
                  <BeneficiaryList />
                </ModalContent>
              </Modal>
            </div>
            <div className="custom-flex-col gap-2 h-full overflow-y-scroll custom-round-scrollbar">
              {Array(6)
                .fill(null)
                .map((_, idx) => (
                  <WalletBenefiary key={idx} />
                ))}
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
            <p className="text-text-label dark:text-darkText-1">See all</p>
            <ChevronRight color="#5A5D61" size={16} />
          </Link>
        </div>
        <CustomTable
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
      </div>
    </div>
  );
};

export default Wallet;
