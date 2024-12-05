import { getAllStates } from "@/utils/states";
import { currencySymbols } from "@/utils/number-formatter";
import { type PropertyCardProps } from "@/components/Management/Properties/property-card";
import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import moment from "moment";

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

export const propertyFilterOptionsMenu: FilterOptionMenu[] = [
  {
    label: "State",
    value: states.map((state) => ({
      label: state,
      value: state.toLowerCase(),
    })),
  },
  {
    radio: true,
    label: "Property Type",
    value: [
      { label: "Rental Property", value: "rental" },
      { label: "Facility Property", value: "facility" },
      { label: "All properties", value: "all" },
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
      images: {
        id: string;
        image_path: string;
      }[];
      units_count: number;
      unit_images_count: number;
      property_type: "rental" | "gated_estate";
      updated_at: Date;
      settings: [
        {
          currency: keyof typeof currencySymbols | null;
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
    properties: data.data.map((p) => {
      const updatedAt = moment(p.updated_at);
      let lastUpdated;
      const now = moment();
      if (now.diff(updatedAt, "days") < 7) {
        lastUpdated = updatedAt.fromNow();
      } else {
        lastUpdated = updatedAt.format("DD/MM/YYYY");
      }
      return {
        id: p.id,
        images: p.images.map((image) => image.image_path),
        property_name: p.title,
        total_units: p.units_count,
        address: `${p.full_address}, ${p.city_area}, ${p.local_government}, ${p.state}`,
        total_unit_pictures: p.unit_images_count,
        hasVideo: p.video_link ? true : false,
        property_type: p.property_type === "rental" ? "rental" : "facility",
        annualReturns: 0, // backend shit
        annualIncome: 0, // backend shit
        mobile_tenants: 0, // backend shit
        web_tenants: 0, // backend shit
        branch: "", // backend shit
        accountOfficer: "", // backend shit
        last_updated: lastUpdated,
        owing_units: 0, // backend shit
        available_units: 0, // backend shit
        currency: p.settings[0].currency || "naira",
        isClickable: true,
        viewOnly: false,
      };
    }),
  };
};

export interface PropertiesRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  state?: string;
  start_date?: string;
  end_date?: string;
  property_type?: string;
  branch_id?: string;
}
