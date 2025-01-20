import type { Field } from "@/components/Table/types";

export const accountingStatementOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const statementTableFields: Field[] = [
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
  { id: "5", label: "Credit", accessor: "credit" },
  { id: "6", label: "Debit", accessor: "debit" },
  { id: "7", label: "Date", accessor: "date" },
];

const generateTableData = (numItems: number) => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const getRandomValue = () => {
    return Math.random() > 0.5
      ? `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`
      : null;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    payment_id: `INV-${index + 1}`,
    details:
      "Rent cost: Start date: Sept 22, 2023 - Expiry tomorrow eveing. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    credit: getRandomValue(),
    debit: getRandomValue(),
    mode: index % 2 === 0 ? "Wallet" : "Bank Transfer",
    date: "12/12/2034",
  }));
};

export const statementTableData = generateTableData(15);

export const exportStatementTableFields: Field[] = [
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
      maxWidth: "300px",
    },
  },
  { id: "5", label: "Credit", accessor: "credit" },
  { id: "6", label: "Debit", accessor: "debit" },
  { id: "7", label: "Mode", accessor: "mode" },
  { id: "8", label: "Date", accessor: "date" },
];
