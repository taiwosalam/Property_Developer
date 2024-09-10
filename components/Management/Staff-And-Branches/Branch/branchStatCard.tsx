"use client";

import { Send, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`${
            title === "Total Balance"
              ? "bg-brand-9 bg-opacity-20"
              : title === "Total Expenses"
              ? "bg-status-error-1"
              : "bg-success-1"
          } w-[40px] h-[40px] flex items-center justify-center rounded-full`}
        >
          {title === "Total Expenses" ? (
            <Send className="h-4 w-4 rotate-180 text-status-error-2" />
          ) : title === "Total Balance" ? (
            <Image
              src={"/icons/wallet-blue.svg"}
              alt="icon"
              width={16}
              height={16}
              style={{
                width: "16px",
                height: "16px",
              }}
            />
          ) : (
            <Send
              className={`h-4 w-4 ${
                title === "Total Expenses" ? "rotate-180 text-success-3" : ""
              }`}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#202224] mb-5">
          ₦ {formatNumber(balance)}
        </div>
        <div className="text-text-label flex items-center space-x-3 font-normal text-sm">
          <TrendingUp
            className={`${
              title === "Total Balance"
                ? "text-status-error-2"
                : "text-success-2"
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
