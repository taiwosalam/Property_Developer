import type { Field } from "@/components/Table/types";
import {
  Invoice,
  InvoiceListResponse,
  InvoiceStatistics,
  TransformedInvoiceData,
} from "./types";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number-formatter";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { formatFee } from "../../management/rent-unit/data";
import { DateRange } from "react-day-picker";

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
  { id: "2", label: "Client Name", accessor: "client_name" },
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
  { id: "2", label: "Client Name", accessor: "client_name" },
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
  { id: "5", label: "Status", accessor: "status" },
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

// Helper to clean amount strings by removing currency symbols and commas
const cleanAmount = (amount: string | number | null | undefined): number => {
  if (amount == null) {
    console.log(`Null or undefined amount detected`);
    return 0;
  }
  const strAmount = String(amount);
  // Remove currency symbols (£, ₦, $, commas, and whitespace)
  const cleaned = strAmount.replace(/[£₦$,\s]/g, "");
  const parsed = Number(cleaned);
  if (isNaN(parsed)) {
    console.log(`Failed to parse amount: ${strAmount} -> ${cleaned}`);
    return 0;
  }
  return parsed;
};

// export const transformInvoiceData = (
//   response: InvoiceListResponse
// ): TransformedInvoiceData => {
//   const { statistics, invoices } = response.data;
//   // console.log("rece inveoice", invoices)
//   const transformedInvoices = invoices.map((invoice) => ({
//     ...invoice,
//     status: formatStatus(invoice.status),
//     client_name: invoice.client_name,
//     payment_reason: invoice.reason ?? "",
//     picture: invoice.client_picture,
//     total_amount:
//       formatFee(invoice.total_amount, invoice.currency || "naira") ?? "",
//     badge_color: invoice.client_tier
//       ? tierColorMap[invoice.client_tier as keyof typeof tierColorMap]
//       : undefined,
//     date: dayjs(invoice.invoice_date).format("MMM DD YYYY"),
//     is_auto:
//       invoice.is_auto !== undefined ? convertToBoolean(invoice.is_auto) : false,
//   }));
//   return { statistics, invoices: transformedInvoices };
// };

const convertToBoolean = (value: string | boolean): boolean => {
  if (typeof value === "boolean") {
    return value;
  }
  return value === "true";
};

export const formatStatus = (status: string): string => {
  if (!status) return status; // Return unchanged if empty or falsy
  return status
    .split("_") // Split on underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
    .join(" "); // Join with spaces
};

// Helper to determine otherCurrency based on invoices
// export const getOtherCurrency = (
//   invoices: InvoiceListResponse["data"]["invoices"]
// ) => {
//   const currencies = new Set(
//     invoices
//       .map((invoice) => invoice.currency)
//       .filter(
//         (currency): currency is "dollar" | "pound" =>
//           !!currency && currency !== "naira"
//       )
//   );

//   const hasDollar = currencies.has("dollar");
//   const hasPound = currencies.has("pound");

//   if (hasDollar && hasPound) return "$£"; // Both present
//   if (hasDollar) return "$"; // Only dollar
//   if (hasPound) return "£"; // Only pound
//   return ""; // Neither present
// };

// Filter invoices by date range and currency
const filterInvoices = (
  invoices: InvoiceListResponse["data"]["invoices"],
  dateRange: DateRange | undefined,
  currencyFilter: string | null
): InvoiceListResponse["data"]["invoices"] => {
  if (!dateRange?.from || !dateRange?.to) {
    return currencyFilter
      ? invoices.filter(
          (invoice) => invoice.currency?.toLowerCase() === currencyFilter
        )
      : invoices;
  }

  return invoices.filter((invoice) => {
    const invoiceDate = dayjs(invoice.invoice_date);
    const fromDate = dayjs(dateRange.from).startOf("day");
    const toDate = dayjs(dateRange.to).endOf("day");
    const isValidDate = invoiceDate.isValid();
    const isInRange =
      isValidDate &&
      (invoiceDate.isAfter(fromDate) || invoiceDate.isSame(fromDate)) &&
      (invoiceDate.isBefore(toDate) || invoiceDate.isSame(toDate));
    const matchesCurrency = currencyFilter
      ? invoice.currency?.toLowerCase() === currencyFilter
      : true;
    return isInRange && matchesCurrency;
  });
};


// const calculateStatistics = (
//   invoices: InvoiceListResponse["data"]["invoices"]
// ): InvoiceStatistics => {
//   const initialStats: InvoiceStatistics = {
//     total_receipt_num: 0,
//     total_paid_receipt_num: 0,
//     total_pending_receipt_num: 0,
//     total_receipt: "₦0.00",
//     total_paid_receipt: "₦0.00",
//     total_pending_receipt: "₦0.00",
//     percentage_change_total: 0,
//     percentage_change_paid: 0,
//     percentage_change_pending: 0,
//   };

//   const stats = invoices.reduce((acc, invoice) => {
//     const totalAmount = cleanAmount(invoice.total_amount);
//     const amountPaid = cleanAmount(invoice.amount_paid);
//     const balanceDue = cleanAmount(invoice.balance_due);

//     acc.total_receipt_num += totalAmount;
//     acc.total_paid_receipt_num += amountPaid;
//     acc.total_pending_receipt_num += balanceDue;
//     return acc;
//   }, initialStats);

//   // Format totals
//   stats.total_receipt = formatFee(stats.total_receipt_num, "naira") ?? "₦0.00";
//   stats.total_paid_receipt =
//     formatFee(stats.total_paid_receipt_num, "naira") ?? "₦0.00";
//   stats.total_pending_receipt =
//     formatFee(stats.total_pending_receipt, "naira") ?? "₦0.00";

