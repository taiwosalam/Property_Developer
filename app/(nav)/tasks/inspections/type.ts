export type InspectionDataApiResponse = {
  total_inspections: number;
  total_months: number;
  total_physical: number;
  total_physical_month: number;
  total_virtual: number;
  total_virtual_month: number;
  inspections: Inspection[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type Inspection = {
  id: number;
  inspection_type: "physical_inspection" | "virtual_inspection";
  inspection_date: string;
  inspection_time: string;
  description: string;
  booked_by: string;
  image: string | null;
  booked_by_id: number;
  phone: string;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  unit_fee_period: string;
  total_package: string;
  branch: string;
  property_name: string;
  full_address: string;
  state: string;
  local_government: string;
  city_area: string;
  created_at: string;
};

export interface InspectionPageType {
  total_inspections: number;
  total_months: number;
  total_physical: number;
  total_physical_month: number;
  total_virtual: number;
  total_virtual_month: number;
  total_page: number;
  current_page: number;
  card: {
    id: number;
    property_name: string;
    price: string;
    image: string | null;
    address: string;
    unit_fee_period: string;
    yearly_price: string;
    inspection_type: "virtual_inspection" | "physical_inspection";
    booked_by: string;
    inspection_date: string;
    inspection_time: string;
  }[];
}

export interface InspectionDetailsResponse {
    data: Inspection
}
