
// Types for the mock data
export interface InvoiceStatistics {
  total_receipt: number;
  percentage_change_total: number;
  total_paid_receipt: number;
  percentage_change_paid: number;
  total_pending_receipt: number;
  percentage_change_pending: number;
}

export interface TransformedInvoice {
  id: string;
  client_name: string;
  payment_reason: string;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  due_date: string;
  created_at: string;
  currency: string;
  is_auto: boolean;
  badge_color?: string;
  property_id: string;
  account_officer_id: string;
}

export interface TransformedInvoiceData {
  statistics: InvoiceStatistics;
  invoices: TransformedInvoice[];
}

export interface Property {
  id: number;
  title: string;
  units: any[];
}

export interface PropertyListResponse {
  data: Property[];
}

export interface AccountOfficer {
  id: number;
  name: string;
}

export interface OtherCurrency {
  currency: string;
  amount: number;
}

export interface OtherCurrencies {
  total: OtherCurrency[];
  paid: OtherCurrency[];
  pending: OtherCurrency[];
}

// Mock Data
export const mockInvoiceStatistics: InvoiceStatistics = {
  total_receipt: 2450000,
  percentage_change_total: 15.2,
  total_paid_receipt: 1850000,
  percentage_change_paid: 8.7,
  total_pending_receipt: 600000,
  percentage_change_pending: -12.3,
};

export const mockInvoices: TransformedInvoice[] = [
  {
    id: "INV-001",
    client_name: "John Smith",
    payment_reason: "Monthly Rent - Apartment 2B",
    total_amount: 150000,
    amount_paid: 150000,
    balance_due: 0,
    status: "Paid",
    due_date: "2024-01-15",
    created_at: "2024-01-01",
    currency: "NGN",
    is_auto: true,
    badge_color: "#22C55E",
    property_id: "1",
    account_officer_id: "1",
  },
  {
    id: "INV-002",
    client_name: "Sarah Johnson",
    payment_reason: "Security Deposit - Studio Unit",
    total_amount: 200000,
    amount_paid: 100000,
    balance_due: 100000,
    status: "Partially Paid",
    due_date: "2024-01-20",
    created_at: "2024-01-05",
    currency: "NGN",
    is_auto: false,
    badge_color: "#F59E0B",
    property_id: "2",
    account_officer_id: "2",
  },
  {
    id: "INV-003",
    client_name: "Michael Brown",
    payment_reason: "Monthly Rent - Office Space 3A",
    total_amount: 300000,
    amount_paid: 0,
    balance_due: 300000,
    status: "Pending",
    due_date: "2024-02-01",
    created_at: "2024-01-15",
    currency: "NGN",
    is_auto: true,
    property_id: "3",
    account_officer_id: "1",
  },
  {
    id: "INV-004",
    client_name: "Emily Davis",
    payment_reason: "Utility Bills - December",
    total_amount: 45000,
    amount_paid: 45000,
    balance_due: 0,
    status: "Paid",
    due_date: "2024-01-10",
    created_at: "2023-12-28",
    currency: "NGN",
    is_auto: false,
    property_id: "1",
    account_officer_id: "3",
  },
  {
    id: "INV-005",
    client_name: "Robert Wilson",
    payment_reason: "Commercial Space Rent",
    total_amount: 500000,
    amount_paid: 0,
    balance_due: 500000,
    status: "Pending",
    due_date: "2024-02-15",
    created_at: "2024-01-20",
    currency: "USD",
    is_auto: true,
    badge_color: "#EF4444",
    property_id: "4",
    account_officer_id: "2",
  },
  {
    id: "INV-006",
    client_name: "Lisa Anderson",
    payment_reason: "Maintenance Fee - Q1",
    total_amount: 75000,
    amount_paid: 0,
    balance_due: 75000,
    status: "Cancel",
    due_date: "2024-01-25",
    created_at: "2024-01-10",
    currency: "NGN",
    is_auto: false,
    property_id: "2",
    account_officer_id: "3",
  },
];

export const mockProperties: Property[] = [
  { id: 1, title: "Sunset Apartments", units: [{ id: 1 }, { id: 2 }] },
  { id: 2, title: "Downtown Office Complex", units: [{ id: 3 }, { id: 4 }] },
  { id: 3, title: "Marina View Condos", units: [{ id: 5 }] },
  { id: 4, title: "Business District Plaza", units: [{ id: 6 }, { id: 7 }, { id: 8 }] },
];

export const mockAccountOfficers: AccountOfficer[] = [
  { id: 1, name: "Alice Cooper" },
  { id: 2, name: "Bob Miller" },
  { id: 3, name: "Carol White" },
];

export const mockOtherCurrencies: OtherCurrencies = {
  total: [
    { currency: "USD", amount: 1200 },
    { currency: "EUR", amount: 800 },
  ],
  paid: [
    { currency: "USD", amount: 900 },
    { currency: "EUR", amount: 600 },
  ],
  pending: [
    { currency: "USD", amount: 300 },
    { currency: "EUR", amount: 200 },
  ],
};

export const mockTransformedInvoiceData: TransformedInvoiceData = {
  statistics: mockInvoiceStatistics,
  invoices: mockInvoices,
};

// Utility function to get other currencies (mocked implementation)
export const getOtherCurrency = (
  invoices: TransformedInvoice[],
  dateRange?: any,
  field?: string
): OtherCurrency[] => {
  // Simple mock implementation
  const usdInvoices = invoices.filter(inv => inv.currency === "USD");
  const totalUSD = usdInvoices.reduce((sum, inv) => {
    switch (field) {
      case "total_amount": return sum + inv.total_amount;
      case "amount_paid": return sum + inv.amount_paid;
      case "balance_due": return sum + inv.balance_due;
      default: return sum + inv.total_amount;
    }
  }, 0);
  
  return totalUSD > 0 ? [{ currency: "USD", amount: totalUSD }] : [];
};

// Transform function for invoice data
export const transformInvoiceData = (data: any): TransformedInvoiceData => {
  return mockTransformedInvoiceData;
};

// Invoice table fields (assuming this is needed)
export const invoiceTableFields = [
  { key: "client_name", label: "Client Name" },
  { key: "payment_reason", label: "Payment Reason" },
  { key: "total_amount", label: "Total Amount" },
  { key: "amount_paid", label: "Amount Paid" },
  { key: "balance_due", label: "Balance Due" },
  { key: "status", label: "Status" },
  { key: "due_date", label: "Due Date" },
];

export const accountingInvoiceOptionsWithDropdown = [
  { label: "All Invoices", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

export const invoiceTableData = mockInvoices;