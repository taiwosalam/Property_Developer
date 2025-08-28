

export type CallRequestApiResponse = {
  status: "success";
  total_call: number;
  total_call_month: number;
  total_pending_call: number;
  total_pending_call_month: number;
  total_completed_call: number;
  total_completed_call_month: number;
  data: CallItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

type CallItem = {
  id: number;
  request_id: string;
  date: string; // format: "DD/MM/YYYY"
  user: {
    id: string;
    user_id: number;
    name: string;
    tier: number;
    photo: string;
    phone: string;
  };
  property: string;
  branch: string;
  unit_name: string;
  property_address: string;
  account_officer: string;
  status: "pending" | "completed"// you can replace with a full union if known
  type: "tenant" | "landlord" | string; // adjust based on known values
  resolved_by: string;
  resolved_date: string; // format: "DD/MM/YYYY hh:mm a"
};
