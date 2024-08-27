// Imports

// Exports
export interface cardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon: string;
  value: number;
  subvalue: number;
  bg: string;
}

export interface walletBalanceCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mainBalance: number;
  cautionDeposit: number;
}
