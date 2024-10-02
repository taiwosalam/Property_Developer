export interface StateType {
  selectedState: string;
  selectedLGA: string;
  selectedCity: string;
  localGovernments: string[];
  cities: string[];
  staff: { id: string; label: string }[];
  images: string[];
  branchOptions: string[];
  inventoryOptions: string[];
  landlordOptions: string[];
  accountOfficerOptions: string[];
  resetKey: number;
}


