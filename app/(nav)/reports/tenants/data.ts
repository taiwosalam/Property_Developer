import type { Field } from "@/components/Table/types";

export const reportsTenantsFilterOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
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
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];
export const tenantsReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Tenant / Occupant ID", accessor: "id" },
  {
    id: "2",
    label: "Name",
    accessor: "name",
    cellStyle: { textTransform: "uppercase" },
  },
  { id: "3", label: "Gender", accessor: "gender" },
  { id: "4", label: "Contact Address", accessor: "address" },
  { id: "5", label: "Telephone", accessor: "telephone" },
  { id: "6", label: "Status", accessor: "status" },
];
