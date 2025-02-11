import { empty } from "@/app/config";
import { propertyCategories } from "@/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { getAllStates } from "@/utils/states";
import { number } from "zod";
//
export interface RentAndUnitState {
  gridView?: boolean;
  total_pages: number;
  current_page: number;
  last_page: number;
}
//

export const RentAndUnitFilters = [
  { label: "Single Property", value: "single-property" },
  { label: "Gated Eestate", value: "gated-estate" },
];

export const initialState: UnitPageState = {
  total_unit: 1,
  total_occupied: 0,
  total_vacant: 2,
  total_active: 0,
  total_expired: 0,
  total_relocate: 0,
  month_unit: 2,
  month_occupied: 0,
  month_vacant: 2,
  month_active: 0,
  month_expired: 0,
  month_relocate: 0,
  unit: [],
};

export interface UnitPageState {
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
  published_vacant?: number;
  month_published_vacant?: number;
  unpublished_vacant?: number;
  month_unpublished_vacant?: number;
  unit: RentalPropertyCardProps[];
}

export interface UnitApiResponse {
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
    published_vacant?: number;
    month_published_vacant?: number;
    unpublished_vacant?: number;
    month_unpublished_vacant?: number;
    unit: {
      current_page: number;
      last_page: number;
      data: UnitDataObject[];
    };
  };
}


export interface UnitFilterResponse {
  data: {
    current_page: number;
    last_page: number;
    data: UnitDataObject[];
  };
}

export const transformRentUnitApiResponse = (
  response: UnitApiResponse | UnitFilterResponse
): Partial<UnitPageState> => {
  const isUnitApiResponse = (
    response: any
  ): response is UnitApiResponse => {
    return "total_unit" in response.data;
  };

  const unitData = isUnitApiResponse(response)
    ? response.data.unit
    : response.data;

  const transformedUnits: RentalPropertyCardProps[] = unitData.data.map(
    (u) => {
      return {
        unitId: u.id.toString(),
        unit_title: u.property.title,
        unit_type: u.unit_type,
        tenant_name: "No Tenant", //TODO
        expiry_date: "No Expiry", //TODO
        rent: u.fee_amount,
        caution_deposit: u.caution_fee,
        service_charge: u.service_charge,
        images: u.images.map((image) => image.path),
        unit_name: u.unit_name,
        caution_fee: u.caution_fee,
        status: u.is_active,
        propertyType: u.property.property_type as "rental" | "facility",
        address: `${u.property.full_address}, ${u.property.local_government}, ${u.property.state}`,
      };
    }
  );

  // console.log("Transformed unit data", transformedUnits)
  if (isUnitApiResponse(response)) {
    // console.log("isUnitApiResponse", response)
    return {
      total_unit: response.data.total_unit,
      total_occupied: response.data.total_occupied,
      total_vacant: response.data.total_vacant,
      total_active: response.data.total_active,
      total_expired: response.data.month_expired,
      total_relocate: response.data.total_relocate,
      month_unit: response.data.month_unit,
      month_occupied: response.data.month_occupied,
      month_vacant: response.data.month_vacant,
      month_active: response.data.month_active,
      month_expired: response.data.month_expired,
      published_vacant: response.data.published_vacant,
      month_published_vacant: response.data.month_published_vacant,
      unpublished_vacant: response.data.unpublished_vacant,
      month_unpublished_vacant: response.data.month_unpublished_vacant,
      unit: transformedUnits,
    };
  } else {
    return {
      unit: transformedUnits,
    };
  }
};


export interface UnitDataObject {
  id: number;
  user_id: string;
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
  number_of: string;
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
  published: number;
  status: string;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  images_count: number;
  images: {
    id: string;
    path: string;
  }[];
  property: Property;
  user: User;
}


export interface Property {
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
  land_lord_id: number | null;
  user_id: number;
  company_id: number;
  agency_fee: number;
  who_to_charge_new_tenant: string;
  who_to_charge_renew_tenant: string;
  caution_deposit: string;
  group_chat: string;
  rent_penalty: string;
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
}

