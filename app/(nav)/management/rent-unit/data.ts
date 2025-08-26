import { empty } from "@/app/config";
import {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { RentPeriod } from "@/components/Management/Rent And Unit/data";
import { propertyCategories } from "@/data";
import api, { handleAxiosError } from "@/services/api";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { getAllStates } from "@/utils/states";
import dayjs from "dayjs";
import { number } from "zod";
import { transformUnitDetails } from "../../listing/data";
//
export interface RentAndUnitState {
  gridView?: boolean;
  total_pages: number;
  current_page: number;
  last_page: number;
}
//

export const RentAndUnitFilters = [
  { label: "Rental Property", value: "rental-property" },
  { label: "Facility Property", value: "facility-property" },
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
  last_page?: number;
  current_page?: number;
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
    current_page: number;
    last_page: number;
    pagination: {
      current_page: number;
      total_pages: number;
    };
    unit: {
      current_page: number;
      last_page: number;
      data: UnitDataObject[];
    };
    data: {
      current_page: number;
      last_page: number;
      data: UnitDataObject[];
    };
  };
}

export interface UnitFilterResponse {
  data: {
    data: UnitDataObject[];
    unit: UnitDataObject[];
    current_page: number;
    last_page: number;
    pagination: {
      current_page: number;
      total_pages: number;
    };
  };
}

export const transformRentUnitApiResponse = (
  // response: UnitApiResponse
  response: UnitApiResponse | UnitFilterResponse,
  isBranch?: boolean
): Partial<UnitPageState> => {
  const isUnitApiResponse = (response: any): response is UnitApiResponse => {
    return "total_unit" in response.data;
  };

  const unitData = isUnitApiResponse(response)
    ? (response.data.unit as any)
    : (response.data.unit as any);

  const unitsArr = isBranch ? response.data.data : unitData;

  const transformedUnits: RentalPropertyCardProps[] = unitsArr?.map(
    (u: any) => {
      return {
        unitId: u?.id?.toString() || "0",
        currency: u.property.currency,
        unit_title: u?.property?.title || "--- ---",
        unit_type: u?.unit_type || "--- ---",
        tenant_name: u?.occupant?.name !== null ? u?.occupant?.name : "--- ---", //TODO
        expiry_date:
          u?.occupant?.expiry !== null ? u?.occupant?.expiry : "--- ---", //TODO
        rent: u?.fee_amount || "--- ---",
        caution_deposit: u?.caution_fee || "--- ---",
        service_charge: u?.service_charge || "--- ---",
        images: u.images.map((image: any) => image.path),
        unit_name: u?.unit_name || "--- ---",
        caution_fee: u?.caution_fee || "--- ---",
        status: u.is_active,
        invoice_status:
          u?.invoice_status?.toLowerCase() === "pending" ? "pending" : "paid",
        invoice_id: u.invoice_id,
        fee_period: u.fee_period,
        propertyType: u.property.property_type as "rental" | "facility",
        address: `${u.property.full_address}, ${u.property.local_government}, ${u.property.state}`,
        badge_color: u?.occupant?.tier
          ? tierColorMap[u?.occupant?.tier as keyof typeof tierColorMap]
          : undefined,
        tenant_id: u?.occupant?.tenant_id || 0,
        partial_pending: u?.partial_pending ? true : false,
        cautionDepositStatus: u?.occupant?.caution_status,
        occupant: u?.occupant,
        caution_unit_occupant: {
          requestId: u?.occupant?.request_id?.toString() || null,
          propertyName: u?.property?.title || null,
          state: u?.property?.state || null,
          unitDetails: transformUnitDetails(u),
          agent: u?.occupant?.agent || null,
          request_status: u?.occupant?.request_status || null,
          branch: u?.property?.branch?.branch_name || null,
          amount: u?.occupant?.request_amount?.toString() || null,
        },
      };
    }
  );
  if (isUnitApiResponse(response)) {
    // console.log("isUnitApiResponse", response)
    return {
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
      published_vacant: response.data.published_vacant,
      month_published_vacant: response.data.month_published_vacant,
      unpublished_vacant: response.data.unpublished_vacant,
      month_unpublished_vacant: response.data.month_unpublished_vacant,
      unit: transformedUnits,
    };
  } else {
    return {
      unit: transformedUnits,
      last_page: response.data.last_page || 1,
      current_page: response.data.current_page || 1,
    };
  }
};

