import { InvoiceData, InvoicePageData } from "./types";

export const transformInvoiceData = (data: InvoiceData): InvoicePageData => {
  return {
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
  };
};

export const defaultInvoiceData: InvoicePageData = {
  invoice_id: "",
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
};
