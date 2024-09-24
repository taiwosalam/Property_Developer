type Branch = {
  branch_title: string;
  branch_full_address: string;
  branch_image: string | null;
  city: string;
  state: string;
  local_government: string;
  branch_wallet: string;
  branch_description: string;
};

type Properties = {
  total: number;
  new_this_month: number;
};

type Landlords = {
  total: number;
  new_this_month: number;
};

type Tenants = {
  total: number;
  new_this_month: number;
};

type Staff = any[]; // Assuming the structure of staff is unknown. Change `any` to a specific type if needed.

type PropertyList = any[]; // Assuming the structure of property_list is unknown. Change `any` to a specific type if needed.

export type ResponseType = {
  branch: Branch | null | undefined;
  properties: Properties;
  landlords: Landlords;
  tenants: Tenants;
  staff: Staff;
  property_list: PropertyList;
};