export const cancelRent = async (id: number, data: any) => {
  try {
    const res = await api.post(`/invoice/cancel/${id}`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to Cancel Rent");
    return false;
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
  sponsored_count: number;
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
  is_sponsored?: boolean;
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
  currency: Currency;
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
  page: number;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  staff_id?: string[];
  property_type?: "rental" | "facility";
  sort_by?: "desc" | "asc";
  search?: string;
  is_active?: string;
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
  cautionDepositStatus?: boolean;
  service_charge: string | number;
  status: string;
  badge_color?: BadgeIconColors;
  reject_reason?: string;
  tenant_id?: string;
  is_active?: string;
  fee_period?: string;
  currency?: Currency;
  invoice_status?: string | null;
  invoice_id?: number | null;
  partial_pending?: boolean;
  occupant?: any;
  caution_unit_occupant?: any;
  page?: "manager" | "account" | "staff";
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
    label: "Status",
    radio: true,
    value: [
      // { label: "All", value: "all" },
      { label: "Vacant", value: "vacant" },
      { label: "Occupied", value: "occupied" },
      { label: "Expired", value: "expired" },
    ],
  },
  {
    label: "Property Type",
    radio: true,
    value: [
      { label: "Rental", value: "rental" },
      { label: "Facility", value: "facility" },
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
  };
}

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
};

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
  };
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
    },
  ],
};

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
};

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
        };
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
  };
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
  tenant_signature?: string;
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
    };
  };
}

export const transformSingleUnitData = (
  response: singleUnitApiResponse
): InitialSingleUnitProps => {
  const data = response.data;
  // console.log("res", response)
  console.log("single response", data);
  return {
    data: data.data.map((unit) => ({
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
    })),
  };
};

export function convertToYesNo(value: number): string {
  return value === 1 ? "Yes" : "No";
}

// =============== /unit/${id}/view Transform ==========
export const initData = {
  title: "",
  unit_id: "",
  description: "",
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
  },
  property_document: {},
};

export interface initDataProps {
  id?: string;
  title: string;
  management_fee?: string;
  currency?: Currency;
  description: string;
  unit_id: string;
  unit_name: string;
  address: string;
  images: string[];
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
  fee_period: string;
  fee_amount?: string;
  newTenantPrice: string;
  newTenantTotalPrice: string;
  renew_fee_period: string;
  renewalTenantPrice: string;
  renewalTenantTotalPrice: string;
  renew_service_charge?: string;
  branchName?: string;
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
  legalFee?: string;
  inspectionFee?: string;
  service_charge?: string;
  renew_other_charge?: string;
  renew_vat_amount?: string;
  vat_amount?: string;
  occupant: Occupant;
  previous_records?: PreviousRecords[];
  whoToChargeRenew?: string;
  property_title?: string;
  property_state?: string;
  property_address?: string;
  previous_tenants?: any;
  property_document?: any;
  [key: string]: any;
}

