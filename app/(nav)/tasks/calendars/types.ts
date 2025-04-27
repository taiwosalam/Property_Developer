
export interface CalendarEventsApiResponse {
    status: boolean;
    data: {
        date: string;
        time?: string; // Only present for some items
        type: string;
        creator: string;
        description: string;
        branch: string | null;
        property: string;
        accountOfficer: string | null;
    }[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        total_pages: number;
    }
  }
  
  export interface CalendarItem {
    date: string;
    time?: string; // Only present for some items
    type: string;
    creator: string;
    description: string;
    branch: string | null;
    property: string;
    accountOfficer: string | null;
  }
  
  export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  