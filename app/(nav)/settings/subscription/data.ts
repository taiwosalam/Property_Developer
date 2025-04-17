// Types
import type { SubscriptionTableType } from "./types";

export const current_subscriptions: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "Subscription Type",
      accessor: "subscription_type",
    },
    {
      id: "1",
      label: "Duration",
      accessor: "duration",
    },
    {
      id: "2",
      label: "Quantity",
      accessor: "quantity",
    },
    {
      id: "3",
      label: "Price",
      accessor: "price",
    },
    {
      id: "4",
      label: "Start Date",
      accessor: "start_date",
    },
    {
      id: "5",
      label: "Due Date",
      accessor: "due_date",
    },
    {
      id: "6",
      label: "Status",
      accessor: "status",
    },
  ],
  data: Array(5)
    .fill(null)
    .map((_, idx) => ({
      id: `${idx + 1}`,
      subscription_type: "Personalized Domain",
      duration: "1 month",
      quantity: "1",
      price: "₦1,000",
      start_date: "12/12/12",
      due_date: "12/12/12",
      status: "Active",
    })),
};

export const personalized_domain: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "URL",
      accessor: "url",
    },
    {
      id: "1",
      label: "Status",
      accessor: "status",
    },
    {
      id: "2",
      label: "HTTP",
      accessor: "http",
    },
    {
      id: "3",
      label: "Start Date",
      accessor: "start_date",
    },
    {
      id: "4",
      label: "Due Date",
      accessor: "due_date",
    },
    {
      id: "5",
      // accessor: "more",
      accessor: "action",
    },
  ],
  data: [
    {
      url: "yourdomainname.com",
      status: "Inactive (Checking DNS)",
      http: "Not Secured",
      start_date: "12/02/2024",
      due_date: "11/02/2025",
    },
  ],
};

export const added_units: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "Unit ID",
      accessor: "unit_id",
    },
    {
      id: "1",
      label: "Property Name",
      accessor: "property_name",
    },
    {
      id: "2",
      label: "Unit Name",
      accessor: "unit_name",
    },
    {
      id: "5",
      label: "Status",
      accessor: "status",
    },
    {
      id: "6",
      label: "Total Package",
      accessor: "annual_rent",
    },
    {
      id: "3",
      label: "Date",
      accessor: "date",
    },
  ],
  data: [
    {
      unit_id: "12345678990",
      property_name: "Alabata Road 3 Room 7",
      unit_name: "Room 04",
      unit_description: "Bodija Branch",
      status: "vacant",
      annual_rent: "₦13,600,000",
      date: "12/02/2024",
    },
  ],
};
