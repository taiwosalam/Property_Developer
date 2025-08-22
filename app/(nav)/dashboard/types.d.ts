

type ChartData = {
    date: string; // e.g., "2025-04-12"
    total_views: number;
    total_bookmarks: number;
    user: number;
  };
  
  type AnalyticsData = {
    property_count: number;
    month_count: number;
    vacant_unit: number;
    month_vacant_unit: number;
    expired_unit: number;
    month_expired_unit: number;
    landlord_count: number;
    month_landlord_count: number;
    tenant_count: number;
    month_tenant_count: number;
    listing_count: number;
    month_listing_count: number;
    complaint_count: number;
    month_complaint_count: number;
    invoice_count: number;
    month_invoice_count: number;
    inquiry_count: number;
    month_inquiry_count: number;
    invoices: any[]; // can be refined if you know the structure of invoices
    chart_data: ChartData[];
  };
  
  export type DashboardDataResponse = {
    status: "success";
    data: AnalyticsData;
  };
  