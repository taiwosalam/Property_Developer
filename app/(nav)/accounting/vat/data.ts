import type { Field } from "@/components/Table/types";
export const accountingVatOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "Account Officer1" },
      { label: "Account Officer 2", value: "Account Officer2" },
      { label: "Account Officer 3", value: "Account Officer3" },
    ],
  },
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const vatTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "VAT ID", accessor: "vat_id" },
  {
    id: "4",
    label: "Payment Reason",
    accessor: "payment_reason",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: "350px",
    },
  },
  { id: "5", label: "Total VAT", accessor: "total_vat" },
  { id: "6", label: "Date", accessor: "date" },
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
    vat_id: `VAT-${index + 1}`,
    payment_reason:
      "Rent cost: Start date: Sept 22, 2023 - Expiry tomorrow eveing. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    total_vat: getRandomValue(),
    date: "12/12/2034",
  }));
};

export const vatTableData = generateTableData(15);
