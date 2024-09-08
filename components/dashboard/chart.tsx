"use client";

import * as React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
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
  { date: "2024-08-01", profits: 50, sales: 70, expenses: 30 },
  { date: "2024-08-02", profits: 90, sales: 100, expenses: 60 },
  { date: "2024-08-03", profits: 30, sales: 40, expenses: 20 },
  { date: "2024-08-08", profits: 110, sales: 120, expenses: 80 },
  { date: "2024-06-07", profits: 60, sales: 70, expenses: 50 },
  { date: "2024-06-06", profits: 130, sales: 150, expenses: 90 },
  { date: "2024-06-07", profits: 80, sales: 100, expenses: 60 },
  { date: "2024-06-08", profits: 120, sales: 140, expenses: 100 },
];

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "#E9212E",
  },
  profits: {
    label: "Profits",
    color: "#FFBB53",
  },
  sales: {
    label: "Sales",
    color: "#0033C4",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  // State for toggling the switches
  const [salesEnabled, setSalesEnabled] = React.useState(true);
  const [profitsEnabled, setProfitsEnabled] = React.useState(true);
  const [expensesEnabled, setExpensesEnabled] = React.useState(true);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card className="shadow-none">
      <CardHeader className="flex w-full items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="custom-flex-col w-full justify-between">
          <CardTitle>Chart Title</CardTitle>
          <div className="w-full flex items-center justify-between flex-wrap lg:flex-nowrap my-2 space-y-4 lg:my-0 lg:space-y-0">
            <div className="w-full flex space-x-0.5">
              {/* Sales Switch */}
              <span className="flex items-center space-x-0.5">
                <Switch
                  id="sales"
                  checked={salesEnabled}
                  onCheckedChange={(checked) => setSalesEnabled(checked)}
                  style={{
                    backgroundColor: salesEnabled
                      ? chartConfig.sales.color
                      : undefined,
                  }}
                />
                <Label
                  htmlFor="sales"
                  style={{
                    color: salesEnabled ? chartConfig.sales.color : undefined,
                  }}
                >
                  Sales
                </Label>
              </span>
              {/* Profits Switch */}
              <span className="flex items-center space-x-0.5">
                <Switch
                  id="profits"
                  checked={profitsEnabled}
                  onCheckedChange={(checked) => setProfitsEnabled(checked)}
                  style={{
                    backgroundColor: profitsEnabled
                      ? chartConfig.profits.color
                      : undefined,
                  }}
                />
                <Label
                  htmlFor="profits"
                  style={{
                    color: profitsEnabled
                      ? chartConfig.profits.color
                      : undefined,
                  }}
                >
                  Profits
                </Label>
              </span>
              {/* Expenses Switch */}
              <span className="flex items-center space-x-0.5">
                <Switch
                  id="expenses"
                  checked={expensesEnabled}
                  onCheckedChange={(checked) => setExpensesEnabled(checked)}
                  style={{
                    backgroundColor: expensesEnabled
                      ? chartConfig.expenses.color
                      : undefined,
                  }}
                />
                <Label
                  htmlFor="expenses"
                  style={{
                    color: expensesEnabled
                      ? chartConfig.expenses.color
                      : undefined,
                  }}
                >
                  Expenses
                </Label>
              </span>
            </div>
            <div className="flex bg-[#F5F5F5] rounded-md items-center justify-center">
              <DatePickerWithRange />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="md:w-full lg:w-[120px] rounded-lg sm:ml-auto"
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
                  <SelectItem value="1d" className="rounded-lg">
                    Yesterday
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
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.sales.color}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.sales.color}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={true}
              horizontal={false}
              strokeDasharray="3 3"
            />
            <YAxis />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={true}
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
            {salesEnabled && (
              <Area
                dataKey="sales"
                type="monotone"
                stroke={chartConfig.sales.color}
                strokeWidth={1.5}
                fill="url(#colorSales)"
              />
            )}
            {profitsEnabled && (
              <Area
                dataKey="profits"
                type="monotone"
                stroke={chartConfig.profits.color}
                strokeWidth={1.5}
                fill="transparent"
              />
            )}
            {expensesEnabled && (
              <Area
                dataKey="expenses"
                type="monotone"
                stroke={chartConfig.expenses.color}
                strokeWidth={1.5}
                fill="transparent"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
