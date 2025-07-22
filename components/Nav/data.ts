// Types
import type { NavItemsProps } from "./types";
// import api from "@/services/api";
// import { useAuthStore } from "@/store/auth-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import { SVGType } from "../SVG/types";

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
      { label: "staff & branches", href: "/staff-branch" },
      { label: "landlord & landlady", href: "/landlord" },
      { label: "tenants & occupants", href: "/tenants" },

      { label: "inventory", href: "/inventory" },
      { label: "properties", href: "/properties" },
      { label: "rent & mgmt", href: "/rent-unit" },

      { label: "vehicles record", href: "/vehicles-record" },
      { label: "service providers", href: "/service-providers" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "Applications", href: "/applications" },
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
      { label: "undo / trash", href: "/undo" },
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
      { label: "VAT", href: "/vat" },
      // { label: "receipts", href: "/receipts" },
      { label: "expenses", href: "/expenses" },
      { label: "disbursement", href: "/disbursement" },
      // { label: "statement", href: "/statement" },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/applications",
    content: [
      { label: "team chat", href: "/team-chat" },
      { label: "agent forum", href: "/agent-forum" },
      { label: "agent request", href: "/agent-request" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    content: [
      { label: "tenants / occupants", href: "/tenants" },
      { label: "landlord / landlady", href: "/landlord" },
      { label: "properties", href: "/properties" },
      { label: "units / mgmt", href: "/units" },
      { label: "rent roll", href: "/rent" },
      // { label: "listings", href: "/listings" },
      { label: "email", href: "/email" },
      { label: "SMS", href: "/sms" },
      { label: "tracking", href: "/tracking" },
      { label: "call request", href: "/call" },
      { label: "visitors request", href: "/visitors" },
      { label: "vehicles record", href: "/vehicles-record" },
      { label: "calendar", href: "/calendar-event" },
      { label: "subscription history", href: "/subscription-history" },
      { label: "add-on sponsor", href: "/adds-on-sponsor" },
      { label: "add-on sms", href: "/adds-on-sms" },
      { label: "add-on campaign", href: "/adds-on-campaign" },
      { label: "add-on feature", href: "/adds-on-feature" },
      //{ label: "add-on domain", href: "/adds-on-domain" },
    ],
  },
  { type: "empty_wallet", label: "wallet", href: "/wallet" },
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
      { label: "branch Staff", href: "/manager/management/branch-staff" },
      { label: "inventory", href: "/manager/management/inventory" },
      { label: "properties", href: "/manager/management/properties" },
      { label: "rent & mgmt", href: "/manager/management/rent-unit" },
      {
        label: "service providers",
        href: "/manager/management/service-providers",
      },
      { label: "vehicles record", href: "/manager/management/vehicles-record" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "applications", href: "/manager/tasks/applications" },
      { label: "complaints", href: "/manager/tasks/complaints" },
      { label: "inspections", href: "/manager/tasks/inspections" },
      { label: "examine", href: "/manager/tasks/examine" },
      { label: "maintenance", href: "/manager/tasks/maintenance" },
      { label: "calendars", href: "/manager/tasks/calendars" },
      { label: "announcements", href: "/manager/tasks/announcements" },
      { label: "call request", href: "/manager/tasks/inquires" },
      { label: "visitors request", href: "/manager/tasks/visitors" },
      { label: "property request", href: "/manager/tasks/property-request" },
      { label: "deposits request", href: "/manager/tasks/deposits" },
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
      // { label: "receipts", href: "/manager/accounting/receipts" },
      { label: "expenses", href: "/manager/accounting/expenses" },
      { label: "disbursement", href: "/manager/accounting/disbursement" },
      // { label: "statement", href: "/manager/accounting/statement" },
      { label: "VAT", href: "/manager/accounting/vat" },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/applications",
    content: [
      { label: "team chat", href: "/community/team-chat" },
      { label: "agent forum", href: "/community/agent-forum" },
      { label: "agent request", href: "/community/agent-request" },
    ],
  },
  {
    type: "status_up",
    label: "reports",
    content: [
      { label: "tenants / occupants", href: "/manager/reports/tenants" },
      { label: "landlord / landlady", href: "/manager/reports/landlord" },
      { label: "properties", href: "/manager/reports/properties" },
      { label: "units / Mgmt", href: "/manager/reports/units" },
      { label: "rent roll", href: "/manager/reports/rent" },
      // { label: "listings", href: "/manager/reports/listings" },
      { label: "email", href: "/manager/reports/email" },
      { label: "SMS", href: "/manager/reports/sms" },
      { label: "tracking", href: "/manager/reports/tracking" },
      { label: "call request", href: "/manager/reports/call" },
      { label: "visitors request", href: "/manager/reports/visitors" },
      { label: "vehicles record", href: "/manager/reports/vehicles-record" },
      { label: "calendar", href: "/manager/reports/calendar-event" },
      // { label: "subscription history", href: "/manager/reports/subscription-history" },
      // { label: "add-on sponsor", href: "/manager/reports/adds-on-sponsor" },
      // { label: "add-on sms", href: "/manager/reports/adds-on-sms" },
      // { label: "add-on campaign", href: "/manager/reports/adds-on-campaign" },
      // { label: "add-on feature", href: "/manager/reports/adds-on-feature" }
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
      { label: "Other Staff", href: "/accountant/management/staff-branch" },
      { label: "inventory", href: "/accountant/management/inventory" },
      { label: "properties", href: "/accountant/management/properties" },
      {
        label: "vehicles record",
        href: "/accountant/management/vehicles-record",
      },
      {
        label: "service providers",
        href: "/accountant/management/service-providers",
      },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/applications",
    content: [
      { label: "team chat", href: "/community/team-chat" },
      { label: "agent forum", href: "/community/agent-forum" },
      { label: "agent request", href: "/community/agent-request" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "complaints", href: "/accountant/tasks/complaints" },
      { label: "inspections", href: "/accountant/tasks/inspections" },
      { label: "examine", href: "/accountant/tasks/examine" },
      { label: "maintenance", href: "/accountant/tasks/maintenance" },
      { label: "calendars", href: "/accountant/tasks/calendars" },
      { label: "announcements", href: "/accountant/tasks/announcements" },
      { label: "call request", href: "/accountant/tasks/inquires" },
      { label: "visitors request", href: "/accountant/tasks/visitors" },
      { label: "property request", href: "/accountant/tasks/property-request" },
      { label: "deposits request", href: "/accountant/tasks/deposits" },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      { label: "invoice", href: "/accountant/accounting/invoice" },
      { label: "receipts", href: "/accountant/accounting/receipts" },
      { label: "expenses", href: "/accountant/accounting/expenses" },
      { label: "disbursement", href: "/accountant/accounting/disbursement" },
      // { label: "statement", href: "/accountant/accounting/statement" },
    ],
  },
  {
    type: "task",
    label: "applications",
    href: "/accountant/applications",
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
      { label: "Other Staff", href: "/staff/management/staff-branch" },
      {
        label: "vehicles record",
        href: "/staff/management/vehicles-record",
      },
      {
        label: "service providers",
        href: "/staff/management/service-providers",
      },
    ],
  },
  {
    type: "task",
    label: "community",
    href: "/community",
    content: [
      { label: "team chat", href: "/community/team-chat" },
      { label: "agent forum", href: "/community/agent-forum" },
      { label: "agent request", href: "/community/agent-request" },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "complaints", href: "/staff/tasks/complaints" },
      { label: "inspections", href: "/staff/tasks/inspections" },
      { label: "examine", href: "/staff/tasks/examine" },
      { label: "maintenance", href: "/staff/tasks/maintenance" },
      { label: "calendars", href: "/staff/tasks/calendars" },
      { label: "announcements", href: "/staff/tasks/announcements" },
      { label: "call request", href: "/staff/tasks/inquires" },
      { label: "visitors request", href: "/staff/tasks/visitors" },
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

export const tabs: {
  icon: SVGType;
  label: string;
}[] = [
  {
    icon: "people",
    label: "management",
  },
  {
    icon: "briefcase_timer",
    label: "task",
  },
  {
    icon: "chart",
    label: "listing",
  },
  {
    icon: "menu_board",
    label: "accounting",
  },
  {
    icon: "status_up",
    label: "reports",
  },
  {
    icon: "empty_wallet",
    label: "wallet",
  },
  {
    icon: "task",
    label: "community",
  },
  {
    icon: "folder",
    label: "documents",
  },
];

export const accountant_search_tabs: {
  icon: SVGType;
  label: string;
}[] = [
  {
    icon: "people",
    label: "managememt",
  },
  {
    icon: "briefcase_timer",
    label: "task",
  },
  {
    icon: "menu_board",
    label: "accounting",
  },
  {
    icon: "task",
    label: "applications",
  },
];

export const staff_search_tabs: {
  icon: SVGType;
  label: string;
}[] = [
  {
    icon: "people",
    label: "managememt",
  },
  {
    icon: "briefcase_timer",
    label: "task",
  },
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
      id: number;
      userid: string;
      name: string | null;
      user_online_status: "online" | "offline" | null;
      email: string | null;
      unread_messages_count: number;
      unread_notifications_count: number;
      is_owner: boolean;
    };
    company?: {
      company_id: string;
      company_name: string;
      company_logo: string;
      company_status: string;
      reject_reason: string;
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
      id: number;
      picture: string;
    };
    company_wallet: any;
    profile: {
      picture: string | null;
      title: string;
    };
    branch: {
      branch_id: number | null;
      branch_name: string | null;
      picture: string | null;
      branch_desc: string | null;
      branch_address: string | null;
      state: string | null;
      local_government: string | null;
      city: string | null;
    };
    requestDemos: any[];
    isSubscriptionExpired: boolean;
    currentPlan: string;
    currentExpiryDate: string;
  };
}

export const truncateName = (
  name: string | undefined | null,
  maxLength: number = 10
): string => {
  if (!name) return "User"; // Fallback for undefined, null, or empty
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};
