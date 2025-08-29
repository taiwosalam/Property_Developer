export const expensePreviewTableFields = [
  // { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Amount", accessor: "amount" },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
];

export const expensePreviewTableData = () => {
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    amount: getRandomValue(),
    amount_paid: getRandomValue(),
  }));
};
