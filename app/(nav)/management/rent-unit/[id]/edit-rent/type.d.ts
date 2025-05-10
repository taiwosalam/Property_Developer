export interface Property {
    id: number;
    video_link: string;
    title: string;
    has_unit?: boolean;
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
    group_chat: number;
    rent_penalty: number;
    fee_penalty: number;
    request_call_back: number;
    book_visitors: number;
    vehicle_record: number;
    active_vat: number;
    currency: string;
    coordinate: string;
    management_fee: number;
    fee_period: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface PropertyListResponse {
    status: string;
    message: string;
    data: Property[];
  }
  