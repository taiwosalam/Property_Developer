import { Currency } from "@/utils/number-formatter";

export interface InvoiceData {
  id: number;
  invoice_id: string;
  property_id: number;
  property_name: string;
  client_name: string;
  account_officer: string | null;
  unit_id: number;
  unit_name: string;
  annual_fee: string;
  service_charge: string;
  caution_fee: string;
  agency_fee: string;
  inspection_fee: string;
  total_package: string;
  details: string | null;
  total_amount: string;
  invoice_date: string;
  is_auto: boolean | string;
  status: string;
  currency: Currency;
  auto_generate?: string;
  type?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  company_owed?: string;
  tenant_owed?: string;
  payment_status_desc?: string;
  payment_status_amount?: string | number;
}

export interface InvoiceResponse {
  status: string;
  message: string;
  data: InvoiceData;
}

// This is the shape our page expects
export interface InvoicePageData {
  invoice_id: string;
  property_name: string;
  client_name: string;
  account_officer: string;
  unit_id: string;
  unit_name: string;
  annual_fee: string | number;
  service_charge: string | number;
  caution_fee: string | number;
  agency_fee: string | number;
  legal_fee?: string | number;
  inspection_fee: string | number;
  total_package: string | number;  
  details: string;
  total_amount: string | number;
  invoice_date: string;
  is_auto: boolean;
  status: string;
  currency?: Currency;
  auto_generate?: string;
  invoice_type?: string;
  branchBankDetails?: BranchBankDetailsObj;
  company_owed?: number;
  tenant_owed?: number;
  payment_status_desc?: string;
  payment_status_amount?: string | number;
}


export interface BranchBankDetailsObj {
  bank_name: string;
  account_number: string;
  account_name: string;
}