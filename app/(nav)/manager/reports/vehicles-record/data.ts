import type { Field } from "@/components/Table/types";

export const reportsVehiclesFilterOptionsWithDropdown = [
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

export const vehicleRecordReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Full Name",
    accessor: "full_name",
  },
  { id: "3", label: "Plate Number", accessor: "plate_number" },
  { id: "4", label: "Record Type", accessor: "record_type" },
  { id: "5", label: "Check In", accessor: "check_in" },
  { id: "6", label: "Check Out", accessor: "check_out" },
  { id: "7", label: "Passenger In", accessor: "passenger_in" },
  { id: "8", label: "Passenger Out", accessor: "passenger_out" },
  { id: "9", label: "Status", accessor: "status" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: (index + 1).toString(),
    full_name: `full_name ${index + 1}`,
    plate_number: `plate_number ${index + 1}`,
    record_type: index % 2 === 0 ? "Guest" : "Visitor",
    check_in: `check_in ${index + 1}`,
    check_out: `check_out ${index + 1}`,
    passenger_in: `${index + 1} People`,
    passenger_out: `${index + 1} People`,
    status: index % 2 === 0 ? "Completed" : "Pending",
  }));
};

export const vehiclesRecordTableData = generateTableData(10);
