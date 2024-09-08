"use client";

// Types
import type { walletBalanceCardProps } from "./types";

// Imports
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import SVG from "../SVG/svg";
import { Eye, EyeOff } from "lucide-react";

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
  const [hideBalance, setHideBalance] = useState(false);

  const hideWalletBalance = () => {
    setHideBalance(!hideBalance);
  };

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
        <div className="flex items-center gap-1 text-white opacity-95 font-normal text-sm">
          <p>My balance</p>
          <button onClick={hideWalletBalance}>
            {hideBalance ? (
              <span className="text-white">
                <Eye size={14} />
              </span>
            ) : (
              <span className="text-white">
                <EyeOff size={14} />
              </span>
            )}
          </button>
        </div>
        <p className="font-medium text-xl text-white">
          {hideBalance ? "₦" + mainBalance : "*******"}
        </p>
        <div className="text-white text-xs font-medium capitalize flex space-x-1">
          <p style={{ color: "rgba(255, 255, 255, 0.65)" }}>
            caution deposit
          </p>
          <span className="text-white ml-2">₦{cautionDeposit}</span>
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
