import { ChartConfig } from "@/components/ui/chart";
import {
  BuildingIcon,
  LandlordIcon,
  TenantIcon,
  BedIcon,
  ExpiredIcon,
  InvoiceIcon,
  InquiriesIcon,
  ComplaintsIcon,
  ListingsIcon,
} from "@/public/icons/dashboard-cards/icons";
import { subDays, format } from "date-fns";

function getBackgroundColor(title: string): string {
  let backgroundColor: string;

  switch (title) {
    case "properties":
      backgroundColor = "#702AC8";
      break;
    case "landlords":
      backgroundColor = "#EBA3C2";
      break;
    case "tenants & occupants":
      backgroundColor = "#181670";
      break;
    case "vacant unit":
      backgroundColor = "#E74833";
      break;
    case "inquiries":
      backgroundColor = "#C25589";
      break;
    case "expired":
      backgroundColor = "#00BCD3";
      break;
    case "complaints":
      backgroundColor = "#1A96F0";
      break;
    case "invoices":
      backgroundColor = "#C7E12C";
      break;
    case "listings":
      backgroundColor = "#702AC8";
      break;
    default:
      backgroundColor = "#FFFFFF";
      break;
  }

  return backgroundColor;
}

export const dashboardCardData = [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: 10,
    subValue: 20,
    link: "/management/properties",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: 15,
    subValue: 20,
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: 25,
    subValue: 20,
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: 5,
    subValue: 20,
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: 3,
    subValue: 20,
    link: "/management/rent-unit",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: 12,
    subValue: 20,
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: 20,
    subValue: 20,
    link: "/tasks/inquires",
  },

  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: 8,
    subValue: 20,
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: 7,
    subValue: 20,
    link: "/listing/units",
  },
];

export const walletBalanceCardData = {
  mainBalance: 1000,
  cautionDeposit: 200,
};

export const recentMessagesData = [
  {
    avatarFallback: "OM",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarFallback: "JL",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarFallback: "IN",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarFallback: "WK",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarFallback: "SD",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
];

export const complaintsData = [
  {
    avatarFallback: "OM",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Door complain",
  },
  {
    avatarFallback: "JL",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Visitor door and water",
  },
  {
    avatarFallback: "IN",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Water complain",
  },
  {
    avatarFallback: "WK",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Door complain",
  },
  {
    avatarFallback: "SD",
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Door complain",
  },
];

export const getDashboardData = async (access_token: string | null) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching dashboard data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const dashboardPerformanceChartConfig = {
  sales: {
    label: "Sales",
    color: "#38BDF8",
  },
  profits: {
    label: "Profits",
    color: "#2DD4BF",
  },
  expenses: {
    label: "Expenses",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const dashboardListingsChartConfig = {
  views: {
    label: "Views",
    color: "#01BA4C",
  },
  enquiries: {
    label: "Enquiries",
    color: "#315EE7",
  },
};

export const dashboardPerformanceChartData = [
  { date: "2024-09-01", profits: 50, sales: 70, expenses: 30 },
  { date: "2024-09-02", profits: 90, sales: 100, expenses: 60 },
  { date: "2024-09-03", profits: 30, sales: 40, expenses: 20 },
  { date: "2024-09-08", profits: 110, sales: 120, expenses: 80 },
  { date: "2024-08-18", profits: 60, sales: 70, expenses: 50 },
  { date: "2024-08-20", profits: 130, sales: 150, expenses: 90 },
  { date: "2024-08-28", profits: 80, sales: 100, expenses: 60 },
  { date: "2024-09-30", profits: 120, sales: 140, expenses: 100 },
];

export const dashboardListingsChartData = Array.from({ length: 90 }, (_, i) => {
  const date = subDays(new Date(), i);
  return {
    date: format(date, "yyyy-MM-dd"),
    views: Math.floor(Math.random() * 100) + 50,
    enquiries: Math.floor(Math.random() * 50) + 20,
  };
}).reverse();
