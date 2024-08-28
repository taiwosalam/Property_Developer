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
  { date: "2024-06-09", sales: 70, profits: 90, expenses: 50 },
  { date: "2024-06-10", sales: 140, profits: 160, expenses: 110 },
  { date: "2024-06-11", sales: 100, profits: 120, expenses: 80 },
  { date: "2024-06-12", sales: 160, profits: 180, expenses: 120 },
  { date: "2024-06-13", sales: 110, profits: 130, expenses: 90 },
  { date: "2024-06-14", sales: 150, profits: 170, expenses: 130 },
  { date: "2024-06-15", sales: 90, profits: 110, expenses: 70 },
  { date: "2024-06-16", sales: 170, profits: 190, expenses: 140 },
  { date: "2024-06-17", sales: 130, profits: 150, expenses: 100 },
  { date: "2024-06-18", sales: 180, profits: 200, expenses: 160 },
  { date: "2024-06-19", sales: 100, profits: 120, expenses: 80 },
  { date: "2024-06-20", sales: 190, profits: 210, expenses: 170 },
  { date: "2024-06-21", sales: 140, profits: 160, expenses: 120 },
  { date: "2024-06-22", sales: 200, profits: 220, expenses: 180 },
  { date: "2024-06-23", sales: 150, profits: 170, expenses: 130 },
  { date: "2024-06-24", sales: 210, profits: 230, expenses: 190 },
  { date: "2024-06-25", sales: 170, profits: 190, expenses: 150 },
  { date: "2024-06-26", sales: 220, profits: 240, expenses: 200 },
  { date: "2024-06-27", sales: 180, profits: 200, expenses: 160 },
  { date: "2024-06-28", sales: 230, profits: 250, expenses: 210 },
  { date: "2024-06-29", sales: 190, profits: 210, expenses: 170 },
  { date: "2024-06-30", sales: 240, profits: 260, expenses: 220 },
  { date: "2024-07-01", sales: 200, profits: 220, expenses: 180 },
  { date: "2024-07-02", sales: 250, profits: 270, expenses: 230 },
  { date: "2024-07-03", sales: 210, profits: 230, expenses: 190 },
  { date: "2024-07-06", sales: 260, profits: 280, expenses: 240 },
  { date: "2024-07-07", sales: 220, profits: 240, expenses: 200 },
  { date: "2024-07-06", sales: 270, profits: 290, expenses: 250 },
  { date: "2024-07-07", sales: 230, profits: 250, expenses: 210 },
  { date: "2024-07-08", sales: 280, profits: 300, expenses: 260 },
  { date: "2024-07-09", sales: 240, profits: 260, expenses: 220 },
  { date: "2024-07-10", sales: 290, profits: 310, expenses: 270 },
  { date: "2024-07-11", sales: 250, profits: 270, expenses: 230 },
  { date: "2024-07-12", sales: 300, profits: 320, expenses: 280 },
  { date: "2024-07-13", sales: 260, profits: 280, expenses: 240 },
  { date: "2024-07-14", sales: 310, profits: 330, expenses: 290 },
  { date: "2024-07-15", sales: 270, profits: 290, expenses: 250 },
  { date: "2024-07-16", sales: 320, profits: 340, expenses: 300 },
  { date: "2024-07-17", sales: 280, profits: 300, expenses: 260 },
  { date: "2024-07-18", sales: 330, profits: 350, expenses: 310 },
  { date: "2024-07-19", sales: 290, profits: 310, expenses: 270 },
  { date: "2024-07-20", sales: 340, profits: 360, expenses: 320 },
  { date: "2024-07-21", sales: 300, profits: 320, expenses: 280 },
  { date: "2024-07-22", sales: 350, profits: 370, expenses: 330 },
  { date: "2024-07-23", sales: 310, profits: 330, expenses: 290 },
  { date: "2024-07-24", sales: 360, profits: 380, expenses: 340 },
  { date: "2024-07-25", sales: 320, profits: 340, expenses: 300 },
  { date: "2024-07-26", sales: 370, profits: 390, expenses: 350 },
  { date: "2024-07-27", sales: 330, profits: 350, expenses: 310 },
  { date: "2024-07-28", sales: 380, profits: 400, expenses: 360 },
  { date: "2024-07-29", sales: 340, profits: 360, expenses: 320 },
  { date: "2024-07-30", sales: 390, profits: 410, expenses: 370 },
  { date: "2024-07-31", sales: 350, profits: 370, expenses: 330 },
  { date: "2024-08-01", sales: 400, profits: 420, expenses: 380 },
  { date: "2024-08-02", sales: 360, profits: 380, expenses: 340 },
  { date: "2024-08-03", sales: 410, profits: 430, expenses: 390 },
  { date: "2024-08-08", sales: 370, profits: 390, expenses: 350 },
  { date: "2024-08-07", sales: 420, profits: 440, expenses: 400 },
  { date: "2024-08-08", sales: 380, profits: 400, expenses: 360 },
  { date: "2024-08-07", sales: 430, profits: 450, expenses: 410 },
  { date: "2024-08-08", sales: 390, profits: 410, expenses: 370 },
  { date: "2024-08-09", sales: 440, profits: 460, expenses: 420 },
  { date: "2024-08-10", sales: 400, profits: 420, expenses: 380 },
  { date: "2024-08-11", sales: 450, profits: 470, expenses: 430 },
  { date: "2024-08-12", sales: 410, profits: 430, expenses: 390 },
  { date: "2024-08-13", sales: 460, profits: 480, expenses: 440 },
  { date: "2024-08-14", sales: 420, profits: 440, expenses: 400 },
  { date: "2024-08-15", sales: 470, profits: 490, expenses: 450 },
  { date: "2024-08-16", sales: 430, profits: 450, expenses: 410 },
  { date: "2024-08-17", sales: 480, profits: 500, expenses: 460 },
  { date: "2024-08-18", sales: 440, profits: 460, expenses: 420 },
  { date: "2024-08-19", sales: 490, profits: 510, expenses: 470 },
  { date: "2024-08-20", sales: 450, profits: 470, expenses: 430 },
  { date: "2024-08-21", sales: 500, profits: 520, expenses: 480 },
  { date: "2024-08-22", sales: 460, profits: 480, expenses: 440 },
  { date: "2024-08-23", sales: 510, profits: 530, expenses: 490 },
  { date: "2024-08-24", sales: 470, profits: 490, expenses: 450 },
  { date: "2024-08-25", sales: 520, profits: 540, expenses: 500 },
  { date: "2024-08-26", sales: 480, profits: 500, expenses: 460 },
  { date: "2024-08-27", sales: 530, profits: 550, expenses: 510 },
  { date: "2024-08-28", sales: 490, profits: 510, expenses: 470 },
  { date: "2024-08-29", sales: 540, profits: 560, expenses: 520 },
  { date: "2024-08-30", sales: 500, profits: 520, expenses: 480 },
  { date: "2024-07-01", sales: 550, profits: 570, expenses: 530 },
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
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Chart Title</CardTitle>
          <div className="md:flex  grid">
            <div className="flex space-x-1">
              <span className="flex items-center space-x-1">
                <Switch id="sales" />
                <Label htmlFor="sales">Sales</Label>
              </span>
              <span className="flex items-center space-x-1">
                <Switch id="profit" />
                <Label htmlFor="profit">Profits</Label>
              </span>
              <span className="flex items-center space-x-1">
                <Switch id="expense" />
                <Label htmlFor="expense">Expenses</Label>
              </span>
            </div>
            <div className="flex justify-start items-center">
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
