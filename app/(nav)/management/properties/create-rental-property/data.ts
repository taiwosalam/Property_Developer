// Imports

export interface StateType {
  state: string;
  city: string;
  lga: string;
  selectedBranch: string;
  staff: { id: string; label: string }[];
  staffOptions: string[];
  images: string[];
  branchOptions: string[];
  inventoryOptions: string[];
  landlordOptions: string[];
  accountOfficerOptions: string[];
  resetKey: number;
}

export const proerty_state_data: StateType = {
  state: "",
  city: "",
  lga: "",
  selectedBranch: "",
  staff: [],
  staffOptions: [],
  images: [],
  branchOptions: [],
  inventoryOptions: [],
  landlordOptions: [],
  accountOfficerOptions: [],
  resetKey: 0,
};

export const addProperty = async () => {};
