import { getAllStates } from "@/utils/states";

const states = getAllStates();

export const propertyFilterOptionsWithDropdowns = [
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
  {
    label: "State",
    value: states.map((state) => ({
      label: state,
      value: state.toLowerCase(),
    })),
  },
];

export const propertyFilterOptionsRadio = [
  {
    label: "Property Type",
    value: [
      { label: "gated estate", value: "gated_estate" },
      { label: "single Property", value: "single_Property" },
      { label: "All properties", value: "all_properties" },
    ],
  },
];

export interface Property {
  id: number;
  propertyId: number;
  address: string;
}

export interface PropertiesPageState {
  total_pages: number;
  current_page: number;
  total_properties: number;
  new_properties_count: number;
  total_rental_properties: number;
  new_rental_properties_count: number;
  total_facility_properties: number;
  new_facility_properties_count: number;
  properties: any[];
}

export interface PropertiesApiResponse {
  // property_count: number;
  // new_properties_count: number;
  // total_rental_properties: number;
  // new_rental_properties_count: number;
  // total_facility_properties: number;
  // new_facility_properties_count: number;
  data: {
    current_page: number;
    last_page: number;
    data: any[];
  };
}

export const transformPropertiesApiResponse = (
  response: PropertiesApiResponse
): PropertiesPageState => {
  const { data } = response;
  return {
    total_pages: data.last_page,
    current_page: data.current_page,
    total_properties: 0, // to be added
    new_properties_count: 0, // to be added
    total_rental_properties: 0, // to be added
    new_rental_properties_count: 0, // to be added
    total_facility_properties: 0, // to be added
    new_facility_properties_count: 0, // to be added
    properties: data.data,
  };
};
