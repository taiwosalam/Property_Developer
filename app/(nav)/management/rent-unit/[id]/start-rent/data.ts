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
  { label: "Agency Fee", value: `${unit_data?.agency_fee ?? "--- ---"}%` },
  { label: "Period", value: unit_data?.fee_period ?? "--- ---" },
  { label: "Who to charge", value: unit_data?.whoToCharge ?? "--- ---" },
  { label: "Caution Deposit", value: unit_data?.caution_deposit ?? "--- ---" },
  { label: "Group Chat", value: `${unit_data?.group_chat ?? "--- ---"}` },
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty ?? "--- ---"}` },
];

export const getEstateData = (unit_data: any) => [
  { label: "Property Title", value: unit_data?.property_title ?? "--- ---" },
  { label: "State", value: unit_data?.state ?? "--- ---" },
  { label: "Local Government", value: unit_data?.localGovernment ?? "--- ---" },
  { label: "Full Address", value: unit_data?.address ?? "--- ---" },
  { label: "Branch", value: unit_data?.branchName ?? "--- ---" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "--- ---",
  },
  { label: "Description", value: unit_data?.description ?? "--- ---" },
  { label: "Categories", value: unit_data?.categories ?? "--- ---" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "--- ---" },
];

export const getEstateSettingsData = (unit_data: any) => [
  { label: "Management Fee", value: unit_data?.management_fee ?? "--- ---" },
  { label: "Period", value: unit_data?.fee_period ?? "--- ---" },
  { label: "Fee Penalty", value: unit_data?.fee_penalty ?? "--- ---" },
  { label: "Group Chat", value: unit_data?.group_chat ?? "--- ---" },
];

export const getRentalData = (unit_data: any) => [
  { label: "Property Title", value: unit_data?.title ?? "--- ---" },
  { label: "State", value: unit_data?.state ?? "--- ---" },
  { label: "Local Government", value: unit_data?.localGovernment ?? "--- ---" },
  { label: "Full Address", value: unit_data?.address ?? "--- ---" },
  { label: "Branch", value: unit_data?.branchName ?? "--- ---" },
  {
    label: "Account Officer",
    value: unit_data?.accountOfficer ?? "--- ---",
  }, // TODO
  { label: "Landlord", value: unit_data?.landlord_name ?? "--- ---" }, // TODO
  { label: "Categories", value: unit_data?.categories ?? "--- ---" },
  { label: "Unit ID", value: unit_data?.unit_id ?? "--- ---" },
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
