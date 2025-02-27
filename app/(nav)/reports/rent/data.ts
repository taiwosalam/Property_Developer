import type { Field } from "@/components/Table/types";
import { RentListResponse, RentReportData } from "./types";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
    accessor: "rent_start_date",
  },
  { id: "6", label: "End Date", accessor: "rent_end_date" },
  { id: "7", label: "Status", accessor: "status" },
  { id: "8", label: "Caution Deposit", accessor: "caution_deposit" },
];

const formatDate = (timeStamp: string): string => {
  if (!timeStamp) return "__ __";
  return dayjs.utc(timeStamp.split(".")[0]).format("DD/MM/YYYY");
};

export const transformRentData = (data: RentListResponse): RentReportData => {
  return {
    total_rents: data.data.total_rents,
    current_month_rents: data.data.current_month_rents,
    rents: data.data.rents.map((rent) => ({
      unit_id: rent.unit_id || 0,
      property_name: rent.property_name === "N/A" ? "__ __" : rent.property_name,
      tenant_name: rent.tenant_name || "__ __",
      rent_start_date: formatDate(rent.rent_start_date),
      rent_end_date: formatDate(rent.rent_start_date),
      status: rent.status || "__ __",
      caution_deposit: rent.caution_deposit || 0,
    })),
  };
};
