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
  {
    id: "1",
    label: "Name",
    accessor: "name",
  },
  {
    id: "2",
    label: "Date",
    accessor: "date",
  },

  { id: "3", label: "Project Type", accessor: "project_type" },
  { id: "4", label: "Budget", accessor: "budget" },
];
