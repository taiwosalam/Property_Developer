"use client";
// Imports
import clsx from "clsx";
import Signature from "@/components/Signature/signature";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import ExportPageHeader from "@/components/reports/export-page-header";
import CustomTable from "@/components/Table/table";
import { walletTableFields } from "../../data";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportWallet = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <BackButton>Back</BackButton>
      <ExportPageHeader />
      <div className="custom-flex-col gap-6">
        <div className="flex justify-center">
          <div className="custom-flex-col text-center gap-1">
            <h1 className="text-black text-2xl font-medium dark:text-white">
              Summary
            </h1>
            <p className="text-text-label text-xl font-normal">
              21st JAN -16th March
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <WalletAnalytics
            title="funds"
            amount={6505689}
            trend={{
              from: "last month",
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
              from: "last month",
              type: "up",
              percent: 53,
            }}
          />
        </div>
      </div>
      <CustomTable
        fields={walletTableFields}
        data={[]}
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
      <ExportPageFooter />
    </div>
  );
};

export default ExportWallet;
