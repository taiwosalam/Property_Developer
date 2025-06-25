import { transformUnitDetails } from "@/app/(nav)/listing/data";
import type { Field } from "@/components/Table/types";
import api, { handleAxiosError } from "@/services/api";

export const rentRecordsTableFields: Field[] = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
  { id: "4", label: "Details", accessor: "details" },
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "Due Date", accessor: "due_date" },
];

const generateRentRecordsTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: index + 1,
    payment_date: "2024-01-01",
    amount_paid: "₦100,000",
    details: "Rent for January 2024",
    start_date: "2024-01-01",
    due_date: "2024-01-15",
  }));
};

export const rentRecordsTableData = generateRentRecordsTableData(2);

type RentalField = {
  label: string;
  value: string;
};

export const getRentalData = (unit_data: any) => [
  { label: "Property Name", value: unit_data?.title ?? "--- ---" },
  { label: "Unit Name", value: unit_data?.unit_name ?? "--- ---" },
  { label: "Unit Title", value: transformUnitDetails(unit_data) ?? "--- ---" },
  {
    label: "Full Address",
    value: `${unit_data?.address ?? "--- ---"}, ${
      unit_data?.localGovernment ?? "--- ---"
    }, ${unit_data?.state ?? "--- ---"},`,
  },
  { label: "Branch", value: unit_data?.branchName ?? "--- ---" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "--- ---",
  },
  { label: "Landlord", value: unit_data?.landlord_name ?? "--- ---" }, // TODO
  { label: "Category", value: unit_data?.categories ?? "--- ---" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "--- ---" },
];


export const getEstateData = (unit_data: any) => [
  { label: "Property Name", value: unit_data?.title ?? "--- ---" },
  { label: "Unit Name", value: unit_data?.unit_name ?? "--- ---" },
  { label: "Unit Title", value: transformUnitDetails(unit_data) ?? "--- ---" },
  {
    label: "Full Address",
    value: `${unit_data?.address ?? "--- ---"}, ${
      unit_data?.localGovernment ?? "--- ---"
    }, ${unit_data?.state ?? "--- ---"},`,
  },
  { label: "Branch", value: unit_data?.branchName ?? "--- ---" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "--- ---",
  },
  { label: "Description", value: unit_data?.description ?? "--- ---" },
  { label: "Category", value: unit_data?.categories ?? "--- ---" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "--- ---" },
];

type PropertySetting = {
  label: string;
  value: string;
};

export const getPropertySettingsData = (unit_data: any) => [
  { label: "Agency Fee", value: `${unit_data?.agency_fee ?? "--- ---"}%` },
  { label: "Period", value: unit_data?.fee_period ?? "--- ---" },
  {
    label: "Who to charge New Rent",
    value: unit_data?.whoToCharge ?? "--- ---",
  },
  {
    label: "Who to charge New Renew",
    value: unit_data?.whoToChargeRenew ?? "--- ---",
  },
  { label: "Caution Deposit", value: unit_data?.caution_deposit ?? "--- ---" },
  { label: "Currency", value: unit_data?.currency ?? "--- ---" },
  { label: "Group Chat", value: `${unit_data?.group_chat ?? "--- ---"}` },
  {
    label: "Request Callback",
    value: `${unit_data?.requestCallBack ?? "--- ---"}`,
  },
  {
    label: "Vehicle Record",
    value: `${unit_data?.vehicleRecord ?? "--- ---"}`,
  },
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty ?? "--- ---"}` },
  { label: "Book Visitor", value: unit_data?.bookVisitor ?? "--- ---" },
];

export interface EstateSetting {
  label: string;
  value: string;
}

export const getEstateSettingsData = (unit_data: any) => [
  { label: "Management Fee", value: unit_data?.management_fee ?? "--- ---" },
  { label: "Period", value: unit_data?.fee_period ?? "--- ---" },
  { label: "Book Visitor", value: unit_data?.bookVisitor ?? "--- ---" },
  {
    label: "Request Callback",
    value: `${unit_data?.requestCallBack ?? "--- ---"}`,
  },
  {
    label: "Vehicle Record",
    value: `${unit_data?.vehicleRecord ?? "--- ---"}`,
  },
  { label: "Fee Penalty", value: unit_data?.fee_penalty ?? "--- ---" },
  { label: "Group Chat", value: unit_data?.group_chat ?? "--- ---" },
  { label: "Currency", value: unit_data?.currency ?? "--- ---" },
];

///tenant-rent/4/switch
export const switchUnit = async (id: String, data: any) => {
  try {
    const res = await api.post(`/tenant-rent/${id}/switch`, data);
    if (res.status === 201 || res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// /tenant-rent/edit
export const editRent = async (data: any) => {
  try {
    const res = await api.post(`/tenant-rent/edit`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const addPartPayment = async (data: any) => {
  try {
    const res = await api.post(`/tenant-rent/edit`, data);
    if (res.status === 201) {
      return res.data;
    }
    return null;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};
