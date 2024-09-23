export interface Branch {
  id: number;
  company_id: number;
  branch_title: string;
  state: string;
  local_government: string;
  city: string;
  manager_id: number | null;
  branch_full_address: string;
  branch_wallet: string;
  branch_description: string;
  avatar: string | null;
  picture: string;
  created_at: string;
  updated_at: string;
  picture_url: string;
}
