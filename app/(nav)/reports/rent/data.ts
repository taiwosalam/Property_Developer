import type { Field } from "@/components/Table/types";

export const reportsRentFilterOptionsWithDropdown = [
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
export const rentReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Unit ID", accessor: "unit_id" },
  {
    id: "2",
    label: "Property Name",
    accessor: "property_name",
  },
  { id: "3", label: "Tenant / Occupant", accessor: "tenant_name" },
  {
    id: "5",
    label: "Start Date",
    accessor: "start_date",
  },
  { id: "6", label: "End Date", accessor: "end_date" },
  { id: "7", label: "Status", accessor: "status" },
  { id: "8", label: "First Deposit", accessor: "first_deposit" },
];
