// Imports
import type {
  PropertyFormStateType,
  AllStaffResponse,
  PropertyFormPayload,
  AddUnitPayload,
} from "./types";
import api from "@/services/api";

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
    rent_penalty: data.rent_penalty,
    fee_penalty: data.fee_penalty,
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

export const transformUnitFormData = (
  formData: Record<string, any>,
  images: (File | string)[],
  propertyType: "rental" | "facility"
): AddUnitPayload => {
  const unit = {
    unit_name: formData.unit_name,
    unit_type: formData.unit_type,
    unit_sub_type: formData.unit_sub_type,
    unit_preference: formData.unit_preference,
  };

  const features = {
    measurement: formData.measurement ?? null,
    total_area_sqm: formData.total_area_sqm ?? null,
    number_of: formData.number_of ?? null,
    bedroom: formData.bedroom ?? null,
    bathroom: formData.bathroom ?? null,
    toilet: formData.toilet ?? null,
    facilities: formData.facilities ?? null,
    en_suit: formData.en_suit ?? null,
    prepaid: formData.prepaid ?? null,
    wardrobe: formData.wardrobe ?? null,
    pet_allowed: formData.pets_allowed ?? null,
  };

  let unit_fee_news = null;
  let unit_fee_renews = null;
  let unit_fee = null;

  if (propertyType === "rental") {
    unit_fee_news = {
      fee_period: formData.fee_period_new,
      fee_amount: formData.fee_amount_new,
      service_charge: formData.service_charge_new,
      agency_fee: formData.agency_fee,
      legal_fee: formData.legal_fee,
      caution_fee: formData.caution_fee,
      inspection_fee: formData.inspection_fee,
      other_charge: formData.other_charges_new,
      negotiation: formData.negotiation,
      total_package: formData.total_package_new,
    };

    unit_fee_renews = {
      fee_period: formData.fee_period_renew,
      fee_amount: formData.fee_amount_renew,
      service_charge: formData.service_charge_renew,
      other_charge: formData.other_charges_renew,
      total_package: formData.total_package_renew,
    };
  } else if (propertyType === "facility") {
    unit_fee = {
      fee_period: formData.fee_period,
      fee_amount: formData.fee_amount,
      security_fee: formData.security_fee,
      service_fee: formData.service_fee,
      other_charge: formData.other_charges,
      total_package: formData.total_package,
    };
  }

  return {
    unit,
    images,
    features,
    unit_fee_news,
    unit_fee_renews,
    unit_fee,
  };
};
