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

export const getDashboardCardData = (data: Record<string, any>) =>  [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: data.data.property_count,
    subValue: data.data.month_count,
    link: "/management/staff-branch/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: data.data.landlord_count,
    subValue: data.data.month_landlord_count,
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: data.data.tenant_count,
    subValue: data.data.month_tenant_count,
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: data.data.vacant_unit,
    subValue: data.data.month_vacant_unit,
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: data.data.inquiry_count,
    subValue: data.data.month_expired_unit,
    link: "/management/expired-units",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: data.data.invoice_count,
    subValue: data.data.month_invoice_count,
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: data.data.inquiry_count,
    subValue: data.data.month_inquiry_count,
    link: "/tasks/inquires",
  },

  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: data.data.complaint_count,
    subValue: data.data.month_complaint_count,
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: data.data.listing_count,
    subValue: data.data.month_listing_count,
    link: "/listing/units",
  },
];


export const initialDashboardStats = [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: 0,
    subValue: 0,
    link: "/management/staff-branch/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: 0,
    subValue: 0,
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: 0,
    subValue: 0,
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: 0,
    subValue: 0,
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: 0,
    subValue: 0,
    link: "/management/rent-unit",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: 0,
    subValue: 0,
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: 0,
    subValue: 0,
    link: "/tasks/inquires",
  },
  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: 0,
    subValue: 0,
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: 0,
    subValue: 0,
    link: "/listing/units",
  },
];

export const dashboardCardData = [
  {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: BuildingIcon,
    value: 0,
    subValue: 0,
    link: "/management/staff-branch/",
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: 0,
    subValue: 0,
    link: "/management/landlord",
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: 0,
    subValue: 0,
    link: "/management/tenants",
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: 0,
    subValue: 0,
    link: "/management/rent-unit",
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: 0,
    subValue: 0,
    link: "/management/rent-unit",
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: 0,
    subValue: 0,
    link: "/accounting/invoice",
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: 0,
    subValue: 0,
    link: "/tasks/inquires",
  },
  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: 0,
    subValue: 0,
    link: "/tasks/complaints",
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: 0,
    subValue: 0,
    link: "/listing/units",
  },
];

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
//   return (
//     data?.map((m: any) => ({
//       id: m?.id,
//       avatarSrc: m?.pfp,
//       name: m?.fullname,
//       message: m?.desc,
//       time: m?.time,
//       count: m?.unread_count,
//       content_type: m?.content_type,
//     }))
//   );
// };

export const getRecentMessages = (data: any) => {
  // console.log("data", data);
  return (
    data
      ?.slice(0, 7) // Limit to the first 7 messages
      .map((m: any) => ({
        id: m?.id,
        avatarSrc: m?.pfp,
        name: m?.fullname,
        message: m?.desc,
        time: m?.time,
        count: m?.unread_count,
        content_type: m?.content_type,
      }))
  );
};


export const complaintsData = [
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Door complain",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Visitor door and water",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Water complain",
  },
  {
    avatarSrc: "/empty/avatar.png",
    name: "Amori Ademakinwa",
    message: "Hello, this is Makinwa, and i want to ask you how",
    time: "2:30pm",
    title: "Door complain",
  },
  {
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
  totalfunds: {
    label: "Total funds",
    color: "#38BDF8",
  },
  credit: {
    label: "Credit",
    color: "#2DD4BF ",
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

export const invoiceTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  {
    id: "2",
    label: "Name",
    accessor: "name",
  },
  { id: "3", label: "Invoice ID", accessor: "invoice_id" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: "350px",
    },
  },
  { id: "5", label: "Total Amount", accessor: "total_amount" },
  { id: "6", label: "Date", accessor: "date" },
];

export const dashboardInvoiceTableData = Array.from(
  { length: 15 },
  (_, index) => {
    const names = [
      "Samuel Fiyinfoluwa",
      "Dada Teniola Emmanuel",
      "Abdulrafiu Mubi",
    ];
    return {
      id: `${index + 1}`,
      picture: "/empty/SampleLandlord.jpeg",
      name: names[index % names.length],
      invoice_id: `INV${index + 1}`,
      details:
        "Rent Cost: Start date: September 02, 2024. Rent Cost: Start date: September 02, 2024.",
      total_amount: `₦${(
        Math.floor(Math.random() * 20000) + 102000
      ).toLocaleString()}`,
      date: "12/12/2034",
    };
  }
);
