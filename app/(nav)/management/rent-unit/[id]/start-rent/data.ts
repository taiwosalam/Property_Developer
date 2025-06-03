import { transformUnitDetails } from "@/app/(nav)/listing/data";
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
  { label: "Who to charge New Rent", value: unit_data?.whoToCharge ?? "--- ---" },
  { label: "Who to charge New Renew", value: unit_data?.whoToChargeRenew ?? "--- ---" },
  { label: "Caution Deposit", value: unit_data?.caution_deposit ?? "--- ---" },
  { label: "Currency", value: unit_data?.currency ?? "--- ---" },
  { label: "Group Chat", value: `${unit_data?.group_chat ?? "--- ---"}` },
  { label: "Request Callback", value: `${unit_data?.requestCallBack ?? "--- ---"}` },
  { label: "Vehicle Record", value: `${unit_data?.vehicleRecord ?? "--- ---"}` },
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty ?? "--- ---"}` },
  { label: "Book Visitor", value: unit_data?.bookVisitor ?? "--- ---" },
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

export const getEstateSettingsData = (unit_data: any) => [
  { label: "Management Fee", value: unit_data?.management_fee ?? "--- ---" },
  { label: "Period", value: unit_data?.fee_period ?? "--- ---" },
  { label: "Book Visitor", value: unit_data?.bookVisitor ?? "--- ---" },
  { label: "Request Callback", value: `${unit_data?.requestCallBack ?? "--- ---"}` },
  { label: "Vehicle Record", value: `${unit_data?.vehicleRecord ?? "--- ---"}` },
  { label: "Fee Penalty", value: unit_data?.fee_penalty ?? "--- ---" },
  { label: "Group Chat", value: unit_data?.group_chat ?? "--- ---" },
  { label: "Currency", value: unit_data?.currency ?? "--- ---" },
];

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
  }, // TODO
  { label: "Landlord", value: unit_data?.landlord_name ?? "--- ---" }, // TODO
  { label: "Category", value: unit_data?.categories ?? "--- ---" },
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
