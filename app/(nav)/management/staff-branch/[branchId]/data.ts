import { ChartConfig } from "@/components/ui/chart";

export const branchIdChartConfig = {
  sales: {
    label: "Sales",
    color: "#38BDF8",
  },
  profits: {
    label: "Profits",
    color: "#2DD4BF",
  },
  expenses: {
    label: "Expenses",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const branchIdChartData = [
  { date: "2024-09-01", profits: 50, sales: 70, expenses: 30 },
  { date: "2024-09-02", profits: 90, sales: 100, expenses: 60 },
  { date: "2024-09-03", profits: 30, sales: 40, expenses: 20 },
  { date: "2024-09-08", profits: 110, sales: 120, expenses: 80 },
  { date: "2024-08-18", profits: 60, sales: 70, expenses: 50 },
  { date: "2024-08-20", profits: 130, sales: 150, expenses: 90 },
  { date: "2024-08-28", profits: 80, sales: 100, expenses: 60 },
  { date: "2024-09-30", profits: 120, sales: 140, expenses: 100 },
];