// ================ transform /unit/${id}/view =================
export const transformUnitData = (response: any) => {
  const data = response.data;
  const occupant = response?.data?.occupant;
  const previous_records = response.data.previous_records;
  const current_records = response.data.current_records;
  const pending_invoice = response.data.pending_invoice;
  const unpaid_invoice = response.data.unpaid_invoice;

  // Helper function to format and validate fee amounts
  const formatFee = (
    amount: string | number | undefined | null,
    currency: string
  ): string | undefined => {
    if (!amount || amount === "") return undefined; // Skip undefined, null, or empty string
    const parsedAmount = parseFloat(amount.toString());
    if (isNaN(parsedAmount) || parsedAmount === 0) return undefined; // Skip NaN or zero
    const currencySymbol =
      currencySymbols[currency as keyof typeof currencySymbols] || "₦";
    return `${currencySymbol}${formatNumber(parsedAmount)}`;
  };

  // Transform data with conditional inclusion of fee fields
  const transformedData = {
    ...data,
    title: data?.property?.title || "",
    unit_id: data?.id || 0,
    description: data?.property?.description || "",
    unit_name: `${data?.unit_name || ""} ${data?.unit_type || ""}`,
    address: data?.property?.full_address || "",
    unitNumber: "",
    images: data?.images?.map((image: any) => image?.path) || [empty],
    categories: data?.property?.category || "",
    unitPreference: data?.unit_preference || "",
    unitType: data?.unit_type || "",
    unitSubType: data?.unit_sub_type || "",
    state: data?.property?.state || "",
    localGovernment: data?.property?.local_government || "",
    accountOfficer: data?.property?.account_officer?.name || "",
    bedrooms: data?.bedroom || "",
    bathrooms: data?.bathroom || "",
    landlord_name: data?.landlord?.name || "",
    landlord_signature: data?.landlord?.signature || "",
    toilets: data?.toilet || "",
    tenant_name: data?.user?.name || "",
    unit_features: data?.facilities || "",
    newTenantTotalPrice: data?.total_package || "",
    currency: data.property.currency,
    fee_amount: data.fee_amount,
    renewalTenantTotalPrice: data.renew_total_package,
    renew_fee_period: data.renew_fee_period,
    fee_period: data.fee_period,
    branchName: data?.property?.branch?.branch_name || "",
    agency_fee: data?.user?.property?.agency_fee || "",
    group_chat: convertToYesNo(Number(data.property.group_chat)),
    active_vat: convertToYesNo(Number(data.property.active_vat)),
    rent_penalty: convertToYesNo(Number(data.property.rent_penalty)),
    fee_penalty: convertToYesNo(Number(data.property.fee_penalty)),
    chargePenalty: data.property.rent_penalty || data.property.fee_penalty,
    caution_deposit: data.user.property.caution_deposit,
    tenant_screening_level: data.property.tenant_screening_level,
    occupant_screening_level: data.property.occupant_screening_level,
    propertyType: data.property.property_type as "rental" | "facility",
    // PROPERTY VALUES
    property_title: data.property.title,
    whoToCharge: data.user.property.who_to_charge_new_tenant,
    whoToChargeRenew: data.user.property.who_to_charge_renew_tenant,
    property_state: data.property.state,
    property_address: `${data.property.full_address}, ${data.property.city_area} ${data.property.local_government}, ${data.property.state}`,
    propertyId: data.property.id,
    requestCallBack: convertToYesNo(Number(data.property.request_call_back)),
    vehicleRecord: convertToYesNo(Number(data.property.vehicle_record)),
    bookVisitor: convertToYesNo(Number(data.property.book_visitors)),
    total_package: data.total_package,
    en_suit: data.en_suit,
    prepaid: data.prepaid,
    wardrobe: data.wardrobe,
    property_document: data.property_document || undefined,
    rent_penalty_setting: data.rent_penalty_setting || undefined,
    occupant: occupant
      ? {
          id: occupant.id,
          name: occupant.name,
          email: occupant.email,
          userTag: occupant.userTag,
          avatar: occupant.avatar || empty,
          gender: occupant.gender,
          birthday: occupant.birthday,
          religion: occupant.religion,
          phone: occupant.phone,
          maritalStatus: occupant.maritalStatus,
          address: occupant.address,
          city: occupant.city,
          state: occupant.state,
          lg: occupant.lg,
          badgeColor:
            occupant.user_tier || occupant.tier
              ? tierColorMap[
                  (occupant?.user_tier ||
                    occupant.tier) as keyof typeof tierColorMap
                ]
              : undefined,
        }
      : undefined,
    previous_records: previous_records ? previous_records : undefined,
    previous_tenants: data.previous_tenants ? data.previous_tenants : undefined,
    pending_invoice: pending_invoice || undefined,
    unpaid_invoice: unpaid_invoice || undefined,
    current_records,
  };

  // Conditionally include fee fields only if valid
  const feeFields: { [key: string]: string | undefined } = {
    newTenantPrice: formatFee(data.fee_amount, data.property.currency),
    inspectionFee: formatFee(data.inspection_fee, data.property.currency),
    legalFee: formatFee(data.legal_fee, data.property.currency),
    vat_amount: formatFee(data.user.vat_amount, data.property.currency),
    renew_vat_amount: formatFee(
      data.user.renew_vat_amount,
      data.property.currency
    ),
    renewalTenantPrice: formatFee(
      data.renew_fee_amount,
      data.property.currency
    ),
    renew_service_charge: formatFee(
      data.renew_service_charge,
      data.property.currency
    ),
    renew_other_charge: formatFee(
      data.renew_other_charge,
      data.property.currency
    ),
    renew_security_fee: formatFee(
      data.renew_security_fee,
      data.property.currency
    ),
    renew_agency_fee: formatFee(data.renew_agency_fee, data.property.currency),
    management_fee: formatFee(data.management_fee, data.property.currency),
    caution_fee: formatFee(data.caution_fee, data.property.currency),
    security_fee: formatFee(data.security_fee, data.property.currency),
    other_charge: formatFee(data.other_charge, data.property.currency),
    unitAgentFee: formatFee(data.agency_fee, data.property.currency),
    service_charge: formatFee(data.service_charge, data.property.currency),
  };

  // Merge only defined fee fields into the transformed data
  const validFeeFields = Object.fromEntries(
    Object.entries(feeFields).filter(([_, value]) => value !== undefined)
  );

  return {
    ...transformedData,
    ...validFeeFields,
  };
};

