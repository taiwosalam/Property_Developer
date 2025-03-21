import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  picture: string | null;
  user_id: number | null;
  profile_id: number;
  branch_id: number | null;
  company_id: number;
}

export interface TenantData {
  tenants: Tenant[];
}

export interface TenantResponse {
  status: string;
  statusCode: number;
  data: TenantData;
  message: string;
}

export const initialTenants: Tenant[] = [
  {
    id: "",
    name: "",
    email: "",
    phone: "",
    picture: "",
    user_id: null,
    profile_id: 0,
    branch_id: null,
    company_id: 0,
  },
];

export const getPropertySettingsData = (unit_data: any) => [
  { label: "Agency Fee", value: `${unit_data?.agency_fee ?? "___"}%` },
  { label: "Period", value: unit_data?.fee_period ?? "___" },
  { label: "Charge", value: unit_data?.whoToCharge ?? "___" },
  { label: "Caution Deposit", value: unit_data?.caution_deposit ?? "___" },
  { label: "Group Chat", value: `${unit_data?.group_chat ?? "___"}` },
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty ?? "___"}` },
];

export const getEstateData = (unit_data: any) => [
  { label: "Property Title", value: unit_data?.property_title ?? "___" },
  { label: "State", value: unit_data?.state ?? "___" },
  { label: "Local Government", value: unit_data?.localGovernment ?? "___" },
  { label: "Full Address", value: unit_data?.address ?? "___" },
  { label: "Branch", value: unit_data?.branchName ?? "___" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "No Officer",
  },
  { label: "Description", value: unit_data?.description ?? "No Description" },
  { label: "Categories", value: unit_data?.categories ?? "___" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "___" },
];

export const getEstateSettingsData = (unit_data: any) => [
  { label: "Management Fee", value: unit_data?.management_fee ?? "___" },
  { label: "Period", value: unit_data?.fee_period ?? "___" },
  { label: "Fee Penalty", value: unit_data?.rent_penalty ?? "___" },
  { label: "Group Chat", value: unit_data?.group_chat ?? "___" },
];

export const getRentalData = (unit_data: any) => [
  { label: "Property Title", value: unit_data?.title ?? "___" },
  { label: "State", value: unit_data?.state ?? "___" },
  { label: "Local Government", value: unit_data?.localGovernment ?? "___" },
  { label: "Full Address", value: unit_data?.address ?? "___" },
  { label: "Branch", value: unit_data?.branchName ?? "___" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "No Officer",
  }, // TODO
  { label: "Landlord", value: unit_data?.landlord ?? "No Landlord" }, // TODO
  { label: "Categories", value: unit_data?.categories ?? "___" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "___" },
];

export const transformUnitsTenants = (res: TenantResponse): Tenant[] => {
  // console.log("res", res)
  return res?.data?.tenants?.map((t) => ({
    id: t.id.toString(),
    name: t.name,
    email: t.email,
    phone: t.phone,
    picture: t.picture,
    user_id: t.user_id,
    profile_id: t.profile_id,
    branch_id: t.branch_id,
    company_id: t.company_id,
  }));
};

export const startRent = async (data: any) => {
  try {
    const res = await api.post("/tenant-rent", data);
    if (res.data.status === "success") {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};
