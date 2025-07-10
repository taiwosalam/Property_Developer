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
  user: {
    id: number;
    name: string;
    tier_id: number;
    picture: string;
  };
  inventory: {
    id: null;
    title: null;
    video: null;
    attributes: null;
  };
  user_id: number;
  property_name: string;
  state: string;
  user_name: string;
  profile_picture: string;
  accountOfficer: string;
  tier_id: number;
  unit_name: string;
  is_inventory: false;
  is_examine: false;
  is_maintain: false;
  inventory_at: null;
  examined_at: null;
  maintain_at: null;
  rejected_at: null;
  inventory_by: null;
  examine_by: null;
  maintain_by: null;
  branch_name: string;
  company_id: number;
  deposit_amount: string;
  caution_deposits_details: string;
  request_from: string;
  refunded_amount: string;
  status: "pending" | "completed" | "progress";
  created_at: string;
  updated_at: string;
 
};
