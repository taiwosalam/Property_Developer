"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "./date-picker";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const chartData = [
  { date: "2024-08-01", sales: 50, profits: 70, expenses: 30 },
  { date: "2024-08-02", sales: 90, profits: 100, expenses: 60 },
  { date: "2024-08-03", sales: 30, profits: 40, expenses: 20 },
  { date: "2024-08-08", sales: 110, profits: 120, expenses: 80 },
  { date: "2024-06-07", sales: 60, profits: 70, expenses: 50 },
  { date: "2024-06-06", sales: 130, profits: 150, expenses: 90 },
  { date: "2024-06-07", sales: 80, profits: 100, expenses: 60 },
  { date: "2024-06-08", sales: 120, profits: 140, expenses: 100 },
];

const chartConfig = {
  expenses: {
    label: "expenses",
    color: " #E9212E",
  },
  sales: {
    label: "sales",
    color: "#FFBB53",
  },
  profits: {
    label: "profits",
    color: "#0033C4",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card className="">
      <CardHeader className="flex w-full items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="custom-flex-col w-full justify-between">
          <CardTitle>Chart Title</CardTitle>
          <div className="w-full flex items-center justify-between flex-wrap lg:flex-nowrap my-2 space-y-4 lg:my-0 lg:space-y-0">
            <div className="w-full flex space-x-0.5">
              <span className="flex items-center space-x-0.5">
                <Switch id="sales" />
                <Label htmlFor="sales">Sales</Label>
              </span>
              <span className="flex items-center space-x-0.5">
                <Switch id="profit" />
                <Label htmlFor="profit">Profits</Label>
              </span>
              <span className="flex items-center space-x-0.5">
                <Switch id="expense" />
                <Label htmlFor="expense">Expenses</Label>
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <DatePickerWithRange />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] lg:min-h-[350px] w-full -ml-6"
        >
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="sales"
              type="monotone"
              stroke={chartConfig.sales.color}
              strokeWidth={2}
              dot={false}
            />{" "}
            <Line
              dataKey="profits"
              type="monotone"
              stroke={chartConfig.profits.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke={chartConfig.expenses.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
