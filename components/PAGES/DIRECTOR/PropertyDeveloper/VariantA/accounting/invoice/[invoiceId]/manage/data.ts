import api, { handleAxiosError } from "@/services/api";
import { InvoiceData, InvoicePageData } from "./types";
import { Field } from "@/components/Table/types";

export const generateTableDataManageInvoice = (numItems: number) => {
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
    payment_date: "12/08/2009",
    amount_paid: "₦72,3879",
    details: "Rent cost: Start date: Sept 22, 2023 - Expiry tomorrow evening.",
    vat: "₦72,3879",

    start_date: "12/12/2034",
    due_date: "12/12/2034",
  }));
};

export const invoiceManageTableFields: Field[] = [
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
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
  { id: "5", label: "VAT(7.5%)", accessor: "vat" },
  //{ id: "5", label: "Status", accessor: "status" },
  { id: "6", label: "Start Date", accessor: "start_date" },
  { id: "7", label: "Due Date", accessor: "due_date" },
];

export const transformInvoiceData = (data: InvoiceData): InvoicePageData => {
  return {
    status: data.status || "",
    invoice_id: data.invoice_id || "",
    property_name: data.property_name || "",
    client_name: data.client_name || "",
    account_officer: data.account_officer || "",
    unit_id: data.unit_id ? data.unit_id.toString() : "",
    unit_name: data.unit_name || "",
    annual_fee: parseFloat(data.annual_fee) || "",
    service_charge: parseFloat(data.service_charge) || "",
    caution_fee: parseFloat(data.caution_fee) || "",
    agency_fee: parseFloat(data.agency_fee) || "",
    legal_fee: parseFloat(data.legal_fee) || "",
    vat_amount: parseFloat(data.vat_amount) || "",
    security_fee: parseFloat(data.security_fee) || "",
    other_charge: parseFloat(data.other_charge) || "",
    inspection_fee: parseFloat(data.inspection_fee) || "",
    management_fee: parseFloat(data.management_fee) || "",
    total_package: parseFloat(data.total_package) || "",
    details: data.details || "",
    total_amount: parseFloat(data.total_amount) || "",
    invoice_date: data.invoice_date || "",
    is_auto: data.is_auto === "true" || data.is_auto === true,
    currency: data.currency || "naira",
    auto_generate: data.auto_generate || "",
    invoice_type: data.type || "",
    tenant_owed: parseFloat(String(data?.tenant_owed ?? 0)) || 0,
    company_owed: parseFloat(String(data?.company_owed ?? 0)) || 0,
    branchBankDetails: {
      bank_name: data.bank_name || "",
      account_number: data.account_number || "",
      account_name: data.account_name || "",
    },
    payment_status_desc: data.payment_status_desc ?? "",
    payment_status_amount: data.payment_status_amount ?? "",
  };
};

export const defaultInvoiceData: InvoicePageData = {
  invoice_id: "",
  currency: "naira",
  status: "",
  property_name: "",
  client_name: "",
  account_officer: "",
  unit_id: "",
  unit_name: "",
  annual_fee: "",
  service_charge: "",
  caution_fee: "",
  agency_fee: "",
  inspection_fee: "",
  management_fee: "",
  total_package: "",
  details: "",
  total_amount: "",
  invoice_date: "",
  is_auto: false,
  payment_status_amount: 0,
  security_fee: "",
  other_charge: "",
  vat_amount: "",
  legal_fee: "",
  payment_status_desc: "",
};

export const updateInvoiceStatus = async (id: number, data: any) => {
  try {
    const res = await api.post(`/invoice/${id}`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to Update Invoice Status");
    return false;
  }
};

export const deleteInvoice = async (id: number) => {
  try {
    const res = await api.delete(`/invoice/${id}`);
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to Delete Invoice");
    return false;
  }
};
