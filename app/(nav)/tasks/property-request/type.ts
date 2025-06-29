export interface PropertyRequestData {
  id: number;
  user_id: number;
  image: string | null;
  name: string;
  phone: string;
  budget_min: number | null;
  budget_max: number | null;
  property_type: string;
  state: string;
  lga: string;
  category: string;
  request_type: string;
  property_sub_type: string;
  location: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyRequestApi {
  status: "success";
  total_requests_this_month: number;
  total_requests_overall: number;
  data: PropertyRequestData[];
}
