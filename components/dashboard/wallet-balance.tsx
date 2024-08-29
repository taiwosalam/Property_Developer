// Types
import type { walletBalanceCardProps } from "./types";

// Imports
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SVG from "../SVG/svg";

const options = [
  {
    name: "Add Funds",
    icon: "/icons/dashboard-cards/blue-plus.svg",
    link: "/dashboard/add-funds",
  },
  {
    name: "Send Funds",
    icon: "/icons/dashboard-cards/blue-send.svg",
    link: "/dashboard/send-funds",
  },
  {
    name: "Withdraw",
    icon: "/icons/dashboard-cards/blue-building.svg",
    link: "/dashboard/withdraw-funds",
  },
];

const WalletBalanceCard: React.FC<walletBalanceCardProps> = ({
  mainBalance,
  cautionDeposit,
  className,
  ...props
}) => {
  return (
    <div className={clsx("space-y-2", className)}>
      <div className="w-full flex items-center justify-between font-normal">
        <p className="text-[#262626] text-sm">Wallet</p>
        <Link href="" className="text-[#4F5E71] text-xs flex items-center">
          <p>Transaction History</p>
          <SVG type="right_arrow" className="ml-2" />
        </Link>
      </div>
      <div className="p-5 custom-primary-bg space-y-3 rounded-lg">
        <div className="flex items-center text-white opacity-95 font-normal text-sm">
          <p>My balance</p>

          <SVG type="eye" color="#FFFFFF" className="ml-2" />
        </div>
        <p className="font-medium text-xl text-white">₦{mainBalance}</p>
        <div className="text-white text-xs font-medium capitalize flex space-x-1">
          <p className="text-text-quaternary ">caution deposit</p>
          <span className="text-white ml-2"></span>₦{cautionDeposit}{" "}
          <Image src="/icons/caution.svg" alt="info" width={12} height={12} />
        </div>
        <div className="w-full flex justify-between">
          {options.map((option, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-white w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src={option.icon}
                  alt="icon"
                  width={12}
                  height={12}
                  className="w-[14px] h-[14px]"
                />
              </div>
              <p className="capitalize text-white text-xs font-normal">
                {option.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;
