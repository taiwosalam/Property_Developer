import { getAllStates } from "@/utils/states";
//
export interface RentAndUnitState {
  gridView: boolean;
  total_pages: number;
  current_page: number;
}
//

export const RentAndUnitFilters = [
  { label: "Single Property", value: "single-property" },
  { label: "Gated Eestate", value: "gated-estate" },
];

export interface RentUnitFilterParams {
  date_from?: string;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  staff_id?: string[];
  property_type?: "rental" | "facility";
  sort_by?: "desc";
  search?: string;
}

export interface RentalPropertyCardProps {
  propertyType: "rental" | "facility";
  images: { path: string }[];
  unitId: string;
  unit_title: string;
  unit_name: string;
  unit_type: string;
  tenant_name: string;
  expiry_date: string;
  rent: string;
  caution_deposit: string;
  service_charge: string;
  status: string;
  property_type: string;
}

const allStates = getAllStates() || [];

export const RentAndUnitFiltersWithDropdown = [
  {
    label: "State",
    value: allStates.map((state) => ({
      label: state,
      value: state,
    })),
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
      { label: "Branch 3", value: "branch3" },
    ],
  },
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
];

interface UnitData {
  unit_title: string;
  unit_name: string;
  id: string;
  rent?: string;
  unitId?: string;
  tenant_name?: string;
  expiry_date?: string;
  fee_amount: string;
  caution_fee: string;
  caution_deposit?: string;
  service_charge: string;
  unit_type: string;
  images: {
    id: string;
    path: string;
  }[];
  is_active: string;
  property_type?: string;
  property: {
    property_type: string;
    title: string;
  }
};

export const initialRentUnitPageData: RentUnitPageData = {
  stats: {
    total_unit: 0,
    total_occupied: 0,
    total_vacant: 0,
    total_active: 0,
    total_expired: 0,
    total_relocate: 0,
    month_unit: 0,
    month_occupied: 0,
    month_vacant: 0,
    month_active: 0,
    month_expired: 0,
    month_relocate: 0,
  },
  unit_data: [],
}

export interface RentUnitPageData {
  stats: StatsData;
  unit_data: UnitData[];
}

export interface StatsData {
  total_unit: number;
  total_occupied: number;
  total_vacant: number;
  total_active: number;
  total_expired: number;
  total_relocate: number;
  month_unit: number;
  month_occupied: number;
  month_vacant: number;
  month_active: number;
  month_expired: number;
  month_relocate: number;
}

export interface RentUnitApiResponse {
  data: {
    total_unit: number;
    total_occupied: number;
    total_vacant: number;
    total_active: number;
    total_expired: number;
    total_relocate: number;
    month_unit: number;
    month_occupied: number;
    month_vacant: number;
    month_active: number;
    month_expired: number;
    month_relocate: number;
    unit: UnitData;
  };
}


interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface RentUnitRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  state?: string;
  start_date?: string;
  end_date?: string;
  agent?: string;
  branch_id?: string;
}

export interface RentUnitFilterResponse {
  data: {
    current_page: number;
    last_page: number;
    unit: UnitData;
  }
}

export const transformRentUnitApiResponse = (
  response: RentUnitApiResponse | RentUnitFilterResponse
): Partial<RentUnitPageData> => {
  // Check if response is RentUnitApiResponse by the presence of `total_unit`
  const isRentUnitApiResponse = (response: any): response is RentUnitApiResponse => {
    const result = response.data && !("total_unit" in response.data);
    return result;
  };


  // Extract unit data based on the type of response
  const unitData = isRentUnitApiResponse(response)
    ? response.data.data // For RentUnitApiResponse
    : response.data.unit.data; // For RentUnitFilterResponse

  // Map through unit data
  const transformedUnits = unitData.map((unit: UnitData) => {
    const transformedUnit = {
      propertyType: unit.property.property_type,
      images: unit.images,
      unitId: unit.id,
      unit_title: unit.property.title,
      unit_name: unit.unit_name,
      unit_type: unit.unit_type,
      tenant_name: unit.tenant_name || "No Tenant",
      expiry_date: unit.expiry_date || "No Expiry",
      rent: unit.fee_amount,
      caution_deposit: unit.caution_fee,
      service_charge: unit.service_charge,
      status: unit.is_active,
      property_type: unit.property.property_type,
    };
    return transformedUnit;
  });

  // Extract stats if it is RentUnitApiResponse
  const stats = !isRentUnitApiResponse(response)
    ? {
      total_unit: response.data.total_unit,
      total_occupied: response.data.total_occupied,
      total_vacant: response.data.total_vacant,
      total_active: response.data.total_active,
      total_expired: response.data.total_expired,
      total_relocate: response.data.total_relocate,
      month_unit: response.data.month_unit,
      month_occupied: response.data.month_occupied,
      month_vacant: response.data.month_vacant,
      month_active: response.data.month_active,
      month_expired: response.data.month_expired,
      month_relocate: response.data.month_relocate,
    }
    : undefined; // No stats for RentUnitFilterResponse

  console.log("Extracted stats:", stats);

  return {
    stats,
    unit_data: transformedUnits,
  };
};


