"use client";

// Imports
import clsx from "clsx";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import {
  RedOutgoingIcon,
  GreenIncomingIcon,
  BlueIncomingIcon,
} from "@/components/Accounting/icons";
import { BlueBuildingIcon } from "@/public/icons/dashboard-cards/icons";
import { walletTableData, walletTableFields } from "../data";

const TransactionHistory = () => {
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
    <div className="custom-flex-col gap-8">
      <BackButton>Transaction History</BackButton>
      <FilterBar
        pageTitle="Transaction History"
        hasGridListToggle={false}
        handleFilterApply={() => {}}
        hiddenSearchInput
        exports
      />

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
  );
};

export default TransactionHistory;
