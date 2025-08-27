// fields.ts
import { Field } from "@/components/Table/types";
import { Avatar } from "@mui/material";

export const statsData = [
  {
    id: 1,
    variant: "blueIncoming" as const,
    title: "Total Monthly",
    balance: 1250000,
    percentage: 8,
    trendDirection: "up" as const,
    timeRangeLabel: "Last month",
  },
  {
    id: 2,
    variant: "redOutgoing" as const,
    title: "Total Outstanding",
    balance: 450000,
    percentage: 12,
    trendDirection: "down" as const,
    timeRangeLabel: "Last month",
  },
  {
    id: 3,
    variant: "greenIncoming" as const,
    title: "Average Payroll",
    balance: 82000,
    percentage: 5,
    trendDirection: "up" as const,
    timeRangeLabel: "Last month",
  },
];

export type PaymentHistory = {
  month: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
};

export type Staff = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  attendance: string;
  walletId: string;
  outstanding: string;
  payday: string;
  totalMonthly: string;
  dailyPayment: number;
  [key: string]: any;
  paymentHistory: PaymentHistory[];
};

export const staffData: Staff[] = [
  {
    id: 1,
    payday: "2025-01-30",
    totalMonthly: "500",
    attendance: "26/30",
    name: "John Doe",
    role: "Cleaner",
    outstanding: "50",
    avatar: "https://i.pravatar.cc/150?img=3",
    accountNumber: "1234567890",
    bankName: "Access Bank",
    accountName: "John Doe",
    walletId: "WLT001",
    dailyPayment: 5000,
    paymentHistory: [
      { month: "Jan", amount: 120000, date: "2025-01-30", status: "Paid" },
      { month: "Feb", amount: 120000, date: "2025-02-28", status: "Pending" },
    ],
  },
  {
    id: 1,
    payday: "2025-01-30",
    totalMonthly: "500",
    attendance: "26/30",
    name: "John Doe",
    role: "Cleaner",
    outstanding: "50",
    avatar: "https://i.pravatar.cc/150?img=3",
    accountNumber: "1234567890",
    bankName: "Access Bank",
    accountName: "John Doe",
    walletId: "WLT001",
    dailyPayment: 5000,
    paymentHistory: [
      { month: "Jan", amount: 120000, date: "2025-01-30", status: "Paid" },
      { month: "Feb", amount: 120000, date: "2025-02-28", status: "Pending" },
    ],
  },
  {
    id: 1,
    payday: "2025-01-30",
    totalMonthly: "500",
    attendance: "26/30",
    name: "John Doe",
    role: "Cleaner",
    outstanding: "50",
    avatar: "https://i.pravatar.cc/150?img=3",
    accountNumber: "1234567890",
    bankName: "Access Bank",
    accountName: "John Doe",
    walletId: "WLT001",
    dailyPayment: 5000,
    paymentHistory: [
      { month: "Jan", amount: 120000, date: "2025-01-30", status: "Paid" },
      { month: "Feb", amount: 120000, date: "2025-02-28", status: "Pending" },
    ],
  },
  {
    id: 1,
    payday: "2025-01-30",
    totalMonthly: "500",
    attendance: "26/30",
    name: "John Doe",
    role: "Cleaner",
    outstanding: "50",
    avatar: "https://i.pravatar.cc/150?img=3",
    accountNumber: "1234567890",
    bankName: "Access Bank",
    accountName: "John Doe",
    walletId: "WLT001",
    dailyPayment: 5000,
    paymentHistory: [
      { month: "Jan", amount: 120000, date: "2025-01-30", status: "Paid" },
      { month: "Feb", amount: 120000, date: "2025-02-28", status: "Pending" },
    ],
  },
];
export const transformStaffData = (data: Staff[]) =>
  data.map((staff) => ({
    id: staff.id,
    staffName: {
      avatar: staff.avatar,
      name: staff.name,
      role: staff.role,
    },
    payday: new Date(staff.payday).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    totalMonthly: `₦${staff.totalMonthly.toLocaleString()}`,
    attendance: `${staff.attendance} days`,
    outstanding: `₦${staff.outstanding.toLocaleString()}`,
    action: "", // placeholder, handled by CustomTable
  }));

export const staffFields: Field[] = [
  { id: "staffName", label: "Staff Name", accessor: "staffCell" },
  { id: "payday", accessor: "paydayCell", label: "Payday" },
  { id: "totalMonthly", accessor: "totalMonthlyCell", label: "Total Monthly" },
  { id: "attendance", accessor: "attendanceCell", label: "Attendance" },
  { id: "outstanding", accessor: "outstandingCell", label: "Outstanding" },
  { id: "action", accessor: "actionCell", label: "Action" },
];

export const transformStaffDataVariant = (data: Staff[]) =>
  data.map((staff) => ({
    id: staff.id,
    staffNameCell: (
      <div className="flex items-center gap-3">
        <Avatar src={staff.avatar} sx={{ width: 40, height: 40 }} />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{staff.name}</span>
          <span className="text-xs text-gray-500">{staff.role}</span>
        </div>
      </div>
    ),
    paydayCell: new Date(staff.payday).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    totalMonthlyCell: `₦${staff.totalMonthly.toLocaleString()}`,
    attendanceCell: `${staff.attendance} days`,
    outstandingCell: `₦${staff.outstanding.toLocaleString()}`,
    actionCell: "", // placeholder for your modal trigger
  }));
