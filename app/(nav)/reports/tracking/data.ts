import type { Field } from "@/components/Table/types";

export const reportsListingsFilterOptionsWithDropdown = [
  {
    label: "Staff",
    value: [
      { label: "Staff 1", value: "account_officer1" },
      { label: "Staff 2", value: "account_officer2" },
      { label: "Staff 3", value: "account_officer3" },
    ],
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
];
export const trackingTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Username", accessor: "username" },
  {
    id: "2",
    label: "Page Visit",
    accessor: "page_visited",
  },
  //{ id: "3", label: "Action Taken", accessor: "action_taken" },
  {
    id: "5",
    label: "IP Address",
    accessor: "ip_address",
  },
  { id: "6", label: "Location", accessor: "location" },
  { id: "7", label: "Date", accessor: "date" },
  { id: "8", label: "Time", accessor: "time" },
];
