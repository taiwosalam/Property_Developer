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

export interface notificationCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sectionHeader: string;
  notifications: {
    avatarFallback: string;
    avatarSrc: string;
    name: string;
    message: string;
    time: string;
    title?: string;
  }[];
}
