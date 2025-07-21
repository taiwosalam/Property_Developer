import api, { handleAxiosError } from "@/services/api";
import { InvoiceData, InvoicePageData } from "./types";

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
