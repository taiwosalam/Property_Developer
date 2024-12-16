// Imports
import type { PropertyFormStateType, AllStaffResponse } from "./types";
import api from "@/services/api";

export const property_form_state_data: PropertyFormStateType = {
  state: "",
  city: "",
  lga: "",
  selectedBranch: { value: "", label: "" },
  staff: [],
  staffOptions: [],
  accountOfficerOptions: [],
  resetKey: 0,
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
  imageFiles: (File | string)[],
  company_id: string
) => {
  // Collect staff IDs
  const staffIds = Object.entries(data)
    .filter(([key]) => key.startsWith("staff") && key.endsWith("_id"))
    .map(([_, value]) => value as string)
    .filter(Boolean);
  // Add account officer if present
  if (data.account_officer_id) {
    staffIds.push(data.account_officer_id);
  }

  const payload = {
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
    rent_penalty: data.rent_penalty,
    fee_penalty: data.fee_penalty,
    request_call_back: data.request_call_back,
    book_visitors: data.book_visitors,
    vehicle_record: data.vehicle_record,
    active_vat: data.active_vat,
    currency: data.currency,
    coordinate: data.coordinate,
    images: imageFiles,
    staff: staffIds,
  };

  return payload;
};

export const transformUnitFormData = (
  formData: Record<string, any>,
  images: (File | string)[],
  property_id: string
) => {
  const parseFee = (value: string | undefined) => {
    if (!value) {
      return 0;
    }
    return parseFloat(value.replace(/,/g, ""));
  };

  const parseIntOrNull = (value: string | undefined | null) => {
    if (!value) return 0;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  };

  const payload = {
    unit_name: formData.unit_name,
    unit_type: formData.unit_type,
    unit_sub_type: formData.unit_sub_type ?? null,
    unit_preference: formData.unit_preference,
    measurement: formData.measurement ?? null,
    total_area_sqm: formData.total_area_sqm ?? null,
    number_of: formData.number_of ?? 0,
    bedroom: parseIntOrNull(formData.bedroom),
    bathroom: parseIntOrNull(formData.bathroom),
    toilet: parseIntOrNull(formData.toilet),
    facilities: formData.facilities
      ? formData.facilities.split(",").map(decodeURIComponent)
      : [],
    en_suit: formData.en_suit ?? null,
    prepaid: formData.prepaid ?? null,
    wardrobe: formData.wardrobe ?? null,
    pet_allowed: formData.pets_allowed ?? null,
    fee_period: formData.fee_period ?? null,
    fee_amount: parseFee(formData.fee_amount),
    service_charge: parseFee(formData.service_charge),
    agency_fee: parseFee(formData.agency_fee),
    legal_fee: parseFee(formData.legal_fee),
    caution_fee: parseFee(formData.caution_fee),
    inspection_fee: parseFee(formData.inspection_fee),
    other_charge: parseFee(formData.other_charge),
    negotiation: formData.negotiation ?? null,
    security_fee: parseFee(formData.security_fee),
    total_package: parseFee(formData.total_package),
    renew_fee_period: formData.renew_fee_period ?? null,
    renew_fee_amount: parseFee(formData.renew_fee_amount),
    renew_service_charge: parseFee(formData.renew_service_charge),
    renew_other_charge: parseFee(formData.renew_other_charge),
    renew_total_package: parseFee(formData.renew_total_package),
    property_id,
    images,
  };

  return payload;
};