export interface User {
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
  provider_id: string | null;
  provider_name: string | null;
}


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
  images: string[];
  unitId: string;
  unit_title: string;
  unit_name: string;
  unit_type: string;
  tenant_name: string;
  expiry_date: string;
  rent: string;
  caution_deposit: string | number;
  service_charge: string | number;
  status: string;
  property_type?: string;
  is_active?: string;
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
  // {
  //   label: "Branch",
  //   value: [
  //     { label: "Branch 1", value: "branch1" },
  //     { label: "Branch 2", value: "branch2" },
  //     { label: "Branch 3", value: "branch3" },
  //   ],
  // },
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
  unit: {
    current_page: 1,
    last_page: 1,
  },
  unit_data: [],

}

export interface RentUnitPageData {
  stats: StatsData;
  unit: {
    current_page: number;
    last_page: number;
  };
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
    pagination: {
      current_page: number;
      last_page: number;
    };
    unit: UnitData;
  };
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


// SINGLE UNIT 

export const initialSingleData: InitialSingleUnitProps = {
  data: [
    {
      title: "",
      unit_id: "",
      location: "",
      unit_name: "",
      address: "",
      categories: "",
      unitNumber: "",
      unitPreference: "",
      unitType: "",
      unitSubType: "",
      state: "",
      localGovernment: "",
      accountOfficer: "",
      bedrooms: "",
      bathrooms: "",
      toilets: "",
      fee_amount: "",
      newTenantPrice: "",
      newTenantTotalPrice: "",
      renewalTenantPrice: "",
      renewalTenantTotalPrice: "",
      fee_period: "",
      renew_fee_period: "",
      images: [],
      agency_fee: "",
      branchName: "",
      whoToCharge: "",
      group_chat: "",
      rent_penalty: "",
      caution_deposit: "",
    }
  ]
}


export interface pageInitialObject {
  title: string;
  unit_id: string;
  location: string;
  unit_name: string;
  address: string;
  categories: string;
  unitNumber: string;
  unitPreference: string;
  unitType: string;
  unitSubType: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  fee_amount: string;
  newTenantPrice: string;
  newTenantTotalPrice: string;
  renewalTenantPrice: string;
  renewalTenantTotalPrice: string;
  fee_period: string;
  renew_fee_period: string;
  images: string[];
  agency_fee?: string;
  branchName?: string;
  whoToCharge?: string;
  group_chat?: string;
  rent_penalty?: string;
  caution_deposit?: string;
}

export interface InitialSingleUnitProps {
  data: pageInitialObject[];
}

export const InitialSingleUnit = {
  title: "",
  unit_id: "",
  location: "",
  unit_name: "",
  address: "",
  categories: "",
  unitNumber: "",
  unitPreference: "",
  unitType: "",
  unitSubType: "",
  state: "",
  localGovernment: "",
  accountOfficer: "",
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  fee_amount: "",
  newTenantPrice: "",
  newTenantTotalPrice: "",
  renewalTenantPrice: "",
  renewalTenantTotalPrice: "",
  fee_period: "",
  renew_fee_period: "",
  images: [] as string[],
  agency_fee: "",
  branchName: "",
  WhoToCharge: "",
  group_chat: "",
  rent_penalty: "",
  caution_deposit: "",
}

export interface singleDataObject {
  unit_id: string;
  unit_name: string;
  address: string;
  images: [];
  unit_category: string;
  unit_preference: string;
  unit_type: string;
  unit_sub_type: string;
  state: string;
  local_government: string;
  account_officer: string;
  tenant_name: string;
  unit_features: [];
  total_package: string;
  renew_total_package: string;
  renew_fee_period: string;
  renew_fee_amount: string;
  renew_service_charge: string;
  renew_other_charge: string;
  bedroom: string;
  bathroom: string;
  toilet: string;
  en_suit: number;
  prepaid: number;
  wardrobe: string;
  agency_fee: string;
  branchName?: string;
  WhoToCharge?: string;
  group_chat?: string;
  rent_penalty?: string;
}


