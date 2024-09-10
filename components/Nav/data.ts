// Types
import type { NavItemsProps } from "./types";

export const nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/dashboard",
  },
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord & landlady", href: "/landlord" },
      { label: "tenants & occupants", href: "/tenants" },
      { label: "staff & branches", href: "/staff-branch" },
      { label: "inventory", href: "/inventory" },
      { label: "properties", href: "/property" },
      { label: "rent & unit", href: "/rent" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "complaints", href: "/complaints" },
      { label: "inspections", href: "/inspections" },
      { label: "examine", href: "/examine" },
      { label: "maintenance", href: "/maintenance" },
      { label: "service providers", href: "/service" },
      { label: "calendars", href: "/calendars" },
      { label: "announcements", href: "/announcements" },
      { label: "call back request", href: "/call" },
      { label: "visitors request", href: "/visitors" },
      { label: "property request", href: "/property" },
      { label: "deposits request", href: "/deposits" },
      { label: "vehicles record", href: "/vehicles" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "listing",
    content: [
      { label: "units", href: "/units" },
      { label: "statistics", href: "/statistics" },
      { label: "property", href: "/property" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "accounting",
    content: [
      { label: "invoice", href: "/invoice" },
      { label: "receipts", href: "/receipts" },
      { label: "expenses", href: "/expenses" },
      { label: "disbursement", href: "/disbursement" },
      { label: "statement", href: "/statement" },
      { label: "VAT", href: "/vat" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "reports",
    content: [
      { label: "tenants / occupants", href: "/tenants" },
      { label: "landlord / landlady", href: "/landlord" },
      { label: "properties", href: "/properties" },
      { label: "units", href: "/units" },
      { label: "rent roll", href: "/rent" },
      { label: "listings", href: "/listings" },
      { label: "email", href: "/email" },
      { label: "SMS", href: "/sms" },
      { label: "tracking", href: "/tracking" },
      { label: "call request", href: "/call" },
      { label: "visitors request", href: "/visitors" },
      { label: "undo", href: "/undo" },
      { label: "vehicles record", href: "/vehicles" },
    ],
  },
  { type: "buildings", label: "wallet", href: "/wallet" },
  {
    type: "buildings",
    label: "applications",
    href: "/applications",
  },
  {
    type: "buildings",
    label: "documents",
    href: "/documents",
  },
  { type: "buildings", label: "settings", href: "/settings" },
];

export const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};
