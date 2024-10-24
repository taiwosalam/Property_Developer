import type { Field } from "@/components/Table/table";

export const fields: Field[] = [
  { id: "1", accessor: "picture" },
  {
    id: "2",
    label: "Name",
    accessor: "name",
  },
  { id: "3", label: "Payment ID", accessor: "payment_id" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
  },
  { id: "5", label: "Date Deleted", accessor: "date_deleted" },
  { id: "7", label: "Time", accessor: "time" },
  { id: "8", accessor: "action" },
];
