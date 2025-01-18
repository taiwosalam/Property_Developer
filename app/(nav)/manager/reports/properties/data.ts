import type { Field } from "@/components/Table/types";
export const reportsPropertiessFilterOptions = [
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
export const propertiesReportTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Property",
    accessor: "property",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "5",
    label: "Account Officer",
    accessor: "account_officer",
    cellStyle: { textTransform: "uppercase" },
  },
  { id: "6", label: "landlord / landlady", accessor: "landlord" },
  { id: "7", label: "Date Created", accessor: "date_created" },
];
