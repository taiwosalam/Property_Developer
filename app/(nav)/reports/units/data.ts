import type { Field } from "@/components/Table/types";

export const reportsUnitsFilterOptionsWithDropdown = [
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

export const unitsReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Unit ID", accessor: "unit_id" },
  {
    id: "2",
    label: "Property Name",
    accessor: "property_name",
  },
  { id: "3", label: "Unit Name", accessor: "unit_name" },
  {
    id: "5",
    label: "Unit Description",
    accessor: "unit_description",
  },
  { id: "6", label: "status", accessor: "status" },
  { id: "7", label: "Annual Rent", accessor: "annual_rent" },
];