export interface InitialSingleUnitProps {
  current_page: number;
  data: {
    unit_id: number;
    unit_name: string;
    address: string;
    images: {
      id: string;
      path: string;
    }[];
    unit_category: string;
    unit_preference: string;
    unit_type: string;
    unit_sub_type: string;
    state: string;
    local_government: string;
    account_officer: string;
    tenant_name: string;
    unit_features: [];
  }
}


export const initialSingleData: InitialSingleUnitProps = {
  current_page: 1,
  data: {
    unit_id: 1,
    unit_name: "",
    address: "",
    images: [],
    unit_category: "",
    unit_preference: "",
    unit_type: "",
    unit_sub_type: "",
    state: "",
    local_government: "",
    account_officer: "",
    tenant_name: "",
    unit_features: [],
  }
}

export interface singleUnitApiResponse {
  current_page: number;
  data: Array<{
    id: number;
    user_id: number;
    property_id: number;
    unit_name: string;
    unit_type: string;
    unit_sub_type: string;
    unit_preference: string;
    measurement: string;
    bedroom: string;
    bathroom: string;
    toilet: number;
    facilities: string[];
    en_suit: number;
    prepaid: number;
    wardrobe: number;
    pet_allowed: number;
    total_area_sqm: string;
    number_of: number;
    fee_period: string;
    fee_amount: string;
    security_fee: string | null;
    service_charge: string;
    agency_fee: string;
    legal_fee: string;
    caution_fee: string;
    inspection_fee: string;
    management_fee: string | null;
    other_charge: string | null;
    negotiation: number;
    total_package: string;
    renew_fee_period: string;
    renew_fee_amount: string;
    renew_service_charge: string;
    renew_other_charge: string | null;
    renew_total_package: string;
    is_active: string;
    status: string;
    reject_reason: string | null;
    created_at: string;
    updated_at: string;
    images: Array<{
      id: number;
      path: string;
      mediaable_type: string;
      mediaable_id: number;
      created_at: string;
      updated_at: string;
    }>;
    property: {
      id: number;
      video_link: string;
      title: string;
      state: string;
      local_government: string;
      city_area: string;
      full_address: string;
      category: string;
      description: string;
      property_type: string;
      branch_id: number;
      inventory_id: number | null;
      land_lord_id: number;
      user_id: number;
      company_id: number;
      agency_fee: number;
      who_to_charge_new_tenant: string;
      who_to_charge_renew_tenant: string;
      caution_deposit: string;
      group_chat: number;
      rent_penalty: number;
      fee_penalty: number;
      request_call_back: number;
      book_visitors: number;
      vehicle_record: number;
      active_vat: number;
      currency: string;
      coordinate: string | null;
      management_fee: number;
      fee_period: string | null;
      created_at: string;
      updated_at: string;
    };
    user: {
      id: number;
      encodedId: string;
      name: string;
      email: string;
      phone: string | null;
      username: string | null;
      referrer_code: string | null;
      email_verified_at: string;
      phone_verified_at: string | null;
      username_updated_at: string | null;
      is_active: number;
      is_company_owner: number;
      tier_id: number;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
      provider_id: number | null;
      provider_name: string | null;
    };
  }>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const transformSingleUnitData = (
  response: singleUnitApiResponse
): InitialSingleUnitProps => {
  const data = response.data;
  return {
    current_page: data.current_page,
    data: data.data.map(unit => ({
      unit_id: unit.id,
      unit_name: unit.unit_name,
      address: unit.property.full_address,
      images: unit.images.map(image => ({ id: image.id.toString(), path: image.path })),
      unit_category: unit.property.category,
      unit_preference: unit.unit_preference,
      unit_type: unit.unit_type,
      unit_sub_type: unit.unit_sub_type,
      state: unit.property.state,
      local_government: unit.property.local_government,
      account_officer: "", // Assuming this needs to be filled in later
      tenant_name: unit.user.name,
      unit_features: [], 
    }))
  };
};