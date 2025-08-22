// Types
import type { NavItemsProps } from "./types";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import { SVGType } from "../SVG/types";

// The nav_items is used for the director role
export const property_developer_director_nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/dashboard",
  },
  {
    type: "people",
    label: "management",
    href: "#",
    content: [
      { label: "clients", href: "#" },
      { label: "owners", href: "#" },
      { label: "investors", href: "#" },
      { label: "properties", href: "#" },
      { label: "sales & unit", href: "#" },
      { label: "staff & branch", href: "#" },
      { label: "referrals", href: "#" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "HRM",
    href: "#",
    content: [
      { label: "staff schedule", href: "#" },
      { label: "staff attendance", href: "#" },
      { label: "payroll", href: "#" },
      { label: "logbook", href: "#" },
    ],
  },
  {
    type: "chart",
    label: "inventories",
    href: "#",
    content: [
      { label: "category", href: "#" },
      { label: "items request", href: "#" },
      { label: "inventory", href: "#" },
      { label: "suppliers", href: "#" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    href: "#",
    content: [
      { label: "calendar", href: "#" },
      { label: "inspections", href: "#" },
      { label: "announcement", href: "#" },
      { label: "to do", href: "#" },
      { label: "request", href: "#" },
      { label: "inquires", href: "#" },
      { label: "complain", href: "#" },
    ],
  },
  {
    type: "chart",
    label: "Sales & Units",
    href: "#",
    content: [
      { label: "listing", href: "#" },
      { label: "performance", href: "#" },
      { label: "Properties", href: "#" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    href: "#",
    content: [
      { label: "invoice", href: "#" },
      { label: "expenses", href: "#" },
      { label: "disbursement", href: "#" },
      { label: "VAT", href: "#" },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/community",
    content: [
      { label: "team chat", href: "/team-chat" },
      { label: "agent forum", href: "/agent-forum" },
      { label: "agent request", href: "/agent-request" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    href: "#",
    content: [
      { label: "client", href: "#" },
      { label: "owner", href: "#" },
      { label: "investors", href: "#" },
      { label: "properties", href: "#" },
      { label: "units", href: "#" },
      { label: "sales", href: "#" },
      { label: "referral", href: "#" },
      { label: "tracking", href: "#" },
      { label: "email", href: "#" },
      { label: "sms", href: "#" },
      { label: "request", href: "#" },
      { label: "item request", href: "#" },
      { label: "undo", href: "#" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/wallet" },
  { type: "task", label: "task", href: "#" },
  {
    type: "folder",
    label: "documents",
    href: "#",
  },
  { type: "settings", label: "settings", href: "#" },
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
      { label: "branch Staff", href: "/manager/management/branch-staff" },
      { label: "landlord & landlady", href: "/manager/management/landlord" },
      { label: "tenants & occupants", href: "/manager/management/tenants" },
      { label: "inventory", href: "/manager/management/inventory" },
      { label: "properties", href: "/manager/management/properties" },
      { label: "rent & mgmt", href: "/manager/management/rent-unit" },
      {
        label: "Property Draft/Request",
        href: "/manager/management/property-draft",
      },
      // { label: "vehicles record", href: "/manager/management/vehicles-record" },
      {
        label: "service providers",
        href: "/management/service-providers",
      },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    href: "/manager/tasks",
    content: [
      { label: "applications", href: "/applications" },
      { label: "complaints", href: "/complaints" },
      { label: "inspections", href: "/inspections" },
      { label: "examine", href: "/examine" },
      { label: "maintenance", href: "/maintenance" },
      { label: "calendars", href: "/calendars" },
      { label: "announcements", href: "/announcements" },
      { label: "call request", href: "/inquires" },
      { label: "visitors request", href: "/visitors" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "property request", href: "/property-request" },
      { label: "deposits request", href: "/deposits" },
    ],
  },
  {
    type: "chart",
    label: "unit mgmt",
    href: "/manager/listing",
    content: [
      { label: "Listing", href: "/units" },
      { label: "statistics", href: "/statistics" },
      // { label: "Property Draft/Request", href: "/manager/listing/property" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    href: "/manager/accounting",
    content: [
      { label: "invoice", href: "/invoice" },
      { label: "expenses", href: "/expenses" },
      { label: "disbursement", href: "/disbursement" },
      { label: "VAT", href: "/vat" },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/community",
    content: [
      { label: "team chat", href: "/team-chat" },
      { label: "agent forum", href: "/agent-forum" },
      { label: "agent request", href: "/agent-request" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    href: "/manager/reports",
    content: [
      { label: "tenants / occupants", href: "/tenants" },
      { label: "landlord / landlady", href: "/landlord" },
      { label: "properties", href: "/properties" },
      { label: "units / Mgmt", href: "/units" },
      { label: "rent roll", href: "/rent" },
      { label: "SMS", href: "/sms" },
      { label: "call request", href: "/call" },
      { label: "visitors request", href: "/visitors" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "calendar", href: "/calendar-event" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/manager/wallet" },
  {
    type: "folder",
    label: "documents",
    href: "/manager/documents",
  },
  { type: "settings", label: "settings", href: "/manager/settings" },
];

export const account_nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/accountant/dashboard",
  },
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord & landlady", href: "/accountant/management/landlord" },
      { label: "tenants & occupants", href: "/accountant/management/tenants" },
      { label: "Other Staff", href: "/accountant/management/branch-staff" },
      { label: "inventory", href: "/accountant/management/inventory" },
      { label: "properties", href: "/accountant/management/properties" },
      { label: "rent & mgmt", href: "/accountant/management/rent-unit" },
      // {
      //   label: "vehicles record",
      //   href: "/accountant/management/vehicles-record",
      // },
      {
        label: "Property Draft/Request",
        href: "/accountant/management/property-draft",
      },
      {
        label: "service providers",
        href: "/management/service-providers",
      },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    href: "/accountant/tasks",
    content: [
      { label: "applications", href: "/applications" },
      { label: "complaints", href: "/complaints" },
      { label: "inspections", href: "/inspections" },
      { label: "examine", href: "/examine" },
      { label: "maintenance", href: "/maintenance" },
      { label: "calendars", href: "/calendars" },
      { label: "announcements", href: "/announcements" },
      { label: "call request", href: "/inquires" },
      { label: "visitors request", href: "/visitors" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "property request", href: "/property-request" },
      { label: "deposits request", href: "/deposits" },
    ],
  },
  {
    type: "chart",
    label: "unit mgmt",
    href: "/accountant/listing",
    content: [
      { label: "Listing", href: "/units" },
      { label: "statistics", href: "/statistics" },
      // { label: "Property Draft/Request", href: "/accountant/listing/property" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    href: "/accountant/accounting",
    content: [
      { label: "invoice", href: "/invoice" },
      { label: "expenses", href: "/expenses" },
      { label: "disbursement", href: "/disbursement" },
      // { label: "VAT", href: "/accountant/accounting/vat" },
    ],
  },

  {
    type: "task",
    label: "community",
    href: "/community",
    content: [
      { label: "team chat", href: "/team-chat" },
      { label: "agent forum", href: "/agent-forum" },
      { label: "agent request", href: "/agent-request" },
    ],
  },

  { type: "settings", label: "settings", href: "/accountant/settings" },
];

export const staff_nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/staff/dashboard",
  },
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord & landlady", href: "/staff/management/landlord" },
      { label: "tenants & occupants", href: "/staff/management/tenants" },
      { label: "Other Staff", href: "/staff/management/branch-staff" },
      { label: "inventory", href: "/staff/management/inventory" },
      { label: "properties", href: "/staff/management/properties" },
      {
        label: "Property Draft/Request",
        href: "/staff/management/property-draft",
      },
      // {
      //   label: "vehicles record",
      //   href: "/staff/management/vehicles-record",
      // },
      {
        label: "service providers",
        href: "/management/service-providers",
      },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    href: "/staff/tasks",
    content: [
      { label: "complaints", href: "/complaints" },
      { label: "inspections", href: "/inspections" },
      { label: "examine", href: "/examine" },
      { label: "maintenance", href: "/maintenance" },
      { label: "calendars", href: "/calendars" },
      { label: "announcements", href: "/announcements" },
      { label: "call request", href: "/inquires" },
      { label: "visitors request", href: "/visitors" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "property request", href: "/property-request" },
      { label: "deposits request", href: "/deposits" },
    ],
  },
  {
    type: "chart",
    label: "unit mgmt",
    href: "/staff/listing",
    content: [
      { label: "Listing", href: "/units" },
      { label: "statistics", href: "/statistics" },
      // { label: "Property Draft/Request", href: "/property" },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/community",
    content: [
      { label: "team chat", href: "/team-chat" },
      { label: "agent forum", href: "/agent-forum" },
      { label: "agent request", href: "/agent-request" },
    ],
  },

  { type: "settings", label: "settings", href: "/staff/settings" },
];

export const user_nav_items: NavItemsProps = [
  {
    type: "buildings",
    label: "dashboard",
    href: "/user/dashboard",
  },
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord & landlady", href: "/user/management/landlord" },
      { label: "tenants", href: "/user/management/tenants" },
      { label: "occupants", href: "/user/management/occupants" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "complaints", href: "/user/tasks/complaints" },
      { label: "inspections", href: "/user/tasks/inspections" },
      { label: "examine", href: "/user/tasks/examine" },
      { label: "maintenance", href: "/user/tasks/maintenance" },
      { label: "calendars", href: "/user/tasks/calendars" },
      { label: "announcements", href: "/user/tasks/announcements" },
      { label: "call request", href: "/user/tasks/inquires" },
      { label: "visitors request", href: "/user/tasks/visitors" },
      { label: "property request", href: "/user/tasks/property-request" },
      { label: "deposits request", href: "/user/tasks/deposits" },
    ],
  },
  {
    type: "chart",
    label: "listing",
    content: [
      { label: "units", href: "/user/listing/units" },
      { label: "statistics", href: "/user/listing/statistics" },
      { label: "Property Draft/Request", href: "/user/listing/property" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      { label: "invoice", href: "/user/accounting/invoice" },
      { label: "receipts", href: "/user/accounting/receipts" },
      { label: "expenses", href: "/user/accounting/expenses" },
      { label: "disbursement", href: "/user/accounting/disbursement" },
      // { label: "statement", href: "/user/accounting/statement" },
      { label: "VAT", href: "/user/accounting/vat" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    content: [
      { label: "tenants / occupants", href: "/user/reports/tenants" },
      { label: "landlord / landlady", href: "/user/reports/landlord" },
      { label: "properties", href: "/user/reports/properties" },
      { label: "units", href: "/user/reports/units" },
      { label: "rent roll", href: "/user/reports/rent" },
      { label: "listings", href: "/user/reports/listings" },
      { label: "email", href: "/user/reports/email" },
      { label: "SMS", href: "/user/reports/sms" },
      { label: "tracking", href: "/user/reports/tracking" },
      { label: "call request", href: "/user/reports/call" },
      { label: "visitors request", href: "/user/reports/visitors" },
      { label: "undo", href: "/user/reports/undo" },
      { label: "vehicles record", href: "/user/reports/vehicles-record" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/user/wallet" },
  {
    type: "task",
    label: "applications",
    href: "/user/applications",
  },
  {
    type: "folder",
    label: "documents",
    href: "/user/documents",
  },
  { type: "settings", label: "settings", href: "/user/settings" },
];
