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
  tenant_name?: string;
  expiry_date?: string;
  fee_amount: string;
  caution_fee: string;
  caution_deposit?: string;
  service_charge: string;
  unit_type: string;
  images: [];
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


export const transformRentUnitApiResponse = (
  response: RentUnitApiResponse
): RentUnitPageData => {
  const unitData = response.data.unit.data;
  return {
    stats: {
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
    },
    unit_data: unitData.map((unit: UnitData) => ({
      unit_title: unit.property.title,
      unit_name: unit.unit_name,
      unit_type: unit.unit_type,
      id: unit.id || "0",
      tenant_name: unit.tenant_name || "No name",
      expiry_date: unit.expiry_date || "No Expiry",
      rent: unit.fee_amount,
      caution_deposit: unit.caution_fee,
      service_charge: unit.service_charge,
      images: unit.images,
      is_active: unit.is_active,
      property_type: unit.property.property_type,
    }))
  };
}; 