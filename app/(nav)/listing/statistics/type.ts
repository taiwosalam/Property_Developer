

type User = {
    id: number;
    unit_name: string;
    property_name: string;
    encodedId: string;
    name: string;
    email: string;
    phone: string | null;
    username: string | null;
    tier: number;
    referrer_code: string;
    photo: string | null;
    date: string; // ISO timestamp
  };
  
  type ChartData = {
    date: string; // e.g., "2025-04-12"
    total_views: number;
    total_bookmarks: number;
    user: number;
  };
  
export type ListingStatisticResponse = {
    status: "success";
    total_views: number;
    total_month_views: number;
    total_bookmarks: number;
    total_month_bookmarks: number;
    view_users: User[];
    bookmark_users: User[];
    chart_data: ChartData[];
  };
  