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
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Properties",
    accessor: "properties",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  { id: "4", label: "Branch Manager", accessor: "branch_manager" },
  { id: "5", label: "Date", accessor: "date" },
];
