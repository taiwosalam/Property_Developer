// Imports
import {
  PropertyFormStateType,
  AllBranchesResponse,
  AllLandlordsResponse,
  AllInventoryResponse,
  AllStaffResponse,
  PropertyFormPayload,
} from "./types";
import api from "@/services/api";

import { toast } from "sonner";

export const unit_card_data_props = {
  unit_details: "",
  "unit no/name": "",
  unit_description: "",
  rent: "",
  caution_deposit: "",
  service_charge: "",
};

export const property_form_state_data: PropertyFormStateType = {
  state: "",
  city: "",
  lga: "",
  selectedBranch: "",
  staff: [],
  staffOptions: [],
  branchOptions: [],
  inventoryOptions: [],
  landlordOptions: [],
  accountOfficerOptions: [],
  resetKey: 0,
};

export const getAllBranches = async () => {
  try {
    const { data } = await api.get<AllBranchesResponse>("/branches/all");
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllLandlords = async () => {
  try {
    const { data } = await api.get<AllLandlordsResponse>("/landlords/all");
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllInventory = async () => {
  try {
    const { data } = await api.get<AllInventoryResponse>("/inventory/all");
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllStaffByBranch = async (branchId: string) => {
  try {
    const { data } = await api.get<AllStaffResponse>(`/staff/all/${branchId}`);
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const transformPropertyFormData = (
  data: Record<string, any>,
  imageFiles: File[],
  company_id: string
): PropertyFormPayload => {
  const property = {
    title: data.title,
    state: data.state,
    local_government: data.local_government,
    city_area: data.city_area,
    full_address: data.full_address,
    category: data.category,
    description: data.description,
    video_link: data.video_link,
    property_type: data.property_type,
    branch_id: data.branch_id,
    inventory_id: data.inventory_id,
    land_lord_id: data.land_lord_id,
    company_id,
  };

  // Base settings object
  const settings = {
    agency_fee: isNaN(parseFloat(data.agency_fee))
      ? null
      : parseFloat(data.agency_fee),
    management_fee: isNaN(parseFloat(data.management_fee))
      ? null
      : parseFloat(data.management_fee),
    who_to_charge_new_tenant: data.who_to_charge_new_tenant,
    who_to_charge_renew_tenant: data.who_to_charge_renew_tenant,
    caution_deposit: data.caution_deposit,
    group_chat: data.group_chat,
    request_call_back: data.request_call_back,
    book_visitors: data.book_visitors,
    vehicle_record: data.vehicle_record,
    active_vat: data.active_vat,
    currency: data.currency,
    coordinate: data.coordinate,
  };

  // Collect staff IDs
  const staffIds = Object.entries(data)
    .filter(([key]) => key.startsWith("staff") && key.endsWith("_id"))
    .map(([_, value]) => value as string)
    .filter(Boolean);

  // Add account officer if present
  if (data.account_officer_id) {
    staffIds.push(data.account_officer_id);
  }

  return {
    images: imageFiles,
    property,
    settings,
    staff: staffIds,
  };
};
