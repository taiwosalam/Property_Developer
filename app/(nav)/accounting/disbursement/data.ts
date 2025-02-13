export const accountingDisbursementOptionsWithDropdown = [
  {
    label: "Landlord/Landlady",
    value: [
      { label: "Landlord/Landlady 1", value: "Landlord/Landlady1" },
      { label: "Landlord/Landlady 2", value: "Landlord/Landlady2" },
      { label: "Landlord/Landlady 3", value: "Landlord/Landlady3" },
    ],
  },
];

export const disbursementTableFields = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Date", accessor: "date" },
  { id: "3", label: "Landlord/Landlady", accessor: "landlord" },
  {
    id: "4",
    label: "Payment ID",
    accessor: "payment_id",
  },
  { id: "5", label: "Amount Disburse", accessor: "amount" },
  { id: "6", label: "Description", accessor: "description" },
  { id: "7", label: "Mode", accessor: "mode" },
  { id: "8", accessor: "action" },
];

const generateDisbursementTableData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    date: "02/03/2024",
    picture: "/empty/SampleLandlord.jpeg",
    landlord: `Landlord ${index + 1}`,
    payment_id: `PAY-${index + 1}`,
    amount: `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`,
    description: "Rent for Moniya house",
    mode: index % 2 === 0 ? "Bank Transfer" : "Wallet",
  }));
};

export const disbursementTableData = generateDisbursementTableData(15);
