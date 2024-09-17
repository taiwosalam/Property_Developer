"use client";

// Types
import type { walletBalanceCardProps } from "./types";

// Images
import WalletBG from "@/public/global/wallet-bg.svg";

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

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      <div className="p-5 relative custom-primary-bg rounded-lg">
        <div className="absolute inset-0">
          <Image src={WalletBG} alt="wallet background" fill sizes="400px" className="object-cover" />
        </div>
        <div className="relative space-y-3">
          <div className="flex items-center gap-1 text-white opacity-95 font-normal text-sm">
            <p className="text-text-white-secondary text-sm font-medium">
              Balance
            </p>
            <button onClick={hideWalletBalance}>
              {hideBalance ? (
                <span className="text-white">
                  <Eye size={12} />
                </span>
              ) : (
                <span className="text-white">
                  <EyeOff size={12} />
                </span>
              )}
            </button>
          </div>
          <p className="font-medium text-xl text-white">
            {hideBalance ? "₦ " + formatNumber(mainBalance) : "*******"}
          </p>
          <div className="text-white text-xs font-medium capitalize flex space-x-1">
            <p className="text-text-white-secondary ">caution deposit</p>
            <span className="text-white ml-2">
              {hideBalance ? "₦ " + formatNumber(cautionDeposit) : "*******"}
            </span>
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
    </div>
  );
};

export default WalletBalanceCard;
