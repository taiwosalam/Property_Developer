import { getAllStates } from "@/utils/states";
import { currencySymbols } from "@/utils/number-formatter";
import { type PropertyCardProps } from "@/components/Management/Properties/property-card";

export const initialState: PropertiesPageState = {
  total_pages: 1,
  current_page: 1,
  total_properties: 0,
  new_properties_count: 0,
  total_rental_properties: 0,
  new_rental_properties_count: 0,
  total_facility_properties: 0,
  new_facility_properties_count: 0,
  properties: [],
};
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



export interface PropertiesPageState {
  total_pages: number;
  current_page: number;
  total_properties: number;
  new_properties_count: number;
  total_rental_properties: number;
  new_rental_properties_count: number;
  total_facility_properties: number;
  new_facility_properties_count: number;
  properties: PropertyCardProps[];
}

export interface PropertiesApiResponse {
  // property_count: number;
  // new_properties_count: number;
  // total_rental_properties: number;
  // new_rental_properties_count: number;
  // total_facility_properties: number;
  // new_facility_properties_count: number;
  // purple never add these to the response
  data: {
    current_page: number;
    last_page: number;
    data: {
      id: string;
      video_link: string;
      title: string;
      state: string;
      local_government: string;
      city_area: string;
      full_address: string;
      images: string[];
      units_count: number;
      unit_images_count: number;
      settings: [
        {
          currency: keyof typeof currencySymbols;
        }
      ];
    }[];
  };
}

export const transformPropertiesApiResponse = (
  response: PropertiesApiResponse
): PropertiesPageState => {
  const { data } = response;
  return {
    total_pages: data.last_page,
    current_page: data.current_page,
    total_properties: 0, // backend shit
    new_properties_count: 0, // backend shit
    total_rental_properties: 0, // backend shit
    new_rental_properties_count: 0, // backend shit
    total_facility_properties: 0, // backend shit
    new_facility_properties_count: 0, // backend shit
    properties: data.data.map((p) => ({
      id: p.id,
      images: p.images,
      property_name: p.title,
      total_units: p.units_count,
      address: `${p.full_address}, ${p.city_area}, ${p.local_government}, ${p.state}`,
      total_unit_pictures: p.unit_images_count,
      hasVideo: p.video_link ? true : false,
      property_type: "rental", // backend shit
      annualReturns: 0, // backend shit
      annualIncome: 0, // backend shit
      mobile_tenants: 0, // backend shit
      web_tenants: 0, // backend shit
      branch: "", // backend shit
      accountOfficer: "", // backend shit
      last_updated: "", // backend shit
      owing_units: 0, // backend shit
      available_units: 0, // backend shit
      currency: p.settings[0].currency,
      isClickable: true,
      viewOnly: false,
    })),
  };
};
