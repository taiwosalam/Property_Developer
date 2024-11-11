// Imports
import clsx from "clsx";
import Signature from "@/components/Signature/signature";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import CustomTable from "@/components/Table/table";
import { walletTableData, walletTableFields } from "../../data";
import {
  RedOutgoingIcon,
  BlueIncomingIcon,
  GreenIncomingIcon,
} from "@/components/Accounting/icons";
import BackButton from "@/components/BackButton/back-button";
import { BlueBuildingIcon } from "@/public/icons/dashboard-cards/icons";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportWallet = () => {
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
    <div className="custom-flex-col gap-10 pb-[100px]">
      <BackButton>Back</BackButton>
      <ExportPageHeader
        logo={empty}
        location="States and Local Govt"
        website="https://realesate.com"
        phoneNumbers={["09022312133", "07012133313", "0901212121"]}
        email="example@mail.com"
      />
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
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default ExportWallet;
