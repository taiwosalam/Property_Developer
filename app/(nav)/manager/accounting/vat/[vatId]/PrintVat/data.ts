import { formatFee } from "@/app/(nav)/management/rent-unit/data";
import { Currency } from "@/utils/number-formatter";
import dayjs from "dayjs";

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

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Cancelled";

interface VatPreviewData {
  id: number;
  property_id: number;
  property_name: string;
  payer_name: string;
  account_officer: string;
  account_officer_title: string | null;
  signature: string | null;
  unit_id: number;
  unit_name: string;
  caution_fee: string;
  agency_fee: string;
  inspection_fee: string;
  total_package: string;
  details: string;
  amount: string;
  payment_status: PaymentStatus;
  date: string;
  currency?: Currency;
}

export interface VatPreviewResponse {
  status: string;
  message: string;
  data: VatPreviewData;
}

export interface TransformedVatData {
  keyValueData: {
    "VAT ID": string;
    "Payer name": string;
    "Payment status": PaymentStatus;
    "date and time": string;
    description: string;
  };
  tableData: Array<{
    id: string;
    payment_date: string;
    details: string;
    total_package: string;
    agency_fee: string;
    vat_amount: string;
  }>;
}

// Transform function
export const transformVatData = (
  response: VatPreviewResponse | null
): TransformedVatData => {
  if (!response?.data) {
    return {
      keyValueData: {
        "VAT ID": "---",
        "Payer name": "---",
        "Payment status": "Pending",
        "date and time": "---",
        description: "---",
      },
      tableData: [],
    };
  }

  const { data } = response;
  // Format monetary values with currency symbol
  // const formatCurrency = (value: string) => {
  //   return `₦${parseFloat(value).toLocaleString("en-NG", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   })}`;
  // };

  // Key-value data for KeyValueList
  const keyValueData = {
    "VAT ID": data.id.toString(),
    "Payer name": data.payer_name || "--- ---",
    "Payment status": data.payment_status,
    "date and time": dayjs(data.date).format("MMM D, YYYY, h:mm A"),
    description: data.details,
  };

  // Table data (single row derived from data)
  const tableData = [
    {
      id: data.id.toString(),
      payment_date: dayjs(data.date).format("MM/DD/YYYY"),
      details: data.details,
      total_package:
        formatFee(data.total_package, data.currency || "naira") || "",
      agency_fee: formatFee(data.agency_fee, data.currency || "naira") || "",
      vat_amount: formatFee(data.amount, data.currency || "naira") || "",
    },
  ];

  return {
    keyValueData,
    tableData: tableData,
  };
};
