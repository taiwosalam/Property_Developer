import { ChartConfig } from "@/components/ui/chart";

export const walletChartConfig = {
  totalfunds: {
    label: "total funds",
    color: "#38BDF8",
  },
  credit: {
    label: "credit",
    color: "#2DD4BF ",
  },
  debit: {
    label: "debit",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const walletChartData = [
  { date: "2024-09-01", totalfunds: 70, credit: 30, debit: 30 },
  { date: "2024-09-02", totalfunds: 100, credit: 60, debit: 30 },
  { date: "2024-09-03", totalfunds: 40, credit: 20, debit: 30 },
  { date: "2024-09-08", totalfunds: 120, credit: 80, debit: 30 },
  { date: "2024-08-18", totalfunds: 70, credit: 50, debit: 30 },
  { date: "2024-08-20", totalfunds: 150, credit: 90, debit: 30 },
  { date: "2024-08-28", totalfunds: 100, credit: 60, debit: 30 },
  { date: "2024-09-30", totalfunds: 140, credit: 10, debit: 300 },
];
