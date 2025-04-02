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

type Inspection = {
  id: number;
  inspection_type: "physical_inspection" | "virtual_inspection";
  inspection_date: string;
  inspection_time: string;
  description: string;
  booked_by: string;
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

export interface InspectionPage {
  total_inspections: number;
  total_months: number;
  total_physical: number;
  total_physical_month: number;
  total_virtual: number;
  total_virtual_month: number;
  card: {
    id: number;
    property_name: string;
    price: string;
    address: string;
    yearly_price: string;
    inspection_type: "virtual_inspection" | "physical_inspection";
    booked_by: string;
    inspection_date: string;
    inspection_time: string;
  }[];
}
