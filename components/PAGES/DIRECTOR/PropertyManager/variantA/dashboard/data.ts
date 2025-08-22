import { type ChartConfig } from "@/components/ui/chart";
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
import type { Field } from "@/components/Table/types";
import api, { handleAxiosError } from "@/services/api";
import { Task } from "@/components/dashboard/kanban/TaskCard";
import { formatNumber } from "@/utils/number-formatter";
import { empty } from "@/app/config";

export function getBackgroundColor(title: string): string {
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

export const getDashboardCardData = (data: Record<string, any>) => [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: formatNumber(data.data.property_count),
    subValue: formatNumber(data.data.month_count),
    link: "/management/properties/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: formatNumber(data.data.landlord_count),
    subValue: formatNumber(data.data.month_landlord_count),
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: formatNumber(data.data.tenant_count),
    subValue: formatNumber(data.data.month_tenant_count),
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: formatNumber(data.data.vacant_unit),
    subValue: formatNumber(data.data.month_vacant_unit),
    link: "/management/rent-unit?is_active=vacant",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: formatNumber(data.data.expired_unit),
    subValue: formatNumber(data.data.month_expired_unit),
    link: "/management/rent-unit?is_active=expired",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: formatNumber(data.data.invoice_count),
    subValue: formatNumber(data.data.month_invoice_count),
    link: "/accounting/invoice?status=pending",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: formatNumber(data.data.inquiry_count),
    subValue: formatNumber(data.data.month_inquiry_count),
    link: "/tasks/inquires?status=pending",
  },
  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: formatNumber(data.data.complaint_count),
    subValue: formatNumber(data.data.month_complaint_count),
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: formatNumber(data.data.listing_count),
    subValue: formatNumber(data.data.month_listing_count),
    link: "/listing/units",
  },
];

export const initialDashboardStats = [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: "0",
    subValue: "0",
    link: "/management/properties/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: "0",
    subValue: "0",
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: "0",
    subValue: "0",
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: "0",
    subValue: "0",
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: "0",
    subValue: "0",
    link: "/management/rent-unit",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: "0",
    subValue: "0",
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: "0",
    subValue: "0",
    link: "/tasks/inquires",
  },
  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: "0",
    subValue: "0",
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: "0",
    subValue: "0",
    link: "/listing/units",
  },
];

export const dashboardCardData = [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: "0",
    subValue: "0",
    link: "/management/staff-branch/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
      value: "0",
    subValue: "0",
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: "0",
    subValue: "0",
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: "0",
    subValue: "0",
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: "0",
    subValue: "0",
    link: "/management/rent-unit",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: "0",
    subValue: "0",
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: "0",
    subValue: "0",
    link: "/tasks/inquires",
  },
  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: "0",
    subValue: "0",
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: "0",
    subValue: "0",
    link: "/listing/units",
  },
];

export const transformWalletChartData = (transactions:any) => {
  return transactions.map((t:any) => ({
    date: t.date,
    totalfunds:
      (t.type === "credit" ||
      t.transaction_type === "funding" ||
      t.transaction_type === "transfer_in"
        ? Number(t.amount)
        : 0) +
      (t.type === "debit" ||
      t.transaction_type === "withdrawal" ||
      t.transaction_type === "sponsor_listing" ||
      t.transaction_type === "transfer_out"
        ? Number(t.amount)
        : 0),
    credit:
      t.type === "credit" ||
      t.transaction_type === "funding" ||
      t.transaction_type === "transfer_in"
        ? Number(t.amount)
        : 0,
    debit:
      t.type === "debit" ||
      t.transaction_type === "withdrawal" ||
      t.transaction_type === "sponsor_listing" ||
      t.transaction_type === "transfer_out"
        ? Number(t.amount)
        : 0,
  }));
};

export const walletBalanceCardData = {
  mainBalance: 1000,
  cautionDeposit: 200,
};

export const recentMessagesData = [
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
  },
];

// export const getRecentMessages = (data: any) => {
//   return data
//     ?.slice(0, 7) // Limit to the first 7 messages
//     .map((m: any) => ({
//       id: m?.id,
//       avatarSrc: m?.pfp || "/emp",
//       name: m?.fullname,
//       message: m?.desc,
//       time: m?.time,
//       count: m?.unread_count,
//       content_type: m?.content_type,
//       online: m?.online,
//       badgeColor: m.badgeColor,
//     }));
// };
export const getRecentMessages = (data: any) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data
    .slice(0, 7)
    .map((m: any) => ({
      id: m?.id || "",
      avatarSrc: m?.pfp || empty, // Always provide a fallback
      name: m?.fullname || "Unknown User",
      message: m?.desc || "",
      time: m?.time || "",
      count: m?.unread_count || 0,
      content_type: m?.content_type || "text",
      online: m?.online || false,
      badgeColor: m.badgeColor || undefined,
    }));
};

export const complaintsData = [
  // {
  //   avatarSrc: "/empty/avatar.png",
  //   name: "Amori Ademakinwa",
  //   message: "Hello, this is Makinwa, and i want to ask you how",
  //   time: "2:30pm",
  //   title: "Door complain",
  // },
  // {
  //   avatarSrc: "/empty/avatar.png",
  //   name: "Amori Ademakinwa",
  //   message: "Hello, this is Makinwa, and i want to ask you how",
  //   time: "2:30pm",
  //   title: "Visitor door and water",
  // },
  // {
  //   avatarSrc: "/empty/avatar.png",
  //   name: "Amori Ademakinwa",
  //   message: "Hello, this is Makinwa, and i want to ask you how",
  //   time: "2:30pm",
  //   title: "Water complain",
  // },
  // {
  //   avatarSrc: "/empty/avatar.png",
  //   name: "Amori Ademakinwa",
  //   message: "Hello, this is Makinwa, and i want to ask you how",
  //   time: "2:30pm",
  //   title: "Door complain",
  // },
  // {
  //   avatarSrc: "/empty/avatar.png",
  //   name: "Amori Ademakinwa",
  //   message: "Hello, this is Makinwa, and i want to ask you how",
  //   time: "2:30pm",
  //   title: "Door complain",
  // },
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
  totalfunds: {
    label: "Total funds",
    color: "#38BDF8",
  },
  credit: {
    label: "Credit",
    color: "#2DD4BF",
  },
  debit: {
    label: "Debit",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const dashboardListingsChartConfig = {
  views: {
    label: "Views",
    color: "#01BA4C",
  },
  bookmarks: {
    label: "Bookmarked",
    color: "#2DD4BF",
  },
};


export const sendDemoRequest = async (data: FormData) => {
  try {
    const res = await api.post("/request-demos", data);
    console.log("res", res);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const dummyTasks: Task[] = [

];
