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
import { DateRange } from "react-day-picker";

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

export function DashboardChart({
  visibleRange,
  chartTitle,
}: {
  visibleRange?: boolean;
  chartTitle?: string;
}) {
  const [salesEnabled, setSalesEnabled] = React.useState(true);
  const [profitsEnabled, setProfitsEnabled] = React.useState(true);
  const [expensesEnabled, setExpensesEnabled] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState("90d");
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    DateRange | undefined
  >();

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // If the user selects a custom range, set the timeRange to "custom"
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const handleSelectChange = (value: string) => {
    setTimeRange(value);
    if (value !== "custom") {
      const days =
        value === "90d" ? 90 : value === "30d" ? 30 : value === "7d" ? 7 : 1;
      setSelectedDateRange(calculateDateRange(days));
    }
  };

  const filteredData = chartData
    .filter((item) => {
      const date = new Date(item.date);
      if (selectedDateRange?.from && selectedDateRange?.to) {
        return date >= selectedDateRange.from && date <= selectedDateRange.to;
      }

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
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="shadow-sm border-none">
      <>
        <CardHeader className="flex w-full items-center gap-2 space-y-0 py-3 sm:flex-row">
          <div className="flex w-full py-2 justify-between">
            <CardTitle className="text-sm">
              {chartTitle || "Chart Title"}
            </CardTitle>
            <div
              className={`w-fit ${
                visibleRange ? "flex" : "hidden"
              } bg-[#F5F5F5] rounded-md items-center justify-center`}
            >
              <DatePickerWithRange
                selectedRange={selectedDateRange}
                onDateChange={handleDateChange}
              />
              <Select value={timeRange} onValueChange={handleSelectChange}>
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
                  <SelectItem value="custom" className="rounded-lg">
                    Custom
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap my-2 space-y-4 lg:my-0 lg:space-y-0 px-6">
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
                  color: profitsEnabled ? chartConfig.profits.color : undefined,
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
        </div>
      </>
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