//   // Calculate percentages
//   stats.percentage_change_paid =
//     stats.total_receipt_num > 0
//       ? Number(
//           Math.min(
//             (stats.total_paid_receipt_num / stats.total_receipt_num) * 100,
//             100
//           ).toFixed(2)
//         )
//       : 0;
//   stats.percentage_change_pending =
//     stats.total_receipt_num > 0
//       ? Number(
//           Math.min(
//             (stats.total_pending_receipt_num / stats.total_receipt_num) * 100,
//             100
//           ).toFixed(2)
//         )
//       : 0;
//   stats.percentage_change_total = 0;

//   return stats;
// };


// Calculate naira statistics
const calculateStatistics = (
  invoices: InvoiceListResponse["data"]["invoices"]
): InvoiceStatistics => {
  const initialStats: InvoiceStatistics = {
    total_receipt_num: 0,
    total_paid_receipt_num: 0,
    total_pending_receipt_num: 0,
    total_receipt: "₦0.00",
    total_paid_receipt: "₦0.00",
    total_pending_receipt: "₦0.00",
    percentage_change_total: 0,
    percentage_change_paid: 0,
    percentage_change_pending: 0,
  };

  const stats = invoices.reduce((acc, invoice) => {
    const totalAmount = cleanAmount(invoice.total_amount);
    const amountPaid = cleanAmount(invoice.amount_paid);
    // Use balance_due for non-pending invoices, but calculate for pending
    const balanceDue =
      invoice.status.toLowerCase() === "pending"
        ? totalAmount - amountPaid
        : cleanAmount(invoice.balance_due);

    acc.total_receipt_num += totalAmount;
    acc.total_paid_receipt_num += amountPaid;
    acc.total_pending_receipt_num += balanceDue;
    return acc;
  }, initialStats);

  // Format totals
  stats.total_receipt = formatFee(stats.total_receipt_num, "naira") ?? "₦0.00";
  stats.total_paid_receipt =
    formatFee(stats.total_paid_receipt_num, "naira") ?? "₦0.00";
  stats.total_pending_receipt =
    formatFee(stats.total_pending_receipt_num, "naira") ?? "₦0.00";

  // Calculate percentages
  stats.percentage_change_paid =
    stats.total_receipt_num > 0
      ? Number(
          Math.min(
            (stats.total_paid_receipt_num / stats.total_receipt_num) * 100,
            100
          ).toFixed(2)
        )
      : 0;
  stats.percentage_change_pending =
    stats.total_receipt_num > 0
      ? Number(
          Math.min(
            (stats.total_pending_receipt_num / stats.total_receipt_num) * 100,
            100
          ).toFixed(2)
        )
      : 0;
  stats.percentage_change_total = 0;

  return stats;
};

// Transform individual invoices for table display
const transformSingleInvoice = (
  invoice: InvoiceListResponse["data"]["invoices"][number]
): TransformedInvoiceData["invoices"][number] => {
  const isValidDate = dayjs(invoice.invoice_date, "YYYY-MM-DD", true).isValid();
  const formattedDate = isValidDate
    ? dayjs(invoice.invoice_date).format("MMM DD YYYY")
    : invoice.invoice_date;

  return {
    ...invoice,
    status: formatStatus(invoice.status),
    client_name: invoice.client_name,
    payment_reason: invoice.reason ?? "",
    picture: invoice.client_picture ?? undefined,
    total_amount:
      formatFee(invoice.total_amount, invoice.currency || "naira") ?? "",
    badge_color: invoice.client_tier
      ? tierColorMap[invoice.client_tier as keyof typeof tierColorMap]
      : undefined,
    date: invoice.invoice_date,
    is_auto:
      invoice.is_auto !== undefined ? convertToBoolean(invoice.is_auto) : false,
  };
};

export const transformInvoiceData = (
  response: InvoiceListResponse,
  dateRange?: DateRange
): TransformedInvoiceData => {
  const { invoices } = response.data;

  // Filter naira invoices for statistics
  const filteredInvoices = filterInvoices(invoices, dateRange, "naira");

  // Calculate statistics
  const statistics = calculateStatistics(filteredInvoices);

  // Transform all invoices for table
  const transformedInvoices = invoices.map(transformSingleInvoice);

  return { statistics, invoices: transformedInvoices };
};

// Calculate currency totals for a specific field
const calculateCurrencyTotals = (
  invoices: InvoiceListResponse["data"]["invoices"],
  field: "total_amount" | "amount_paid" | "balance_due"
): Record<string, number> => {
  return invoices.reduce((acc, invoice) => {
    const currency = invoice.currency?.toLowerCase();
    if (currency !== "pound" && currency !== "dollar") {
      return acc;
    }
    const amountRaw = invoice[field];
    const amount = cleanAmount(amountRaw);

    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += amount;
    return acc;
  }, {} as Record<string, number>);
};

// Format currency totals into a string
const formatCurrencyTotals = (totals: Record<string, number>): string => {
  return Object.entries(totals)
    .filter(([, total]) => total !== 0)
    .map(([currency, total]) => formatFee(total, currency))
    .join(" | ");
};

export const getOtherCurrency = (
  invoices: InvoiceListResponse["data"]["invoices"],
  dateRange?: DateRange,
  field: "total_amount" | "amount_paid" | "balance_due" = "total_amount"
): string => {
  if (invoices.length === 0) {
    return "";
  }

  // Filter invoices by date range
  const filteredInvoices = filterInvoices(invoices, dateRange, null);

  // Calculate totals for pound and dollar
  const currencyTotals = calculateCurrencyTotals(filteredInvoices, field);

  // Format result
  return formatCurrencyTotals(currencyTotals);
};
