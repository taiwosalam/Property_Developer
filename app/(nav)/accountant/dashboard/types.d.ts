export  interface DashboardBranchDataResponse {
  status: string;
  data: {
    property_count: number;
    month_count: number;
    expired_unit: string;
    month_expired_unit: string;
    landlord_count: number;
    month_landlord_count: number;
    tenant_count: number;
    month_tenant_count: number;
    complaint_count: number;
    month_complaint_count: number;
    invoice_count: number;
    month_invoice_count: number;
    invoices: {
      id: number;
      invoice_id: string;
      client_name: string | null;
      client_picture: string | null;
      reason: string;
      total_amount: string;
      invoice_date: string;
    }[];
  };
}


export interface CardData {
  title: string;
  icon: React.ComponentType;
  value: string;
  subValue: string;
  bg: string;
  link: string;
}


export interface TransformedInvoiceData {
  id: number;
  invoice_id: string;
  client_name: JSX.Element | string;
  reason: string;
  total_amount: string;
  invoice_date: string;
}
