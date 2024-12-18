import { CSSProperties } from "react";
import type { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

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

export interface FundingCardProps {
  cta?: string;
  desc?: string;
  title?: string;
  notRounded?: boolean;
  type: "paystack" | "flutterwave" | "bank transfer" | "sterling";
}

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

// Generic Interface for Modals
export interface WalletModalDefaultProps<
  T extends WalletSendFundsOptions | WalletWithdrawFundsOptions
> {
  changeStep: React.Dispatch<React.SetStateAction<T>>;
}

export interface FundsBeneficiaryProps {
  picture: string;
  name: string;
  wallet_id: string;
  onClick?: () => void;
  seeMore?: boolean;
  remove?: () => void;
  badge_color?: BadgeIconColors;
}

export type ActivateWalletOptions = "setup-pin" | "confirm-pin" | "enter-otp";
