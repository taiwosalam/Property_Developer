import type { Field } from "@/components/Table/types";
import { Invoice, InvoiceListResponse, InvoiceStatistics, TransformedInvoiceData } from "./types";
import dayjs from "dayjs";


export const accountingInvoiceOptionsWithDropdown = [
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

export const invoiceExportTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Client Name", accessor: "name" },
  { id: "3", label: "Invoice ID", accessor: "invoice_id" },
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
  { id: "5", label: "Total Amount", accessor: "total_amount" },
  { id: "6", label: "Date", accessor: "date" },
];

export const invoiceTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Client Name", accessor: "name" },
  { id: "3", label: "Invoice ID", accessor: "invoice_id" },
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
  { id: "5", label: "Total Amount", accessor: "total_amount" },
  { id: "6", label: "Date", accessor: "date" },
  { id: "7", accessor: "action" },
];

const generateTableData = (numItems: number) => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    invoice_id: `INV-${index + 1}`,
    payment_reason:
      "Rent cost: Start date: Sept 22, 2023 - Expiry tomorrow eveing. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    total_amount: getRandomValue(),
    date: "12/12/2034",
  }));
};

export const invoiceTableData = generateTableData(10);



export const transformInvoiceData = (
  response: InvoiceListResponse
): TransformedInvoiceData => {
  const { statistics, invoices } = response.data;
  // console.log("rece inveoice", invoices)
  const transformedInvoices = invoices.map((invoice) => ({
    ...invoice,
    name: invoice.client_name,
    payment_reason: invoice.reason,
    picture: invoice.client_picture,
    total_amount: `₦${invoice.total_amount}`,
    // total_amount: parseFloat(invoice.total_amount).toFixed(2),
    date: dayjs(invoice.invoice_date).format("MMM DD YYYY"),
  }));
  return { statistics, invoices: transformedInvoices };
};