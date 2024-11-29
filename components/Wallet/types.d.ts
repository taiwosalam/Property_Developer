import { CSSProperties } from "react";

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

export type WalletSendFundsOptions = "send funds" | "send fund to beneficiary";

export type WalletWithdrawFundsOptions = "withdrawal" | "input pin";

export interface WalletModalPresetProps {
  title: string;
  back?: () => void;
  style?: CSSProperties;
  children: React.ReactNode;
  headerClassName?: string;
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
  noInput?: boolean;
  proceed: () => void;
  title?: string;
  price?: number;
}

export interface FundingCardProps {
  cta?: string;
  desc?: string;
  title?: string;
  notRounded?: boolean;
  type: "paystack" | "flutterwave" | "bank transfer" | "sterling";
}

// Generic Interface for Modals
export interface WalletModalDefaultProps<
  T extends
    | WalletAddFundsOptions
    | WalletSendFundsOptions
    | WalletWithdrawFundsOptions
> {
  changeStep: React.Dispatch<React.SetStateAction<T>>;
}

export interface FundsBeneficiaryProps {
  remove?: () => void;
  seeMore?: () => void;
}

export type ActivateWalletOptions = "setup-pin" | "confirm-pin" | "enter-otp";
