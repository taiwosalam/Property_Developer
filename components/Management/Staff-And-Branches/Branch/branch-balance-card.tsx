"use client";

// Images
import WalletBG from "@/public/global/wallet-bg.svg";

// Imports
import clsx from "clsx";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import {
  BluePlusIcon,
  BlueBuildingIcon,
  BlueLockIcon,
} from "@/public/icons/dashboard-cards/icons";
import { CautionIcon } from "@/public/icons/icons";

const options = [
  {
    name: "Add Funds",
    icon: <BluePlusIcon />,
    link: "/dashboard/add-funds",
  },
  {
    name: "Withdraw",
    icon: <BlueBuildingIcon />,
    link: "/dashboard/withdraw-funds",
  },
  {
    name: "Hold Wallet",
    icon: <BlueLockIcon />,
    link: "/dashboard/lock-funds",
  },
];

const BranchBalanceCard = ({
  mainBalance,
  cautionDeposit,
  className,
}: {
  mainBalance: number;
  cautionDeposit: number;
  className?: string;
}) => {
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    const storedHideBalance = localStorage.getItem("hideBalance");
    if (storedHideBalance !== null) {
      setHideBalance(JSON.parse(storedHideBalance));
    }
  }, []);

  const toggleBalanceVisibility = () => {
    setHideBalance((prev) => {
      const newHideBalance = !prev;
      localStorage.setItem("hideBalance", JSON.stringify(newHideBalance));
      return newHideBalance;
    });
  };

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="p-5 relative custom-primary-bg rounded-lg">
        <div className="absolute inset-0">
          <Image
            src={WalletBG}
            alt="wallet background"
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
        <div className="relative space-y-3">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <p className="text-text-invert text-sm font-medium">
                Branch Balance
              </p>
              <button onClick={toggleBalanceVisibility} className="">
                {hideBalance ? (
                  <Eye size={14} className="text-text-invert" />
                ) : (
                  <EyeOff size={14} className="text-text-invert" />
                )}
              </button>
            </div>
            <p className="flex items-center text-[10px] text-white">
              Transaction History <ChevronRight className="text-sm" />
            </p>
          </div>

          {/* Main Balance */}
          <p className="font-extrabold text-xl text-white">
            {hideBalance ? "*******" : `₦ ${formatNumber(mainBalance)}`}
          </p>

          {/* Caution Deposit Section */}
          <div className="text-white text-xs font-medium capitalize flex items-center space-x-2">
            <p className="text-text-white-secondary">Caution Deposit</p>
            <span>
              {!hideBalance ? "₦ " + formatNumber(cautionDeposit) : "*******"}
            </span>
            <CautionIcon />
          </div>

          <div className="w-full flex items-start space-x-4">
            {options.map((option, index) => (
              <div
                key={index}
                className="space-y-2 w-full flex flex-col items-center justify-center"
              >
                <div className="bg-white w-[30px] h-[30px] rounded-full flex items-center justify-center">
                  <span className="text-brand-9">
                  {option.icon}
                  </span>
                </div>
                <p className="text-center capitalize text-white text-xs font-normal">
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

export default BranchBalanceCard;
