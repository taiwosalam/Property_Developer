import api, { handleAxiosError } from "@/services/api";
import { InvoiceData, InvoicePageData } from "./types";

export const transformInvoiceData = (data: InvoiceData): InvoicePageData => {
  console.log("data", data);
  return {
    status: data.status || "",
    invoice_id: data.invoice_id || "",
    property_name: data.property_name || "",
    client_name: data.client_name || "",
    account_officer: data.account_officer || "",
    unit_id: data.unit_id ? data.unit_id.toString() : "",
    unit_name: data.unit_name || "",
    annual_fee: Number(data.annual_fee) || "",
    service_charge: Number(data.service_charge) || "",
    caution_fee: Number(data.caution_fee) || "",
    agency_fee: Number(data.agency_fee) || "",
    inspection_fee: Number(data.inspection_fee) || "",
    total_package: Number(data.total_package) || "",
    details: data.details || "",
    total_amount: Number(data.total_amount) || "",
    invoice_date: data.invoice_date || "",
    is_auto: data.is_auto === "true" || data.is_auto === true,
    currency: data.currency || "naira",
    auto_generate: data.auto_generate || "",
    invoice_type: data.type || "",
    branchBankDetails: {
      bank_name: data.bank_name || "",
      account_number: data.account_number || "",
      account_name: data.account_name || "",
    },
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
  total_package: "",
  details: "",
  total_amount: "",
  invoice_date: "",
  is_auto: false,
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
