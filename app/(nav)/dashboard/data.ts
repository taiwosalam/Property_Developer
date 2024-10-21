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
  },
  {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: LandlordIcon,
    value: 15,
    subValue: 20,
  },
  {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: TenantIcon,
    value: 25,
    subValue: 20,
  },
  {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: BedIcon,
    value: 5,
    subValue: 20,
  },
  {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: ExpiredIcon,
    value: 3,
    subValue: 20,
  },
  {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: InvoiceIcon,
    value: 12,
    subValue: 20,
  },
  {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: InquiriesIcon,
    value: 20,
    subValue: 20,
  },

  {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: ComplaintsIcon,
    value: 8,
    subValue: 20,
  },
  {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: ListingsIcon,
    value: 7,
    subValue: 20,
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
