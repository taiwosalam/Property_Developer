"use client";

// Imports
import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const options = [
  {
    name: "Withdraw",
    icon: "/icons/dashboard-cards/blue-building.svg",
    link: "/dashboard/withdraw-funds",
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

  const toggleBalanceVisibility = () => {
    setHideBalance((prev) => !prev);
  };

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="p-5 custom-primary-bg space-y-3 rounded-lg">
        {/* Header Section */}
        <div className="flex items-center gap-1 text-white opacity-95 font-normal text-sm">
          <p className="text-text-invert text-sm font-medium">Branch Balance</p>
          <button onClick={toggleBalanceVisibility} className="ml-2">
            {hideBalance ? (
              <Eye size={14} className="text-text-invert" />
            ) : (
              <EyeOff size={14} className="text-text-invert" />
            )}
          </button>
        </div>

        {/* Main Balance */}
        <p className="font-extrabold text-xl text-white">
          {hideBalance ? "*******" : `₦ ${formatNumber(mainBalance)}`}
        </p>

        {/* Caution Deposit Section */}
        <div className="text-white text-xs font-medium capitalize flex items-center space-x-2">
          <p className="text-text-white-secondary">Caution Deposit</p>
          <span>₦ {formatNumber(cautionDeposit)}</span>
          <Image src="/icons/caution.svg" alt="info" width={12} height={12} />
        </div>

        <div className="w-full flex justify-center space-x-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="space-y-2 w-full flex flex-col items-center justify-center"
            >
              <div className="bg-white w-[30px] h-[30px] rounded-full flex items-center justify-center">
                <Image
                  src={option.icon}
                  alt={`${option.name} icon`}
                  width={16}
                  height={16}
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

export default BranchBalanceCard;
