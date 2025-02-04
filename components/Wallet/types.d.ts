import { CSSProperties } from "react";
import type { Beneficiary } from "@/store/wallet-store";

export interface WalletAnalyticsProps {
  amount: number;
  title: "credit" | "debit" | "funds";
  trend: {
    percent: number;
    type: "up" | "down" | "none" | "equal";
    from: "last month" | "last week" | "none";
  };

  className?: string;
}

export interface FundingCardProps {
  cta?: string;
  desc?: string;
  title?: string;
  notRounded?: boolean;
  logo?: string;
  type: "paystack" | "flutterwave" | "bank transfer" | "sterling";
}

export type WalletSendFundsOptions = "send funds menu" | "recipient";

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

// Generic Interface for Modals
export interface WalletModalDefaultProps<
  T extends WalletSendFundsOptions | WalletWithdrawFundsOptions
> {
  changeStep: React.Dispatch<React.SetStateAction<T>>;
  branch?: boolean;
}

export interface FundsBeneficiaryProps extends Beneficiary {
  onClick?: () => void;
  seeMore?: boolean;
  remove?: () => void;
}

export type ActivateWalletOptions = "setup-pin" | "confirm-pin" | "enter-otp";
