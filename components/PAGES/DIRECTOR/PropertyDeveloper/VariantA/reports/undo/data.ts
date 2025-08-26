import { Field } from "@/components/Table/types";

export const reportsClientFilterOptionsWithDropdown = [
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
];

export const clientReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Event Deleted", accessor: "event_deleted" },

  { id: "2", label: "Category", accessor: "category" },
  {
    id: "3",
    label: "Branch",
    accessor: "branch",
  },
  { id: "4", label: "Deleted By", accessor: "deleted_by" },
  { id: "5", label: "Date Deleted", accessor: "date_deleted" },
  { id: "6", label: "Time", accessor: "time" },
  { id: "7", label: "", accessor: "action" },
];
