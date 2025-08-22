import type { Field } from "@/components/Table/types";

export const accountingReceiptOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const receiptTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "Payment ID", accessor: "payment_id" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: "350px",
    },
  },
  { id: "5", label: "Amount", accessor: "amount" },
  { id: "6", label: "Date", accessor: "date" },
];

export const receiptTableData = () => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    picture: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    payment_id: `PAY-${index + 1}`,
    details: "Rent cost: Start date: Sept 22, 2023 - Expiry date:",
    amount: getRandomValue(),
    date: "02/03/2024",
  }));
};
