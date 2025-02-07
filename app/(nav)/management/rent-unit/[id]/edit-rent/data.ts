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

