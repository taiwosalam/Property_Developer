import React from "react";

// Images
import { ChevronRight } from "lucide-react";
import SendIcon from "@/public/icons/send.svg";
import ReceiveIcon from "@/public/icons/receive.svg";
import { ExclamationMark } from "@/public/icons/icons";

// Imports
import { DashboardChart } from "@/components/dashboard/chart";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import WalletBenefiary from "@/components/Wallet/wallet-benefiary";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import Picture from "@/components/Picture/picture";

const Wallet = () => {
  return (
    <div className="custom-flex-col gap-10">
      <div className="flex gap-1">
        <h1 className="text-black text-2xl font-medium">Wallet</h1>
        <div className="flex items-center">
          <ExclamationMark />
        </div>
      </div>
      <div className="flex gap-8">
        <div className="custom-flex-col gap-10 flex-1">
          <div className="flex gap-6">
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
          <DashboardChart chartTitle="Analysis" visibleRange />
        </div>
        <div className="custom-flex-col gap-5 min-w-[315px]">
          <div className="flex items-center justify-between text-neutral-800 font-medium">
            <p className="text-sm">Wallet ID</p>
            <p className="text-xs">6564567689787</p>
          </div>
          <WalletBalanceCard noHeader mainBalance={1000} cautionDeposit={200} />
          <div className="custom-flex-col gap-4 p-4 rounded-lg bg-white">
            <div className="flex items-center justify-between text-base font-medium">
              <p className="text-black">Beneficiary</p>
              <div className="flex items-center gap-1">
                <p className="text-text-label">See all</p>
                <ChevronRight color="#5A5D61" size={16} />
              </div>
            </div>
            <div className="custom-flex-col gap-2">
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
          <h2 className="text-text-primary text-xl font-medium">
            Recent Transaction
          </h2>
          <div className="flex items-center gap-1">
            <p className="text-text-label">See all</p>
            <ChevronRight color="#5A5D61" size={16} />
          </div>
        </div>
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>transaction ID</th>
                <th>source</th>
                <th>description</th>
                <th>amount</th>
                <th>status</th>
                <th>date</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-status-error-1">
                        <Picture src={SendIcon} alt="send icon" size={20} />
                      </div>
                    </td>
                    <td>
                      <p>00001102332</p>
                    </td>
                    <td>
                      <p>Debit</p>
                    </td>
                    <td>
                      <p>Paid for services</p>
                    </td>
                    <td>
                      <p className="text-status-error-2">-₦5,000.00</p>
                    </td>
                    <td>
                      <p>Pending</p>
                    </td>
                    <td>
                      <p>12/01/2024</p>
                    </td>
                    <td>
                      <p>03:30pm</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
