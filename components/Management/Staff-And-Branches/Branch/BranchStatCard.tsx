"use client";

import { Send, TrendingUp } from "lucide-react";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-success-1 w-[40px] h-[40px] flex items-center justify-center rounded-full">
          <Send
            className={`h-4 w-4 text-muted-foreground ${
              title === "Total Expenses" ? "rotate-180 text-success-3" : ""
            }`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#202224] mb-5">
          ₦ {formatNumber(balance)}
        </div>
        <div className="text-text-label text-muted-foreground flex items-center space-x-3 font-normal text-sm">
          <TrendingUp className="text-success-2" width={24} height={24} />
          <span>
            <span className="text-success-2">{upvalue}</span> Up from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchStatCard;
