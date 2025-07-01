export interface CreateStaffModalProps {
  branchId: string;
  hasManager: boolean;
}

export interface BranchActivitiesCardProps {
  className?: string;
  branchId: number | string;
}

export interface CalendarEventItem {
  date: string;
  time?: string;
  type: string;
  creator: string;
  description: string;
  branch: string | null;
  property: string;
  accountOfficer: string | null;
}

export interface CalendarEventsApiResponse {
  status: boolean;
  data: RawActivity[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface RawActivity {
  date: string;
  time?: string;
  type: string;
  description: string;
  creator: string;
  branch: string;
  branch_id: number;
  property: string;
  property_id: number;
  accountOfficer: string | null;
  model_id: number;
  model_type: string;
}

export interface ActivityDisplay {
  label: string;
  description: string;
  time: string;
  color: string;
}
