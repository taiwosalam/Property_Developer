import { Field } from "@/components/Table/types";

export const SponsorFields: Field[] = [
  {
    id: "0",
    label: "Unit ID",
    accessor: "unit_id",
  },
  {
    id: "1",
    label: "Property Name",
    accessor: "property_name",
  },
  {
    id: "2",
    label: "Unit Name",
    accessor: "unit_name",
  },
  {
    id: "5",
    label: "Status",
    accessor: "status",
  },
  {
    id: "6",
    label: "Total Package",
    accessor: "annual_rent",
  },
  {
    id: "3",
    label: "Date",
    accessor: "date",
  },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    unit_id: "12345678990",
    property_name: "Alabata Road 3 Room 7",
    unit_name: "Room 04",
    unit_description: "Bodija Branch",
    status: "vacant",
    annual_rent: "₦13,600,000",
    date: "12/02/2024",
  }));
};

export const sponsorUnitsData = generateTableData(10);
