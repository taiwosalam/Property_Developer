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
  { id: "1", label: "Client ID", accessor: "client_id" },
  {
    id: "2",
    label: "Name",
    accessor: "name",
  },
  { id: "3", label: "Contact Address", accessor: "contact_address" },
  { id: "4", label: "Telephone", accessor: "telephone" },
  { id: "5", label: "Email", accessor: "email" },
];
