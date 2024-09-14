export interface StateType {
  selectedState: string;
  selectedLGA: string;
  selectedCity: string;
  localGovernments: string[];
  cities: string[];
  staff: { id: string; label: string }[];
  images: File[];
  branchOptions: string[];
  inventoryOptions: string[];
  landlordOptions: string[];
  accountOfficerOptions: string[];
  resetKey: number;
}


