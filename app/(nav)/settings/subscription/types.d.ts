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
  baseYearlyPrice: number;
  lifetimePrice: number;
}

export interface EnrollmentApiResponse {
  status: string;
  message: string;
  data: {
    company_name: string;
    company_logo: string;
    branch_count: number;
    staff_count: number;
    unit_count: number;
    owner_count: number;
    tenant_count: number;
    property_count: number;
    director_count: number;
    current_plan_name: string;
    current_plan_id: number;
    expire_date: string;
    total_enrollment_amount: string;
    auto_renew: number;
    enrollment_count: number;
    last_enrollment_amount: string;
    enrollments: {
      payment_id: string;
      id: number;
      company_id: number;
      subs_type: string;
      subs_package: string;
      source: string;
      period: string;
      date: string;
      amount: string;
      amount_paid: string;
      status: string;
      expire_date: string;
    }[];
    plan_pricing: {
      id: number;
      plan_name: string;
      month: string;
      year: string;
      lifetime: string;
      duration: string;
      discount: number;
    }[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}
