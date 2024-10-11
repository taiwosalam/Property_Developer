import { getAllStates } from "@/utils/states";
//
export interface RentAndUnitState {
  gridView: boolean;
  total_pages: number;
  current_page: number;
}
//

export const RentAndUnitFilters = [
  { label: "Single Property", value: "single-property" },
  { label: "Gated Eestate", value: "gated-estate" },
];

const allStates = getAllStates() || [];

export const RentAndUnitFiltersWithDropdown = [
  {
    label: "State",
    value: allStates.map((state) => ({
      label: state,
      value: state,
    })),
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
      { label: "Branch 3", value: "branch3" },
    ],
  },
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
];
