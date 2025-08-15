export interface User {
    id: number;
    encodedId: string;
    name: string;
    email: string;
    phone: string | null;
    username: string | null;
    referrer_code: string | null;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    username_updated_at: string | null;
    is_active: number;
    is_company_owner: number;
    tier_id: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    provider_id: string | null;
    provider_name: string | null;
  }
  
  export interface Staff {
    id: number;
    user_id: number;
    company_id: number;
    branch_id: number;
    is_active: number;
    title: string;
    estate_title: string;
    staff_role: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
  }
  
  export interface StaffListResponse {
    status: string;
    message: string;
    data: Staff[];
  }
  






  export interface ExpenseApiItem {
    id: number;
    property: string;
    description: string;
    amount: string;
    payment: string;
    balance: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ExpenseStatsApi {
    total_amount: string;
    total_deduct: string;
    total_balance: string;
    percentage_change_amount: number;
    percentage_change_deduct: number;
    percentage_change_balance: number;
  }
  
  export interface ExpensesApiResponse {
    status: string;
    message: string;
    data: {
      expenses: ExpenseApiItem[];
      statistic: ExpenseStatsApi;
    };
  }
  export interface Expense {
    id: number;
    picture: string; // fallback if no picture is provided
    date: string;
    name: string;
    description: string;
    amount?: number | string;
    payment?: number | string;
    balance?: number | string;
  }
  
  export interface ExpenseStats {
    total_amount?: number | string;
    total_deduct?: number | string;
    total_balance?: number | string;
    percentage_change_amount: number;
    percentage_change_deduct: number;
    percentage_change_balance: number;
  }
  
  export interface TransformedExpensesData {
    expenses: Expense[];
    stats: ExpenseStats;
  }
  