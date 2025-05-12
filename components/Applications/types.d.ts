export interface ApplicationCardProps {
  type?: "staff" | "guest";
  status: "flagged" | "unflagged";

  data?: {
    id: number;
    images: string[];
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
  };
}
