import type { Field } from "@/components/Table/types";

export const statementTableFields: Field[] = [
  { id: "1", accessor: "S/N" },
  {
    id: "2",
    label: "Payment Date",
    accessor: "payment_date",
  },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
  },
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "End Date", accessor: "end_date" },
];

const generateTableData = (numItems: number) => {
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    payment_date: "12/12/2034",
    amount_paid: getRandomValue(),
    details: "Rent Cost: Start date: September 02, 2024.",
    start_date: "12/12/2034",
    end_date: "12/12/2034",
  }));
};

export const statementTableData = generateTableData(10);
