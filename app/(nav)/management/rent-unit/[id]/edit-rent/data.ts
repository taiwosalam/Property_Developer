import type { Field } from "@/components/Table/types";

export const rentRecordsTableFields: Field[] = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
  { id: "4", label: "Details", accessor: "details" },
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "Due Date", accessor: "due_date" },
];

const generateRentRecordsTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: index + 1,
    payment_date: "2024-01-01",
    amount_paid: "₦100,000",
    details: "Rent for January 2024",
    start_date: "2024-01-01",
    due_date: "2024-01-15",
  }));
};

export const rentRecordsTableData = generateRentRecordsTableData(2);

type RentalField = {
  label: string;
  value: string;
};

export const getRentalData = (unit_data: any): RentalField[] => {
  return [
    { label: "Property Title", value: unit_data.property_title },
    { label: "State", value: unit_data.property_state },
    { label: "Local Government", value: unit_data.localGovernment },
    { label: "Full Address", value: unit_data.property_address },
    { label: "Branch", value: unit_data.branchName },
    { label: "Account Officer", value: unit_data.accountOfficer },
    { label: "Landlord", value: unit_data.landlord || "____" },
    { label: "Categories", value: unit_data.categories },
    { label: "Unit ID", value: unit_data.unit_id },
  ];
};


type PropertySetting = {
  label: string;
  value: string;
};

export const getPropertySettingsData = (unit_data: any): PropertySetting[] => {
  return [
    { label: "Agency Fee", value: unit_data.unitAgentFee },
    { label: "Period", value: unit_data.renew_fee_period },
    { label: "Who to Charge", value: unit_data.whoToChargeRenew },
    { label: "Caution Deposit", value: unit_data.caution_deposit },
    { label: "Group Chat", value: unit_data.group_chat },
    { label: "Rent Penalty", value: unit_data.rent_penalty },
  ];
};
