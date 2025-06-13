interface Feature {
  label: string;
  key: string;
  value: number;
}

interface Pricing {
  perMonth: string;
  perYear: string;
  lifetime: string;
}

interface Plan {
  id: number;
  planName: string;
  description: string;
  pricing: Pricing;
  duration: "monthly" | "yearly" | "lifetime";
  discount_percentage: number;
  features: Feature[];
  is_free: number;
}

export interface PropertyManagerSubsApiResponseTypes {
  status: string;
  message: string;
  data: Plan[];
}

export interface PropertyManagerSubsTransformedPlan {
  id: number;
  planTitle: string;
  desc: string;
  planFor?: string;
  price: string;
  discount: string;
  discountText: string;
  duration: string;
  features: string[];
  isFree: boolean;
  isLifeTimePlan: boolean;
  billingType: "monthly" | "yearly";
  quantity: number;
  baseMonthlyPrice: number;
}

