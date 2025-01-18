import type { Field } from "@/components/Table/types";

export const reportsCallsFilterOptionsWithDropdown = [
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

export const callRequestTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Bracnh",
    accessor: "branch",
  },
  { id: "3", label: "Property", accessor: "property_name" },
  {
    id: "5",
    label: "Requester",
    accessor: "requester",
  },
  { id: "7", label: "Request Date & Time", accessor: "request_date_time" },
  { id: "7", label: "Resolve Date & Time", accessor: "resolve_date_time" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: "123456789",
    branch: "Akinyele Branch",
    property_name: "Property Name",
    requester: "Ajayi David",
    request_date_time: "12/02/2024 - 03:30am",
    resolve_date_time: "12/02/2024 - 03:30am",
  }));
};

export const CallRequestTableData = generateTableData(10);
