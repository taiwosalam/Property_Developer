// Imports

import React from "react";

// Exports
export interface cardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon: React.ReactNode;
  value: number;
  subvalue: number;
  bg: string;
}

export interface walletBalanceCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  noHeader?: boolean;
}

export interface notificationCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  seeAllLink?: string;
  sectionHeader: string;
  className?: string;
  branchId?: string;
  notifications: {
    avatarFallback: string;
    avatarSrc: string;
    name?: string;
    full_name?: string;
    message: string;
    time: string;
    title?: string;
    position?: string;
    staff_ID?: string;
  }[];
}
