type VisitorRequestsResponse = {
  status: "success";
  total: number;
  month_total: number;
  month_pending: number;
  total_pending: number;
  month_completed: number;
  total_completed: number;
  data: VisitorRequest[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

type VisitorRequest = {
  id: number;
  request_id: string;
  user_id: number;
  user: {
    id: number;
    encodedId: string;
    picture: string;
    tier: number;
    name: string;
    email: string;
    phone: string;
    tenant: {
      units: {
        unit_name: string;
        property: {
          id: number;
          title: string;
          company_id: number;
          branch_name: string;
        };
      }[];
    };
  };
  visitor_name: string;
  visitor_number: string;
  secret_question: string;
  secret_answer: string;
  purpose: string;
  request_date: string;
  check_in_date: string | null;
  check_in_time: string | null;
  check_in_inventory: string;
  check_in_by: string | null;
  check_out_by: string | null;
  check_in_companion: string;
  check_out_date: string | null;
  check_out_time: string | null;
  check_out_inventory: string;
  check_out_companion: string;
  status: "completed" | "pending" | "in-progress" | "decline"; // Add more statuses as needed
  created_at: string;
  updated_at: string;
};
