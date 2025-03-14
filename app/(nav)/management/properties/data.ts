import { getAllStates } from "@/utils/states";
import { currencySymbols } from "@/utils/number-formatter";
import { type PropertyCardProps } from "@/components/Management/Properties/property-card";
import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import moment from "moment";
import { UnitStatusColors } from "@/components/Management/Properties/property-preview";

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
      { label: "All properties", value: "all", isChecked: true },
      { label: "Rental Property", value: "rental" },
      { label: "Facility Property", value: "facility" },
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

export interface UnitDataObject {
  id: string;
  default_image?: string;
  // user_id: string;
  // property_id: string;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  measurement: string;
  bedroom?: string;
  bathroom?: string;
  toilet?: string;
  facilities: string[] | null;
  en_suit?: 1 | 0;
  prepaid?: 1 | 0;
  wardrobe?: 1 | 0;
  pet_allowed?: 1 | 0;
  total_area_sqm: string;
  number_of?: string;
  fee_period: string;
  fee_amount: string;
  security_fee: string;
  service_charge: string;
  agency_fee?: string;
  legal_fee?: string;
  caution_fee?: string;
  inspection_fee?: string;
  management_fee?: string;
  other_charge?: string;
  negotiation?: 1 | 0;
  total_package?: string;
  renew_fee_period?: string;
  renew_fee_amount?: string;
  renew_service_charge?: string;
  renew_other_charge?: string;
  renew_total_package?: string;
  is_active: keyof typeof UnitStatusColors;
  // status: "pending";
  // reject_reason: null;
  // created_at: "2024-12-11T10:02:27.000000Z";
  // updated_at: "2024-12-11T10:02:27.000000Z";
  images: {
    id: string;
    path: string;
    is_default?: number;
  }[];
}

export interface PropertyDataObject {
  id: string;
  video_link?: string;
  title: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string;
  inventory: any;
  property_type: string;
  fee_period: string;
  updated_at: Date;
  currency?: keyof typeof currencySymbols;
  units_count: number;
  total_unit_images: number | null;
  images: {
    id: string;
    path: string;
    is_default: number;
  }[];
  branch: {
    id: string;
    branch_name: string;
  } | null;
  staff:
    | {
        id: string;
        staff_role: string;
        user: any;
        estate_title: string;
        title: string;
      }[]
    | null;
  // staff: string[]; //check after adding staff
  agency_fee: number;
  management_fee: number;
  caution_deposit?: string;
  group_chat: 1 | 0;
  who_to_charge_new_tenant: string;
  who_to_charge_renew_tenant: string;
  book_visitors: 1 | 0;
  vehicle_record: 1 | 0;
  request_call_back: 1 | 0;
  active_vat: 1 | 0;
  rent_penalty: 1 | 0;
  fee_penalty: 1 | 0;
  coordinate: string;
  units: UnitDataObject[];
  landlord_id: string;
}

export interface PropertiesApiResponse {
  data: {
    total_property: number;
    rental_property: number;
    facility_property: number;
    current_month_property: number;
    current_month_rental_property: number;
    current_month_facility_property: number;
    properties: {
      current_page: number;
      last_page: number;
      data: PropertyDataObject[];
    };
  };
}

export interface PropertyFilterResponse {
  data: {
    current_page: number;
    last_page: number;
    data: PropertyDataObject[];
  };
}

export const transformPropertiesApiResponse = (
  response: PropertiesApiResponse | PropertyFilterResponse
): Partial<PropertiesPageState> => {
  const isPropertiesApiResponse = (
    response: any
  ): response is PropertiesApiResponse => {
    return "total_property" in response.data;
  };

  const propertiesData = isPropertiesApiResponse(response)
    ? response.data.properties
    : response.data;

  const transformedProperties: PropertyCardProps[] = propertiesData.data.map(
    (p) => {
      const updatedAt = moment(p.updated_at);
      let lastUpdated;
      const now = moment();
      if (now.diff(updatedAt, "days") < 7) {
        lastUpdated = updatedAt.fromNow();
      } else {
        lastUpdated = updatedAt.format("DD/MM/YYYY");
      }
      const totalReturns = p.units.reduce((sum, unit) => {
        return sum + parseFloat(unit.fee_amount);
      }, 0);
      const feePercentage =
        p.property_type === "rental" ? p.agency_fee : p.management_fee;

      const defaultImage =
        p.images && p.images.length > 0
          ? p.images.find((image) => image.is_default === 1)?.path ||
            p.images[0].path
          : undefined;

      // Extract the first account officer from the staff array
      const accountOfficerStaff = p?.staff?.find(
        (staffMember) => staffMember.staff_role === "account officer"
      );
      const accountOfficer = accountOfficerStaff
        ? `${accountOfficerStaff.title} ${accountOfficerStaff.user.name}`
        : "";
      return {
        id: p.id,
        images: p.images.map((image) => image.path) || [],
        default_image: defaultImage,
        property_name: p.title,
        address: `${p.full_address}, ${p.city_area}, ${p.local_government}, ${p.state}`,
        total_units: p.units_count,
        total_unit_pictures: p.total_unit_images,
        last_updated: lastUpdated,
        currency: p.currency as keyof typeof currencySymbols | undefined,
        hasVideo: !!p.video_link,
        property_type: p.property_type as "rental" | "facility",
        branch: p.branch?.branch_name,
        total_returns: totalReturns,
        total_income: (totalReturns * feePercentage) / 100,
        mobile_tenants: 0,
        web_tenants: 0,
        accountOfficer: accountOfficer,
        owing_units: 0,
        available_units: 0,
        isClickable: true,
        viewOnly: false,
      };
    }
  );

  if (isPropertiesApiResponse(response)) {
    return {
      total_pages: propertiesData.last_page,
      current_page: propertiesData.current_page,
      total_properties: response.data.total_property,
      new_properties_count: response.data.current_month_property,
      total_rental_properties: response.data.rental_property,
      new_rental_properties_count: response.data.current_month_rental_property,
      total_facility_properties: response.data.facility_property,
      new_facility_properties_count:
        response.data.current_month_facility_property,
      properties: transformedProperties,
    };
  } else {
    return {
      total_pages: propertiesData.last_page,
      current_page: propertiesData.current_page,
      properties: transformedProperties,
    };
  }
};

export interface PropertiesFilterParams {
  date_from?: string;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  staff_id?: string[];
  property_type?: "rental" | "facility";
  sort_by?: "desc";
  search?: string;
  // per_page?: number;
}
