function getBackgroundColor(title: string): string {
  let backgroundColor: string;

  switch (title) {
    case "properties":
      backgroundColor = "#702AC8";
      break;
    case "vacant unit":
      backgroundColor = "#E74833";
      break;
    case "inquiries":
      backgroundColor = "#C25589";
      break;
    case "landlords":
      backgroundColor = "#EBA3C2";
      break;
    case "expired":
      backgroundColor = "#00BCD3";
      break;
    case "complaints":
      backgroundColor = "#1A96F0";
      break;
    case "tenants & occupants":
      backgroundColor = "#181670";
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

export const dashboardCardData = Object.entries({
  properties: {
    title: "Properties",
    bg: getBackgroundColor("properties"),
    icon: "/icons/dashboard-cards/Building.svg",
    value: 10,
    subValue: 20,
  },
  vacantUnit: {
    title: "Vacant Unit",
    bg: getBackgroundColor("vacant unit"),
    icon: "/icons/dashboard-cards/bed.svg",
    value: 5,
    subValue: 20,
  },
  inquiries: {
    title: "Inquiries",
    bg: getBackgroundColor("inquiries"),
    icon: "/icons/dashboard-cards/enquires.svg",
    value: 20,
    subValue: 20,
  },
  landlords: {
    title: "Landlords",
    bg: getBackgroundColor("landlords"),
    icon: "/icons/dashboard-cards/landlords.svg",
    value: 15,
    subValue: 20,
  },
  expired: {
    title: "Expired",
    bg: getBackgroundColor("expired"),
    icon: "/icons/dashboard-cards/expired.svg",
    value: 3,
    subValue: 20,
  },
  complaints: {
    title: "Complaints",
    bg: getBackgroundColor("complaints"),
    icon: "/icons/dashboard-cards/complaints.svg",
    value: 8,
    subValue: 20,
  },
  tenantsOccupants: {
    title: "Tenants & Occupants",
    bg: getBackgroundColor("tenants & occupants"),
    icon: "/icons/dashboard-cards/tenants&occupants.svg",
    value: 25,
    subValue: 20,
  },
  invoices: {
    title: "Invoices",
    bg: getBackgroundColor("invoices"),
    icon: "/icons/dashboard-cards/invoices.svg",
    value: 12,
    subValue: 20,
  },
  listings: {
    title: "Listings",
    bg: getBackgroundColor("listings"),
    icon: "/icons/dashboard-cards/listings.png",
    value: 7,
    subValue: 20,
  },
}).map(([key, value]) => ({ id: key, ...value }));

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