// Helper function to format and validate fee amounts
export const formatFee = (
  amount: string | number | undefined | null,
  currency: string
): string | undefined => {
  if (!amount || amount === "") return undefined; // Skip undefined, null, or empty string
  const parsedAmount = parseFloat(amount.toString());
  if (isNaN(parsedAmount) || parsedAmount === 0) return undefined; // Skip NaN or zero
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";
  return `${currencySymbol}${formatNumber(parsedAmount)}`;
};

interface RentPenaltySettings {
  daily?: number;
  weekly?: number;
  monthly?: number;
  quarterly?: number;
  yearly?: number;
  biennially?: number;
  triennially?: number;
  quadrennial?: number;
  quinquennial?: number;
  sexennial?: number;
  septennial?: number;
  octennial?: number;
  nonennial?: number;
  decennial?: number;
}




export const calculateRentPenalty = (
  chargePenalty: boolean,
  rentPenaltySettings: Record<string, number>,
  rentAmount: number,
  feePeriod: RentPeriod,
  dueDate: string
): number => {
  if (
    !chargePenalty ||
    !rentPenaltySettings ||
    !rentAmount ||
    !feePeriod ||
    !dueDate
  ) {
    console.log("Penalty not applicable:", {
      chargePenalty,
      rentPenaltySettings,
      rentAmount,
      feePeriod,
      dueDate,
    });
    return 0;
  }

  const penaltyPeriods = calculatePenaltyPeriods(dueDate, feePeriod);
  if (penaltyPeriods <= 0) {
    console.log("No penalty periods:", { penaltyPeriods, dueDate, feePeriod });
    return 0;
  }

  const penaltyPercentage = rentPenaltySettings[feePeriod] || 0;
  if (penaltyPercentage <= 0) {
    console.log("No penalty percentage for period:", feePeriod);
    return 0;
  }

  console.log("rentAmount", rentAmount);
  console.log("penaltyPercentage", penaltyPercentage);
  console.log("penaltyPeriods", penaltyPeriods);
  
  // Calculate penalty: (rent amount × penalty percentage ÷ 100) × number of penalty periods
  const penaltyPerPeriod = rentAmount * (penaltyPercentage / 100);
  const totalPenalty = penaltyPerPeriod * penaltyPeriods;

  console.log("Penalty calculation:", {
    penaltyPerPeriod,
    penaltyPeriods,
    totalPenalty,
  });

  return totalPenalty;
};

