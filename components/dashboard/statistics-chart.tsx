"use client";
import * as React from "react";
import clsx from "clsx";
import { CartesianGrid, XAxis, YAxis, AreaChart, Area } from "recharts";
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
import type { DateRange } from "react-day-picker";
import { useGlobalStore } from "@/store/general-store";

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface DashboardChartProps {
  visibleRange?: boolean;
  chartTitle?: string;
  className?: string;
  chartConfig: ChartConfig;
  chartData: ChartDataPoint[] | undefined;
}

export const StatisticsChart: React.FC<DashboardChartProps> = ({
  visibleRange,
  chartTitle,
  className,
  chartConfig,
  chartData,
}) => {
  const [enabledMetrics, setEnabledMetrics] = React.useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    Object.keys(chartConfig).forEach((key) => {
      initialState[key] = true;
    });
    return initialState;
  });

  const [highestMetric, setHighestMetric] = React.useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);

  // Use Zustand store for timeRange and selectedDateRange
  const timeRange = useGlobalStore((state) => state.timeRange);
  const selectedDateRange = useGlobalStore((state) => state.selectedDateRange);
  const setGlobalInfoStore = useGlobalStore((state) => state.setGlobalInfoStore);

  const calculateDateRange = (days: number): DateRange => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  React.useEffect(() => {
    if (!selectedDateRange) {
      const initialRange = calculateDateRange(30);
      setGlobalInfoStore("selectedDateRange", initialRange);
    }
  }, [selectedDateRange, setGlobalInfoStore]);

  const handleDateChange = (range: DateRange | undefined) => {
    setGlobalInfoStore("selectedDateRange", range);
    if (range?.from && range?.to) {
      setGlobalInfoStore("timeRange", "custom");
    }
  };

  // Handle dropdown selection
  const handleSelectChange = (value: string) => {
    setGlobalInfoStore("timeRange", value);
    if (value !== "custom") {
      let days: number;
      switch (value) {
        case "last_3_months":
          days = 90;
          break;
        case "last_30_days":
          days = 30;
          break;
        case "last_7_days":
          days = 7;
          break;
        case "yesterday":
          days = 1;
          break;
        default:
          days = 30; // Fallback
      }
      setGlobalInfoStore("selectedDateRange", calculateDateRange(days));
    }
  };

  const filteredData =
    chartData &&
    chartData
      .filter((item) => {
        const date = new Date(item.date);
        if (selectedDateRange?.from && selectedDateRange?.to) {
          return date >= selectedDateRange.from && date <= selectedDateRange.to;
        }

        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "last_30_days") {
          daysToSubtract = 30;
        } else if (timeRange === "last_7_days") {
          daysToSubtract = 7;
        } else if (timeRange === "yesterday") {
          daysToSubtract = 1;
        }
        now.setDate(now.getDate() - daysToSubtract);
        return date >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Fetch primary color from localStorage during initial render
  React.useEffect(() => {
    const storedPrimaryColor = localStorage.getItem("primary-color");
    setPrimaryColor(storedPrimaryColor);
  }, []);

  // Calculate highest metric whenever filtered data or enabled metrics change
  React.useEffect(() => {
    let maxValue = -Infinity;
    let maxMetric: string | null = null;

    // Only consider enabled metrics
    Object.keys(chartConfig).forEach((metric) => {
      if (enabledMetrics[metric]) {
        const metricMax = Math.max(
          ...(filteredData?.map((item) => Number(item[metric]) || 0) || [])
        );
        if (metricMax > maxValue) {
          maxValue = metricMax;
          maxMetric = metric;
        }
      }
    });

    setHighestMetric(maxMetric);
  }, [filteredData, enabledMetrics, chartConfig]);

  return (
    <Card className={clsx("shadow-sm border-none", className)}>
      <>
        <CardHeader className="flex w-full items-center gap-2 space-y-0 py-3 sm:flex-row">
          <div className="flex-row pb-6 flex w-full items-center gap-2 space-y-0 justify-between sm:flex-row">
            <CardTitle className="text-[#262626] text-base capitalize font-medium dark:text-[#f1f1fd]">
              {chartTitle || "Chart Title"}
            </CardTitle>
            <div
              className={`w-fit ${
                visibleRange ? "flex" : "hidden"
              } bg-[#F5F5F5] dark:bg-[#020617] rounded-md items-center justify-center`}
            >
              {/* Conditionally render DatePickerWithRange */}
              {timeRange === "custom" && (
                <DatePickerWithRange
                  selectedRange={selectedDateRange}
                  onDateChange={handleDateChange}
                />
              )}
              <Select value={timeRange} onValueChange={handleSelectChange}>
                <SelectTrigger
                  className="md:w-full px-4 lg:w-[120p rounded-lg sm:ml-auto dark:text-white dark:bg-[#020617]"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="last_3_months" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="last_30_days" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="last_7_days" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                  <SelectItem value="yesterday" className="rounded-lg">
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
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap my-2 space-y-4 lg:-mt-8 lg:my-0 lg:space-y-0 px-6">
          <div className="w-full flex items-center space-x-2">
            {Object.entries(chartConfig).map(([key, config]) => (
              <span key={key} className="flex items-center space-x-0.5">
                <Switch
                  id={key}
                  checked={enabledMetrics[key]}
                  onCheckedChange={(checked) =>
                    setEnabledMetrics((prev) => ({ ...prev, [key]: checked }))
                  }
                  style={{
                    backgroundColor:
                      key === highestMetric && primaryColor
                        ? primaryColor
                        : enabledMetrics[key]
                        ? config.color
                        : undefined,
                  }}
                />
                <Label
                  htmlFor={key}
                  style={{
                    color:
                      key === highestMetric && primaryColor
                        ? primaryColor
                        : enabledMetrics[key]
                        ? config.color
                        : undefined,
                  }}
                >
                  {config.label}
                </Label>
              </span>
            ))}
          </div>
        </div>
      </>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full -ml-6 pt-4"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 12, right: 12 }}
          >
            {Object.entries(chartConfig).map(([key, config]) => {
              const color =
                key === highestMetric && primaryColor
                  ? primaryColor
                  : config.color;
              return (
                <defs key={`${key}-gradient`}>
                  <linearGradient
                    id={`color${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              );
            })}
            <CartesianGrid
              vertical={true}
              horizontal={false}
              strokeDasharray="3 3"
            />
            <YAxis />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine
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
            {Object.entries(chartConfig).map(
              ([key, config]) =>
                enabledMetrics[key] && (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={
                      key === highestMetric && primaryColor
                        ? primaryColor
                        : config.color
                    }
                    strokeWidth={1.5}
                    fill={
                      key === highestMetric && primaryColor
                        ? `url(#color${key})`
                        : "transparent"
                    }
                  />
                )
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};