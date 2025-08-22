export interface MarqueeApiItem {
  id: number;
  start_date: string;
  due_date: string;
  speed: "very fast" | "fast" | "normal" | "slow";
  section: string[];
  link: string;
  link_text: string;
  role: string[];
  timer: string;
  text: string;
  created_at: string;
  updated_at: string;
  duration: string;
  expire_date: string;
}

export interface MarqueeApiResponse {
  current_page: number;
  data: MarqueeApiItem[];
  total: number;
}

export interface MarqueeContent {
  id: string;
  text: string;
  url?: string;
  urlText?: string;
  speed: number;
  priority: number;
  source: "api" | "dynamic" | "system";
}

export interface DynamicMarqueeConfig {
  propertyCount?: number;
  unitCount?: number;
  tenantCount?: number;
  currentPlan?: string;
  expiryDays?: number;
}