export const calculatePenaltyPeriods = (
  dueDate: string,
  period: RentPeriod
): number => {
  const now = dayjs();
  const due = dayjs(dueDate, "DD/MM/YYYY");

  if (!due.isValid() || now.isBefore(due) || now.isSame(due, "day")) {
    return 0;
  }

  // First calculate the base overdue periods (days)
  const overdueDays = now.diff(due, "day");
  
  console.log("calculatePenaltyPeriods BASE:", {
    dueDate,
    period,
    overdueDays,
    now: now.format("DD/MM/YYYY"),
    due: due.format("DD/MM/YYYY")
  });

  if (overdueDays <= 0) {
    return 0;
  }

  // Calculate penalty periods based on your EXACT specifications using overdue days:
  switch (period) {
    case "daily":
      // "Select the percentage to be charged per hour on late rent"
      // Overdue days × 24 hours per day = total penalty hours
      const penaltyHours = overdueDays * 24;
      console.log("Daily penalty calculation:", {
        overdueDays,
        hoursPerDay: 24,
        penaltyHours
      });
      return Math.max(1, penaltyHours);
    
    case "weekly":
      // "Select the percentage to be charged per daily on late rent"
      // Use the overdue days directly
      console.log("Weekly penalty calculation:", {
        overdueDays,
        penaltyPeriods: overdueDays
      });
      return Math.max(1, overdueDays);
    
    case "monthly":
      // "Select the percentage to be charged per weekly on late rent"
      // Overdue days ÷ 7 days per week = penalty weeks
      const penaltyWeeks = Math.ceil(overdueDays / 7);
      console.log("Monthly penalty calculation:", {
        overdueDays,
        daysPerWeek: 7,
        penaltyWeeks
      });
      return Math.max(1, penaltyWeeks);
    
    case "quarterly":
      // "Select the percentage to be charged per monthly on late rent"
      // Use dayjs month difference for accuracy
      const penaltyMonths = now.diff(due, "month");
      console.log("Quarterly penalty calculation:", {
        penaltyMonths
      });
      return Math.max(1, penaltyMonths);
    
    case "yearly":
      // "Select the percentage to be charged per quarterly on late rent"
      // Use dayjs month difference ÷ 3 months per quarter
      const totalMonths = now.diff(due, "month");
      const penaltyQuarters = Math.ceil(totalMonths / 3);
      console.log("Yearly penalty calculation:", {
        totalMonths,
        monthsPerQuarter: 3,
        penaltyQuarters
      });
      return Math.max(1, penaltyQuarters);
    
    case "biennially":
      // "Select the percentage to be charged per yearly on late rent"
      const penaltyYears = now.diff(due, "year");
      return Math.max(1, penaltyYears);
    
    case "triennially":
      // "Select the percentage to be charged per biennially on late rent"
      const totalYears = now.diff(due, "year");
      const penaltyBienniums = Math.ceil(totalYears / 2);
      return Math.max(1, penaltyBienniums);
    
    case "quadrennial":
      // "Select the percentage to be charged per triennially on late rent"
      const yearsForTriennium = now.diff(due, "year");
      const penaltyTrienniums = Math.ceil(yearsForTriennium / 3);
      return Math.max(1, penaltyTrienniums);
    
    case "quinquennial":
      // "Select the percentage to be charged per quadrennial on late rent"
      const yearsForQuadrennial = now.diff(due, "year");
      const penaltyQuadrennials = Math.ceil(yearsForQuadrennial / 4);
      return Math.max(1, penaltyQuadrennials);
    
    case "sexennial":
      // "Select the percentage to be charged per quinquennial on late rent"
      const yearsForQuinquennial = now.diff(due, "year");
      const penaltyQuinquennials = Math.ceil(yearsForQuinquennial / 5);
      return Math.max(1, penaltyQuinquennials);
    
    case "septennial":
      // "Select the percentage to be charged per sexennial on late rent"
      const yearsForSexennial = now.diff(due, "year");
      const penaltySexennials = Math.ceil(yearsForSexennial / 6);
      return Math.max(1, penaltySexennials);
    
    case "octennial":
      // "Select the percentage to be charged per septennial on late rent"
      const yearsForSeptennial = now.diff(due, "year");
      const penaltySeptennials = Math.ceil(yearsForSeptennial / 7);
      return Math.max(1, penaltySeptennials);
    
    case "nonennial":
      // "Select the percentage to be charged per octennial on late rent"
      const yearsForOctennial = now.diff(due, "year");
      const penaltyOctennials = Math.ceil(yearsForOctennial / 8);
      return Math.max(1, penaltyOctennials);
    
    case "decennial":
      // "Select the percentage to be charged per nonennial on late rent"
      const yearsForNonennial = now.diff(due, "year");
      const penaltyNonennials = Math.ceil(yearsForNonennial / 9);
      return Math.max(1, penaltyNonennials);
    
    default:
      return 0;
  }
};

export const calculateOverduePeriods = (
  dueDate: string,
  period: RentPeriod
): number => {
  const now = dayjs();
  const due = dayjs(dueDate, "DD/MM/YYYY");

  console.log("calculateOverduePeriods inputs:", {
    dueDate,
    parsedDue: due.format("DD/MM/YYYY"),
    now: now.format("DD/MM/YYYY"),
    period,
    isOverdue: now.isAfter(due),
  });

  if (!due.isValid() || now.isBefore(due) || now.isSame(due, "day")) {
    console.log("Not overdue or invalid date:", {
      dueDate,
      isValid: due.isValid(),
    });
    return 0;
  }

  // Calculate how many full rent periods are overdue
  switch (period) {
    case "daily":
      return now.diff(due, "day");
    
    case "weekly":
      return Math.floor(now.diff(due, "week"));
    
    case "monthly":
      return Math.floor(now.diff(due, "month"));
    
    case "quarterly":
      return Math.floor(now.diff(due, "month") / 3);
    
    case "yearly":
      return Math.floor(now.diff(due, "year"));
    
    case "biennially":
      return Math.floor(now.diff(due, "year") / 2);
    
    case "triennially":
      return Math.floor(now.diff(due, "year") / 3);
    
    case "quadrennial":
      return Math.floor(now.diff(due, "year") / 4);
    
    case "quinquennial":
      return Math.floor(now.diff(due, "year") / 5);
    
    case "sexennial":
      return Math.floor(now.diff(due, "year") / 6);
    
    case "septennial":
      return Math.floor(now.diff(due, "year") / 7);
    
    case "octennial":
      return Math.floor(now.diff(due, "year") / 8);
    
    case "nonennial":
      return Math.floor(now.diff(due, "year") / 9);
    
    case "decennial":
      return Math.floor(now.diff(due, "year") / 10);
    
    default:
      console.log("Unknown period:", period);
      return 0;
  }
};


