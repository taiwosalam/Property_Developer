import type { Field } from "@/components/Table/types";
export const reportsSmsFilterOptionsWithDropdown = [
  {
    label: "Tenant/Occupant",
    value: [
      { label: "Tenant/Occupant 1", value: "tenant_occupant1" },
      { label: "Tenant/Occupant 2", value: "tenant_occupant2" },
      { label: "Tenant/Occupant 3", value: "tenant_occupant3" },
    ],
  },
];

export const smsTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "User ID", accessor: "user_id" },
  {
    id: "2",
    label: "Client Name",
    accessor: "client_name",
  },
  { id: "3", label: "Phone Number", accessor: "phone_number" },
  {
    id: "5",
    label: "Date",
    accessor: "date",
  },
  { id: "8", label: "Time", accessor: "time" },
];
