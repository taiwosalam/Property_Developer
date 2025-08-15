interface Complaint {
  id: number | string;
  user_id: number;
  property_id: number;
  title: string;
  description: string;
  complaint_images: string[];
  tier_id: number;
  name: string;
  picture: string;
  comment_users: {
    profile_picture: string;
    name: string;
  }[];
  property_name: string;
  unit_name: string;
  status: string;
  progress: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ComplaintsResponse {
  message: string;
  total: number;
  total_pending: string;
  total_rejected: string;
  total_completed: string;
  total_approved: string | null;
  total_processing: string;
  total_month: string;
  total_month_pending: string;
  total_month_completed: string;
  total_month_rejected: string;
  total_month_approved: string | null;
  total_month_processing: string | null;
  stats: {
    total: number;
    pending: string;
    resolved: string;
    rejected: string;
    completed: string;
    approved: string;
    processing: string;
    monthly: {
      total: string;
      pending: string;
      resolved: string;
      rejected: string;
      completed: string;
      approved: string;
      processing: string;
    };
  };
  complaints: Complaint[];
  pagination: Pagination;
}

export interface ComplaintsPageData {
  total_complaints: number;
  total_month_complaints: number;
  total_completed: number;
  total_month_completed: number;
  total_rejected: number;
  total_month_rejected: number;
  total_processing: number;
  total_month_processing: number;
  complaints: {
    id: number | string;
    columnId: "processing" | "approved" | "rejected" | string;
    content: {
      messageCount: number;
      linkCount: number;
      userAvatars: string[];
      date: string;
      status?: string;
      progress?: number;
    };
    name: string;
    title: string;
    message: string;
    avatarSrc: string;
    tier: number;
    comment_count: number;
  }[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total: number;
  };
}

interface ComplaintDetail {
  id: number;
  title: string;
  unit_name: string;
  brief: string;
  description: string | null;
  complaint_by: string;
  tier: number;
  picture: string | null;
  property_title: string;
  property_state: string;
  property_lga: string;
  property_city: string;
  property_address: string;
  branch_id: number;
  landlord_agent: string;
  branch_name: string;
  account_officer: string | null;
  status: string;
  images: string[];
  approved_by: string | null;
  rejected_by: string | null;
  processed_by: string | null;
  progress: number;
  task_bar: {
    progress: string;
    text: string;
    approve_by: string;
    time: string;
    date: string;
  }[];
  notes: {
    date: string;
    text: string;
    time: string;
    title: string;
    note_by: string;
    assign_to: string;
    assign_to_type: string;
  }[];
  comments: ComplaintComment[];
  reminders: IReminder[];
  created_at: string;
  updated_at: string;
}

export interface IReminder {
  id: number;
  company_id: number;
  branch_id: number | null;
  complaint_id: string;
  user_id: number;
  title: string;
  note: string;
  reminder_date: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintDetailResponse {
  message: string;
  complaint: ComplaintDetail;
}

export interface ComplaintComment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    title: string;
    professional_title: string;
    picture: string;
  };
}

export interface ComplaintDetailsPageData {
  id: number;
  senderName: string;
  senderVerified: boolean;
  complaintTitle: string;
  propertyName: string;
  unitName?: string;
  propertyAddress: string;
  accountOfficer: string;
  branch: string;
  brief: string;
  tier: number;
  attachment: number;
}
