import type { Field } from "@/components/Table/types";

export const reportsEmailFilterOptionsWithDropdown = [
  {
    label: "Tenant / Occupants",
    value: [
      { label: "Tenant 1", value: "tenant1" },
      { label: "Tenant 2", value: "tenant2" },
      { label: "Tenant 3", value: "tenant3" },
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

export const emailTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "User ID", accessor: "user_id" },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "2",
    label: "Client Name",
    accessor: "client_name",
  },
  {
    id: "5",
    label: "Date",
    accessor: "date",
  },
  { id: "8", label: "Time", accessor: "time" },
];
