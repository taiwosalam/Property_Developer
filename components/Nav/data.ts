// Types
import type { NavItemsProps } from "./types";
// import api from "@/services/api";
// import { useAuthStore } from "@/store/auth-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";


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
      { label: "properties", href: "/properties" },
      { label: "rent & unit", href: "/rent-unit" },
      { label: "service providers", href: "/service-providers" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "team chat", href: "/team-chat" },
      { label: "agent community", href: "/agent-community" },
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
      { label: "calendars", href: "/calendars" },
      { label: "announcements", href: "/announcements" },
      { label: "call request", href: "/inquires" },
      { label: "visitors request", href: "/visitors" },
      { label: "property request", href: "/property-request" },
      { label: "deposits request", href: "/deposits" },
    ],
  },
  {
    type: "chart",
    label: "listing",
    content: [
      { label: "units", href: "/units" },
      { label: "statistics", href: "/statistics" },
      { label: "Property Draft/Request", href: "/property" },
    ],
  },
  {
    type: "menu_board",
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
    type: "status_up",
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
      { label: "vehicles record", href: "/vehicles-record" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/wallet" },
  {
    type: "task",
    label: "applications",
    href: "/applications",
  },
  {
    type: "folder",
    label: "documents",
    href: "/documents",
  },
  { type: "settings", label: "settings", href: "/settings" },
];


export const manager_nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/manager/dashboard",
  },
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord & landlady", href: "/landlord" },
      { label: "tenants", href: "/tenants" },
      { label: "occupants", href: "/occupants" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "schedule visit", href: "#" },
      { label: "announcement", href: "#" },
      { label: "complaints", href: "#" },
      { label: "examine report", href: "#" },
      { label: "maintenance report", href: "#" },
      { label: "caution deposit", href: "#" },
      { label: "move out", href: "#" },
    ],
  },
]

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

export interface ProfileResponse {
  data: {
    user: {
      userid: string;
      name: string | null;
    };
    company?: {
      company_id: string;
      company_name: string;
      company_logo: string;
      state: string;
      local_government: string;
      head_office_address: string;
      city: string;
      phone_numbers: string[];
      date_of_registration: string;
      membership_number: string;
      is_verified: boolean;
      industry: string;
      cac_registration_number: string;
    };
    director?: {
      personal_title: string | null;
    };
    profile: {
      picture: string | null;
      title: string;
    };
  };
}
