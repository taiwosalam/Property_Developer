// types.ts
// (Other interfaces remain the same as provided)
export interface UnitImage {
  id: number;
  path: string;
  is_default: number;
  mediaable_type: string;
  mediaable_id: number;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface AccountOfficer {
  id: string | null;
  name: string | null;
  email: string | null;
}

export interface PropertyDetails {
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
  rent_penalty: boolean;
  fee_penalty: boolean;
  request_call_back: boolean;
  book_visitors: boolean;
  vehicle_record: boolean;
  group_chat: boolean;
  currency: string;
}

export interface Unit {
  id: number;
  user_id: number;
  property_id: number;
  tenant_id: number | null;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  measurement: string;
  bedroom: string;
  bathroom: string;
  toilet: number;
  facilities: string | null;
  en_suit: boolean;
  prepaid: boolean;
  wardrobe: boolean;
  pet_allowed: boolean;
  total_area_sqm: string;
  number_of: string;
  fee_period: string;
  fee_amount: string;
  security_fee: string;
  service_charge: string;
  agency_fee: string;
  legal_fee: string;
  caution_fee: string;
  inspection_fee: string;
  management_fee: string | null;
  other_charge: string;
  negotiation: boolean;
  total_package: string;
  renew_fee_period: string;
  renew_fee_amount: string;
  renew_service_charge: string;
  renew_security_fee: string;
  renew_other_charge: string;
  renew_total_package: string;
  is_active: string;
  published: boolean;
  status: string;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  images: UnitImage[];
  total_inventory: number;
  occupant: any;
  property: PropertyDetails;
}

export interface Inventory {
  id: number;
  property_id: number;
  title: string;
  property_name: string;
  video: string;
  branch_id: number;
  branch_name: string;
  account_officer: AccountOfficer;
  created_date: string;
  edited_date: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface InventoryApiResponse {
  status: string;
  statusCode: number;
  inventory: Inventory;
  unit: Unit[];
  pagination: Pagination;
  message: string;
}

export interface InventoryData {
  title: string;
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_manager: string;
  branch_id: string;
  video: string;
  total_unit?: number;
}

export interface InventoryUnitData {
  unitName: string;
  unitId: string;
  unitDetails: string;
  status: "vacant" | "occupied" | "relocate";
  images: string[];
  total_inventory: number;
  inventoryId: number;
}

export interface InventoryUnitPageData {
  pagination: {
    current_page: number;
    total_pages: number;
  };
  propertiy_details: InventoryData;
  inventory_unit_data: InventoryUnitData[];
}

export interface InventoryFetchData {
  data: {
    id: string;
    status: string;
    total_inventory: number;
    unit_name: string;
    video: string;
    branch_name: string;
    branch_id: string;
    created_date: string;
    edited_date: string;
    property_title: string;
    account_officer: string;
    items: {
      id: string;
      description: string;
      image: any[];
      unit: string;
      condition: string;
    };
  };
}
