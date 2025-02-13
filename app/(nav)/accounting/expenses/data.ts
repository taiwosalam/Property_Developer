export const accountingExpensesOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "account officer",
    value: [
      { label: "account officer 1", value: "account officer1" },
      { label: "account officer 2", value: "account officer2" },
      { label: "account officer 3", value: "account officer3" },
    ],
  },
];

export const expenseTableFields = [
  // { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Date", accessor: "date" },
  { id: "3", label: "Property Name", accessor: "name" },
  {
    id: "4",
    label: "Description",
    accessor: "description",
  },
  { id: "5", label: "Amount", accessor: "amount" },
  { id: "6", label: "Payment", accessor: "payment" },
  { id: "7", label: "Balance", accessor: "balance" },
  { id: "8", accessor: "action" },
];

export const expenseTableData = () => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const descriptions = [
    "Water Plumbing",
    "Electricity",
    "Roof leakage",
    "Maintenance",
  ];
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    picture: "/empty/SampleLandlord.jpeg",
    date: "02/03/2024",
    name: names[index % names.length],
    description: descriptions[index % descriptions.length],
    amount: getRandomValue(),
    payment: getRandomValue(),
    balance: index % 2 === 0 ? getRandomValue() : null,
  }));
};
