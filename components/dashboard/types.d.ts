// Imports

import React from "react";
import { type BadgeIconColors } from "../BadgeIcon/badge-icon";

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

export interface notificationCardProps {
  seeAllLink?: string;
  sectionHeader: "Staffs" | "Recent Messages" | "Complaints";
  className?: string;
  branchId?: string;
  notifications: {
    id?: string;
    avatarSrc: string;
    name: string;
    message?: string;
    time?: string;
    title?: string;
    position?: string;
    staff_ID?: string;
    user_id?: string;
    badgeColor?: BadgeIconColors;
    count?: number;
  }[];
}
