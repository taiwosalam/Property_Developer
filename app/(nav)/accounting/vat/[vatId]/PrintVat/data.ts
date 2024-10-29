export const printVatTableFields = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "VAT Paid", accessor: "vat_paid" },
  { id: "4", label: "Details", accessor: "details" },
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "Due Date", accessor: "due_date" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    payment_date: "12/12/2034",
    vat_paid: "₦100,000",
    details: "Document Fee",
    start_date: "12/12/2034",
    due_date: "12/12/2034",
  }));
};

export const printVatTableData = generateTableData(3);
