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

export type SingleBranchResponseType = {
  data: {
    branch: {
      id: string;
      branch_name: string;
      state: string;
      local_government: string;
      city: string;
      branch_address: string;
      branch_image: string | null; //to be added later
      // branch_wallet: string; //to be added later
      branch_desc: string;
    };
  };
};
