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
import { DateRange } from "react-day-picker";

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface DashboardChartProps {
  visibleRange?: boolean;
  chartTitle?: string;
  className?: string;
  chartConfig: ChartConfig;
  chartData: ChartDataPoint[];
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
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

  const [timeRange, setTimeRange] = React.useState("30d");
  const [highestMetric, setHighestMetric] = React.useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const [selectedDateRange, setSelectedDateRange] = React.useState<
    DateRange | undefined
  >(calculateDateRange(30));

  React.useEffect(() => {
    if (!selectedDateRange) {
      const initialRange = calculateDateRange(30);
      setSelectedDateRange(initialRange);
    }
  }, [selectedDateRange]);

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
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
          ...filteredData.map((item) => Number(item[metric]) || 0)
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
          <div className="flex w-full py-2 justify-between">
            <CardTitle className="text-[#262626] text-base capitalize font-medium dark:text-[#f1f1fd]">
              {chartTitle || "Chart Title"}
            </CardTitle>
            <div
              className={`w-fit ${
                visibleRange ? "flex" : "hidden"
              } bg-[#F5F5F5] dark:bg-[#020617] rounded-md items-center justify-center`}
            >
              <DatePickerWithRange
                selectedRange={selectedDateRange}
                onDateChange={handleDateChange}
              />
              <Select value={timeRange} onValueChange={handleSelectChange}>
                <SelectTrigger
                  className="md:w-full lg:w-[120px] rounded-lg sm:ml-auto dark:text-whie dark:bg-[#020617]"
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
          className="aspect-auto h-[280px] w-full -ml-6"
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
