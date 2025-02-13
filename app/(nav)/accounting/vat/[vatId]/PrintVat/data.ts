export const printVatTableFields = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "Details", accessor: "details" },
  { id: "4", label: "Total Package", accessor: "total_package" },
  { id: "5", label: "Agency Fee", accessor: "agency_fee" },
  { id: "6", label: "VAT Amount", accessor: "vat_amount" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    payment_date: "12/12/2034",
    details: "Document Fee",
    total_package: "-- --- --",
    agency_fee: "-- -- --",
    vat_amount: "₦100,000",
  }));
};

export const printVatTableData = generateTableData(1);
