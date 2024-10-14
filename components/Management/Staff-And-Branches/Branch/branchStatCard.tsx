"use client";

import { TrendingUp } from "lucide-react";
import {
  CardSendIcon,
  CardBlueWalletIcon,
  CardReceiveIcon,
} from "@/public/icons/icons";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BranchStatCard = ({
  title,
  balance,
  upvalue,
}: {
  title: string;
  balance: number;
  upvalue: number;
}) => {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <Card className="border-none shadow-none rounded-[8px] bg-[#FAFAFA]">
      <CardHeader className="flex flex-row flex-wrap gap-2 items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`${
            title === "Total Balance"
              ? "bg-brand-9 bg-opacity-20"
              : title === "Total Expenses"
              ? "bg-status-error-1"
              : "bg-status-success-1"
          } w-[40px] h-[40px] flex items-center justify-center rounded-full aspect-square`}
        >
          {title === "Total Expenses" ? (
            <CardSendIcon />
          ) : title === "Total Balance" ? (
            <CardBlueWalletIcon />
          ) : (
            <CardReceiveIcon />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-[#202224] mb-5">
          ₦ {formatNumber(balance)}
        </p>
        <div className="text-text-label flex items-center space-x-3 font-normal text-sm">
          <TrendingUp
            className={`${
              title === "Total Balance"
                ? "text-status-error-2"
                : "text-status-success-2"
            }`}
            width={24}
            height={24}
          />
          <span>
            <span>{upvalue}</span> Up from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchStatCard;
