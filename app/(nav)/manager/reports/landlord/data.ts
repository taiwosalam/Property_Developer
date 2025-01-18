import type { Field } from "@/components/Table/types";

export const reportsLandlordsFilterOptionsWithDropdown = [
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

export const landlordsReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Property",
    accessor: "property",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  { id: "5", label: "Account Officer", accessor: "account_officer" },
  { id: "6", label: "Date Created", accessor: "date_created" },
  { id: "7", label: "Landlord / Landlady", accessor: "landlord" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: (index + 1).toString(),
    property: `Property ${index + 1}`,
    branch: `Branch ${index + 1}`,
    account_officer: `Account Officer ${index + 1}`,
    date_created: `6/10/2024`,
    landlord: `John Doe`,
  }));
};

export const landlordsReportTableData = generateTableData(10);
