import type { Field } from "@/components/Table/types";

export const reportsUndoFilterOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const undoRequestTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Event Deleted", accessor: "event_deleted" },
  {
    id: "2",
    label: "Category",
    accessor: "category",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "5",
    label: "Deleted By",
    accessor: "deleted_by",
  },
  { id: "6", label: "Date Deleted", accessor: "date_deleted" },
  { id: "7", label: "Time", accessor: "time" },
];
