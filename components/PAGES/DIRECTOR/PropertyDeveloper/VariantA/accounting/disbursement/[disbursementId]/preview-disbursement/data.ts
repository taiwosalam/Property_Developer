
export const disbursementTablePreviewFields = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Date", accessor: "date" },
  { id: "3", label: "Investor/Referrals", accessor: "investors" },
  {
    id: "4",
    label: "Payment ID",
    accessor: "payment_id",
  },
  { id: "5", label: "Amount", accessor: "amount" },
  { id: "6", label: "Description", accessor: "description" },
  { id: "7", label: "Mode", accessor: "mode" },
  { id: "8", accessor: "action" },
];

const generateDisbursementTableData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    date: "02/03/2024",
    picture: "/empty/SampleLandlord.jpeg",
    investors: `Investor  ${index + 1}`,
    payment_id: `PAY-${index + 1}`,
    amount: `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`,
    description: "Rent for Moniya house",
    mode: index % 2 === 0 ? "Bank Transfer" : "Wallet",
  }));
};

export const disbursementTablePreviewData = generateDisbursementTableData(4);