export interface singleUnitApiResponse {
  data: {
    current_page: string | number;
    data: Array<{
      id: string;
      user_id: string;
      property_id: number;
      unit_name: string;
      unit_type: string;
      unit_sub_type: string;
      unit_preference: string;
      measurement: string;
      bedroom: string;
      bathroom: string;
      toilet: string;
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
        group_chat: string;
        rent_penalty: string;
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
        branch: {
          branch_name: string;
        }
      };
      occupant: Occupant;
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
}


export interface Occupant {
  id: string;
  name: string;
  email: string;
  userTag: "mobile" | "web";
  avatar: string;
  gender: string;
  birthday: string;
  religion: string;
  phone: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  lg: string;
}

export interface PreviousRecord {
  id: string;
  payment_date: string | null;
  amount_paid: string;
  details: string;
  start_date: string;
  due_date: string;
  data?: any;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PreviousRecords {
  data: PreviousRecord[];
  pagination: Pagination;
}


export interface UnitDetails {
  unit_id: string;
  title: string;
  unit_name: string;
  address: string;
  location: string;
  categories: string;
  unitNumber: string;
  unitPreference: string;
  unitType: string;
  unitSubType: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  newTenantPrice: string;
  newTenantTotalPrice: string;
  renewalTenantPrice: string;
  renewalTenantTotalPrice: string;
  fee_amount: string;
  images: [];
  fee_period: string;
  renew_fee_period: string;
  who_to_charge_new_tenant: string;
  property?: {
    branch?: {
      branch_name?: string;
    }
  }
}

export const transformSingleUnitData = (
  response: singleUnitApiResponse
): InitialSingleUnitProps => {
  const data = response.data;
  // console.log("res", response)
  // console.log("single response", data)
  return {
    data: data.data.map(unit => ({
      title: unit.property.title,
      unit_id: unit.id,
      unit_name: `${unit.unit_name} ${unit.unit_type}`,
      address: unit.property.full_address,
      unitNumber: "",
      images: unit.images.map((image) => image.path),
      categories: unit.property.category,
      unitPreference: unit.unit_preference,
      unitType: unit.unit_type,
      unitSubType: unit.unit_sub_type,
      state: unit.property.state,
      localGovernment: unit.property.local_government,
      accountOfficer: "",
      bedrooms: unit.bedroom,
      bathrooms: unit.bathroom,
      toilets: unit.toilet,
      tenant_name: unit.user.name,
      unit_features: unit.facilities,
      newTenantTotalPrice: unit.total_package,
      newTenantPrice: unit.fee_amount,
      renewalTenantTotalPrice: unit.renew_total_package,
      renew_fee_period: unit.renew_fee_period,
      renewalTenantPrice: unit.renew_fee_amount,
      renew_service_charge: unit.renew_service_charge,
      renew_other_charge: unit.renew_other_charge,
      en_suit: unit.en_suit,
      prepaid: unit.prepaid,
      wardrobe: unit.wardrobe,
      fee_period: unit.fee_period,
      branchName: unit.property.branch.branch_name,
      agency_fee: unit.agency_fee,
      whoToCharge: unit.property.who_to_charge_new_tenant,
      group_chat: convertToYesNo(Number(unit.property.group_chat)),
      rent_penalty: convertToYesNo(Number(unit.property.rent_penalty)),
      caution_deposit: unit.property.caution_deposit,
      location: "",
      fee_amount: "",
    }))
  };
};

export function convertToYesNo(value: number): string {
  return value === 1 ? "Yes" : "No";
}

// =============== /unit/${id}/view Transform ==========
export const initData = {
  title: "",
  unit_id: "",
  unit_name: "",
  address: "",
  images: [],
  categories: "",
  unitNumber: "",
  unitPreference: "",
  unitType: "",
  unitSubType: "",
  state: "",
  localGovernment: "",
  accountOfficer: "",
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  fee_period: "",
  newTenantPrice: "",
  newTenantTotalPrice: "",
  renew_fee_period: "",
  renewalTenantPrice: "",
  renewalTenantTotalPrice: "",
  branchName: "",
  agency_fee: "",
  whoToCharge: "",
  caution_deposit: "",
  group_chat: "",
  rent_penalty: "",
  propertyId: "",
  total_package: "",
  caution_fee: "",
  security_fee: "",
  other_charge: "",
  unitAgentFee: "",
  service_charge: "",
  renew_service_charge: "",
  renew_other_charge: "",
  occupant: {
    id: "",
    name: "",
    email: "",
    userTag: "" as "mobile",
    avatar: "",
    gender: "",
    birthday: "",
    religion: "",
    phone: "",
    maritalStatus: "",
    address: "",
    city: "",
    state: "",
    lg: "",
  }
}


export interface initDataProps {
  id?: string;
  title: string;
  unit_id: string;
  unit_name: string;
  address: string;
  images: string[];
  categories: string;
  unitNumber: string;
  unitPreference: string;
  unitType: string,
  unitSubType: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  fee_period: string;
  fee_amount?: string;
  newTenantPrice: string;
  newTenantTotalPrice: string;
  renew_fee_period: string;
  renewalTenantPrice: string;
  renewalTenantTotalPrice: string;
  renew_service_charge?: string;
  branchName?: string,
  agency_fee?: string;
  whoToCharge?: string;
  caution_deposit?: string;
  group_chat?: string;
  rent_penalty?: string;
  propertyId?: string;
  total_package?: string;
  caution_fee?: string;
  security_fee?: string;
  other_charge?: string;
  unitAgentFee?: string;
  service_charge?: string;
  renew_other_charge?: string;
  occupant: Occupant;
  previous_records?: PreviousRecords[];
  whoToChargeRenew?: string;
  property_title?: string;
  property_state?: string;
  property_address?: string;
}

// ================ transform /unit/${id}/view =================
export const transformUnitData = (response: any) => {
  const data = response.data;
  const occupant = response?.data?.occupant;
  const previous_records = response.data.previous_records;
  console.log("data to trans", response)
  return {
    title: data.property.title,
    unit_id: data.id,
    unit_name: `${data.unit_name} ${data.unit_type}`,
    address: data.property.full_address,
    unitNumber: "",
    images: data.images.map((image: any) => image.path),
    categories: data.property.category,
    unitPreference: data.unit_preference,
    unitType: data.unit_type,
    unitSubType: data.unit_sub_type,
    state: data.property.state,
    localGovernment: data.property.local_government,
    accountOfficer: "",
    bedrooms: data.bedroom,
    bathrooms: data.bathroom,
    toilets: data.toilet,
    tenant_name: data.user.name,
    unit_features: data.facilities,
    newTenantTotalPrice: data.total_package,
    newTenantPrice: data.fee_amount,
    renewalTenantTotalPrice: data.renew_total_package,
    renew_fee_period: data.renew_fee_period,
    renewalTenantPrice: data.renew_fee_amount,
    renew_service_charge: data.renew_service_charge,
    renew_other_charge: data.renew_other_charge,
    en_suit: data.en_suit,
    prepaid: data.prepaid,
    wardrobe: data.wardrobe,
    fee_period: data.fee_period,
    branchName: data.property.branch.branch_name,
    agency_fee: data.user.property.agency_fee,
    group_chat: convertToYesNo(Number(data.property.group_chat)),
    rent_penalty: convertToYesNo(Number(data.property.rent_penalty)),
    caution_deposit: data.user.property.caution_deposit,
    // PROPERTY VALUES
    property_title: data.property.title,
    whoToCharge: data.user.property.who_to_charge_new_tenant,
    whoToChargeRenew: data.user.property.who_to_charge_renew_tenant,
    property_state: data.property.state,
    property_address: `${data.property.full_address}, ${data.property.city_area} ${data.property.local_government}, ${data.property.state}`,
    caution_fee: data.caution_fee
      ? `${currencySymbols[data?.currency as keyof typeof currencySymbols] || '₦'}${formatNumber(
      parseFloat(data.caution_fee)
      )}`
      : undefined,
    location: "",
    fee_amount: data.fee_amount,
    propertyId: data.property.id,
    total_package: data.total_package,
    // caution_fee: data.caution_fee,
    security_fee: data.security_fee,
    other_charge: data.other_charge,
    unitAgentFee: data.agency_fee
      ? `${currencySymbols[data?.currency as keyof typeof currencySymbols] || '₦'}${formatNumber(
      parseFloat(data.agency_fee)
      )}`
      : undefined,
    service_charge: data.service_charge,
    occupant: occupant
      ? {
        id: occupant.id,
        name: occupant.name || "___",
        email: occupant.email || "___",
        userTag: occupant.userTag || "___",
        avatar: occupant.avatar || empty,
        gender: occupant.gender || "___",
        birthday: occupant.birthday || "___",
        religion: occupant.religion || "___",
        phone: occupant.phone || "___",
        maritalStatus: occupant.maritalStatus || "____",
        address: occupant.address || "____",
        city: occupant.city || "____",
        state: occupant.state || "____",
        lg: occupant.lg || "___"
      }
      : undefined,
    previous_records: previous_records ? previous_records : undefined
  }
}