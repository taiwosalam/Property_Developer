export interface WalletAnalyticsProps {
  amount: number;
  title: "credit" | "debit" | "funds";
  trend: {
    percent: number;
    type: "up" | "down" | "none";
    from: "yesterday" | "last week" | "none";
  };

  className?: string;
}
