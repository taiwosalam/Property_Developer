import type { Field } from "@/components/Table/types";

export const reportsVisitorsFilterOptionsWithDropdown = [
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

export const visitorsRequestTableFields: Field[] = [
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
  { id: "6", label: "Visitor", accessor: "visitor" },
  { id: "7", label: "Date", accessor: "date" },
  { id: "8", label: "Check In", accessor: "check_in" },
  { id: "9", label: "Check Out", accessor: "check_out" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: "123456789",
    branch: "Akinyele Branch",
    property_name: "Property Name",
    requester: "Ajayi David",
    visitor: "Ajayi David",
    date: "12/02/2024",
    check_in: "08:30am",
    check_out: "08:30am",
  }));
};

export const VisitorsRequestTableData = generateTableData(10);
