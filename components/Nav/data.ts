// Types
import type { NavItemsProps } from "./types";
// import api from "@/services/api";
// import { useAuthStore } from "@/store/auth-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";

// The nav_items is used for the director role and it uses the top label joined the href unlinke manager
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

// Include the manager nav route in the href as it didn't use the label
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
      { label: "landlord & landlady", href: "/manager/management/landlord" },
      { label: "tenants & occupants", href: "/manager/management/tenants" },
      { label: "staff & branches", href: "/manager/management/staff-branch" },
      { label: "inventory", href: "/manager/management/inventory" },
      { label: "properties", href: "/manager/management/properties" },
      { label: "rent & unit", href: "/manager/management/rent-unit" },
      { label: "service providers", href: "/manager/management/service-providers" },
      { label: "vehicles record", href: "/manager/management/vehicles-record" },
      { label: "team chat", href: "/manager/management/team-chat" },
      { label: "agent community", href: "/management/agent-community" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "schedule visit", href: "/manager/tasks/schedule" },
      { label: "announcement", href: "/manager/tasks/announcement" },
      { label: "complaints", href: "/manager/tasks/complaints" },
      { label: "examine report", href: "/manager/tasks/examine" },
      { label: "maintenance report", href: "/manager/tasks/maintenance" },
      { label: "caution deposit", href: "/manager/tasks/deposits" },
      { label: "move out", href: "/manager/tasks/move-out" },
    ],
  },
  {
    type: "chart",
    label: "listing",
    content: [
      { label: "units", href: "/manager/listing/units" },
      { label: "statistics", href: "/manager/listing/statistics" },
      { label: "Property Draft/Request", href: "/manager/listing/property" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      { label: "invoice", href: "/manager/accounting/invoice" },
      { label: "receipts", href: "/manager/accounting/receipts" },
      { label: "expenses", href: "/manager/accounting/expenses" },
      { label: "disbursement", href: "/manager/accounting/disbursement" },
      { label: "statement", href: "/manager/accounting/statement" },
      { label: "VAT", href: "/manager/accounting/vat" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    content: [
      { label: "tenants / occupants", href: "/manager/reports/tenants" },
      { label: "landlord / landlady", href: "/manager/reports/landlord" },
      { label: "properties", href: "/manager/reports/properties" },
      { label: "units", href: "/manager/reports/units" },
      { label: "rent roll", href: "/manager/reports/rent" },
      { label: "listings", href: "/manager/reports/listings" },
      { label: "email", href: "/manager/reports/email" },
      { label: "SMS", href: "/manager/reports/sms" },
      { label: "tracking", href: "/manager/reports/tracking" },
      { label: "call request", href: "/manager/reports/call" },
      { label: "visitors request", href: "/manager/reports/visitors" },
      { label: "undo", href: "/manager/reports/undo" },
      { label: "vehicles record", href: "/manager/reports/vehicles-record" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/manager/wallet" },
  {
    type: "task",
    label: "applications",
    href: "/manager/applications",
  },
  {
    type: "folder",
    label: "documents",
    href: "/manager/documents",
  },
  { type: "settings", label: "settings", href: "/manager/settings" },
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
