export type ICautionApiResponse = {
  status: "success";
  data: {
    data: DepositRequest[];
    stats: {
      total_request: number;
      total_month_request: number;
      total_completed: number;
      total_month_completed: number;
      total_pending: number;
      total_month_pending: number;
    };
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: false;
    };
  };
};

type DepositRequest = {
  id: number;
  user_id: number;
  property_name: string;
  user: {
    id: number;
    name: string;
    tier_id: number;
    profile: {
      picture: string;
    };
  };
  state: string;
  user_name: string;
  profile_picture: string;
  tier_id: number;
  unit_name: string;
  branch_name: string;
  company_id: number;
  deposit_amount: string;
  caution_deposits_details: string;
  request_from: string;
  refunded_amount: string;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
};
