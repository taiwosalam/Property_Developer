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
  { id: "1", label: "Request ID", accessor: "request_id" },
  {
    id: "2",
    label: "Staff Name",
    accessor: "staff_name",
  },
  { id: "3", label: "Categories", accessor: "categories" },
  { id: "4", label: "Units", accessor: "units" },
  { id: "5", label: "Quantity", accessor: "quantity" },
  { id: "6", label: "Amount", accessor: "amount" },
  { id: "7", label: "Status", accessor: "status" },
];
