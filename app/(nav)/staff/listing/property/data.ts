import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import { PropertyCardProps } from "@/components/Management/Properties/property-card";
import moment from "moment";

export const listingPropertyFilter: FilterOptionMenu[] = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "Status",
    radio: true,
    value: [
      { label: "Draft", value: "draft" },
      { label: "Request", value: "request" },
      // { label: "Status 3", value: "Status3" },
      // { label: "Status 4", value: "Status4" },
    ],
  },
];

export interface DraftPropertyState {
  total_pages: number;
  current_page: number;
  last_page: number;
}

export interface DraftPropertyFilterParams {
  date_from?: string;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  staff_id?: string[];
  property_type?: "rental" | "facility";
  sort_by?: "desc";
  search?: string;
}
export interface PropertyDataProps {
  id: string;
  video_link: string;
  title: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string;
  property_type: string;
  branch_id: number;
  inventory_id: number;
  land_lord_id: number;
  user_id: number;
  company_id: number;
  agency_fee: number;
  who_to_charge_new_tenant: string;
  who_to_charge_renew_tenant: string;
  caution_deposit: string;
  group_chat: string;
  rent_penalty: string;
  fee_penalty: number;
  request_call_back: string;
  book_visitors: string;
  vehicle_record: string;
  active_vat: string;
  currency: string;
  coordinate: any; // Assuming this could be an object or null
  management_fee: number;
  fee_period: any; // Assuming this could be a string or null
  created_at: string;
  updated_at: string;
  status: "draft" | "request";
  images: any[];
  invites: any[]; // Assuming this is an array of objects
  units: any[]; // Assuming this is an array of objects
  staff: any[]; // Assuming this is an array of objects
  branch: BranchDataObject;
}

export interface BranchDataObject{
  branch_name: string;
}


export const initialState = {
  total_property: 0,
  total_invite: 0,
  total_draft: 0,
  current_month_property: 0,
  current_month_invite: 0,
  current_month_draft: 0,
  current_page: 0,
  last_page: 0,
  properties: [],
}

export interface PropertyPageState {
  total_property: number;
  total_invite: number;
  total_draft: number;
  current_month_property: number;
  current_month_invite: number;
  current_month_draft: number;
  current_page: number;
  last_page: number;
  properties: PropertyDataProps[];
}

export interface PropertyApiResponse {
  data: {
    total_property: number;
    total_invite: number;
    total_draft: number;
    current_month_property: number;
    current_month_invite: number;
    current_month_draft: number;
    invites: {
      current_page: number;
      last_page: number;
      data: PropertyDataProps[];
    }
  }
}


export interface PropertyDraftFilterResponse {
  data: {
    current_page: number;
    last_page: number;
    data: PropertyDataProps[];
  };
}


export const transformDraftUnitData = (
  response: PropertyApiResponse | PropertyDraftFilterResponse
): Partial<PropertyPageState> => {
  const isUnitApiResponse = (
    response: any
  ): response is PropertyApiResponse => {
    return "total_property" in response.data;
  };

  const propertyData = isUnitApiResponse(response)
    ? response.data.invites
    : response.data;

  console.log("Property data", propertyData)
  const transformedProperties: any = propertyData.data.map(
    (p) => {
      const status = p.invites.length > 0 ? "request" : "draft";
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
        const units = p.units.length
      return {
        id: p.id,
        images: p.images.map((image) => image.path),
        property_name: p.title,
        address: `${p.full_address}, ${p.city_area}, ${p.local_government}, ${p.state}`,
        state: p.state,
        local_government: p.local_government,
        total_unit: units,
        last_updated: lastUpdated,
        hasVideo: !!p.video_link,
        property_type: p.property_type,
        branch: p.branch?.branch_name,
        total_returns: totalReturns,
        total_income: (totalReturns * feePercentage) / 100,
        account_officer: "Nil",
        status: status,
      };
    }
  );

  // console.log("Transformed unit data", transformedUnits)
  if (isUnitApiResponse(response)) {
    // console.log("isUnitApiResponse", response)
    return {
      current_page: response.data.invites.current_page,
      last_page: response.data.invites.last_page,
      total_property: response.data.total_property,
      total_invite: response.data.total_invite,
      total_draft: response.data.total_draft,
      current_month_property: response.data.current_month_property,
      current_month_invite: response.data.current_month_invite,
      current_month_draft: response.data.current_month_draft,
      properties: transformedProperties,
    };
  } else {
    return {
      current_page: response.data.current_page,
      last_page: response.data.last_page,    
      properties: transformedProperties,
    };
  }
};
