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

export type WalletAddFundsOptions =
  | "options"
  | "bank transfer"
  | "online funding";

export interface WalletModalPresetProps {
  title: string;
  back?: () => void;
  children: React.ReactNode;
}

export interface WalletFundsCardsHeadingProps {
  desc: string;
  title: string;
}

export interface WalletBankTransferCardProps {
  proceed?: () => void;
  cantInteract?: boolean;
}

export interface WalletOnlineFundingCardProps {
  proceed: () => void;
}

export interface FundingCardProps {
  cta: string;
  desc?: string;
  title?: string;
  notRounded?: boolean;
  type: "paystack" | "flutterwave" | "bank transfer" | "sterling";
}

export interface WalletModalDefaultProps {
  changeStep: React.Dispatch<React.SetStateAction<WalletAddFundsOptions>>;
}
