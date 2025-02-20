interface ApiResponse {
  status: string;
  data: Data;
  message: string;
}

interface Data {
  id: number;
  property_id: number;
  property: string;
  landlord: string | null;
  picture: string | null;
  description: string;
  account_officer: string | null;
  account_officer_updated: string | null;
  total_amount: string;
  disbursement: Disbursement[];
  disburse_mode: string;
  created_at: string;
  updated_at: string;
}

interface Disbursement {
  amount: number;
  unit_id: number;
}

export interface ManageDisbursementPageData {
    disbursementId: string;
    property_name: string;
    unit_names: string[];
    landlord: string;
    // date: 
}