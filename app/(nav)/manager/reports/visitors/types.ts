export type VisitorRequestResponse = {
  message: string;
  data: {
    count: {
      total_requests: number;
      current_month_requests: number;
      total_checked_in: number;
      current_month_checked_in: number;
      total_checked_out: number;
      current_month_checked_out: number;
    };
    visitors: {
      current_page: number;
      data: Visitor[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: PaginationLink[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
};

type Visitor = {
  id: number;
  request_id: string;
  visitor_name: string;
  request_date: string; // ISO string
  check_in_time: string | null; // ISO string or null
  check_out_time: string | null; // ISO string or null
  branch_name: string;
  status: "completed" | "pending" | "in-progress" | "decline" | "checked_in" | "cancelled";
  picture: string;
  userName: string
  secret_question: string;
  secret_answer: string;
  visitor_number: string;
  property_name: string;
 
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};
