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
  { id: "1", label: "Unit ID", accessor: "unit_id" },

  { id: "2", label: "Property Name", accessor: "property_name" },
  {
    id: "3",
    label: "Clients",
    accessor: "clients",
  },
  { id: "4", label: "Start Date", accessor: "start_date" },
  { id: "5", label: "End Date", accessor: "end_date" },
  { id: "6", label: "Status", accessor: "status" },
  { id: "7", label: "Annual Rent", accessor: "annual_rent" },
];
