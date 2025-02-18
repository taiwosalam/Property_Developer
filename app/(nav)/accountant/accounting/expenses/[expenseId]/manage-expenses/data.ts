import dayjs from "dayjs";  


// Raw API response interfaces
export interface ManageExpenseApiResponse {
    status: string;
    data: ManageExpenseData;
    message: string;
}

export interface ManageExpenseData {
    id: number;
    property_id: number;
    unit: string[];
    property: string;
    description: string;
    account_officer: string | null;
    account_officer_updated: string | null;
    total_amount: string;
    total_deducted: string;
    total_balance: number | string;
    added_expenses: AddedExpense[];
    deducted_payments: any;
    created_at: string;
    updated_at: string;
}

export interface AddedExpense {
    amount: string;
    payment_title: string;
}

export interface Payment {
    title: string;
    amount: number;
}

export interface ManageExpensePageData {
    expenseDetails: {
        paymentId: number;
        customerName: string;
        propertyName: string;
        date: string;
        accountOfficer: string;
        unitId: string;
    };
    description: string;
    payments: Payment[];
    stats: {
        totalAmount: number;
        totalDeducted: number;
        totalBalance: number;
    };
}


// Remove HTML tags from a string
export const formatHtmlDescription = (html: string): string =>
    html.replace(/<\/?[^>]+(>|$)/g, "").trim();

// Parse a currency string (removing commas) to a number
export const parseCurrency = (value: string): number =>
    parseFloat(value.replace(/,/g, ""));



export const transformManageExpenseData = (
  apiResponse: ManageExpenseApiResponse
): ManageExpensePageData => {
  const data = apiResponse.data;
  return {
    expenseDetails: {
      paymentId: data.id,
      customerName: data.account_officer || "___",
      propertyName: data.property,
      date: dayjs(data.created_at).format("MMM DD YYYY"),
      accountOfficer: data.account_officer || "N/A",
      unitId: data.unit && data.unit.length > 0 ? data.unit.join(", ") : "",
    },
    description: formatHtmlDescription(data.description),
    payments: data.added_expenses.map((exp) => ({
      title: exp.payment_title,
      amount: parseFloat(exp.amount),
    })),
    stats: {
      totalAmount: parseCurrency(data.total_amount),
      totalDeducted: parseCurrency(data.total_deducted),
      totalBalance:
        typeof data.total_balance === "number"
          ? data.total_balance
          : parseCurrency(data.total_balance as string),
    },
  };
};
