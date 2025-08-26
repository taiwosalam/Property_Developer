export interface ApplicationCardProps {
  type?: "pending" | "evaluated" | "approved" | "rejected" | "mobile";
  status: "flagged" | "unflagged";
  pd?: boolean;
  data?: {
    id: number;
    images: string[];
    photo: string;
    full_name: string;
    tier_id: number;
    user_id: string;
    user_type: string;
    email: string;
    property_name: string;
    address: string;
    phone_number: string | null;
    date: string;
    total_package: string;
    yearly_amount: string;
    period_type: string;
    currency: string;
    renew_fee_period: string;

    flag_details?: {
      flagger_id: number;
      flagger_name: string;
      email: string;
      phone: string;
      tier_id: number;
      picture: string | null;
      is_flagged: boolean;
      reason: string | null;
      company_name: string;
      appeal_reason: string | null;
      status: "rejected" | "pending" | "evaluated" | "approved";
    }[];
  };
}
