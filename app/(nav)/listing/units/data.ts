import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import { RentalPropertyCardProps, UnitDataObject } from "../../management/rent-unit/data";

export const listingUnitFilter: FilterOptionMenu[] = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "branch",
    value: [
      { label: "branch 1", value: "branch1" },
      { label: "branch 2", value: "branch2" },
      { label: "branch 3", value: "branch3" },
    ],
  },
  {
    radio: true,
    label: "Status",
    value: [
      { label: "Published", value: "published" },
      { label: "Unpublished", value: "unpublished" },
      { label: "Under Moderation", value: "under_moderation" },
      { label: "Rejected", value: "rejected" },
    ],
  },
];

export interface RentAndUnitState {
  gridView?: boolean;
  total_pages: number;
  current_page: number;
  last_page: number;
}

export const initialState: UnitPageState = {
  total_vacant: 0,
  month_vacant: 0,
  published_vacant: 0,
  month_published_vacant: 0,
  unpublished_vacant: 0,
  month_unpublished_vacant: 0,
  unit: [],
  current_page: 1,
  last_page: 1
};

export interface UnitPageState {
  total_vacant: number;
  month_vacant: number;
  published_vacant: number;
  month_published_vacant: number;
  unpublished_vacant:number;
  month_unpublished_vacant: number;
  unit: RentalPropertyCardProps[];
  current_page: number;
  last_page: number;
}

export const unit_listing_status = {
  published: "#01BA4C",
  unpublished: "#FFBB53",
  "under moderation": "#702AC8",
  rejected: '#FB1818'
} as const;

export interface UnitApiResponse {
  data: {
    total_vacant: number;
    month_vacant: number;
    published_vacant: number;
    month_published_vacant: number;
    unpublished_vacant:number;
    month_unpublished_vacant: number;
    unit: {
      current_page: number;
      last_page: number;
      data: UnitDataObject[];
    };
  };
}

export interface UnitFilterResponse {
  data: {
    current_page: number;
    last_page: number;
    data: UnitDataObject[];
  };
}


export const transformRentUnitApiResponse = (
  response: UnitApiResponse | UnitFilterResponse
): Partial<UnitPageState> => {
  const isUnitApiResponse = (
    response: any
  ): response is UnitApiResponse => {
    return "total_vacant" in response.data;
  };

  // console.log("response", response)

  const unitData = isUnitApiResponse(response)
    ? response.data.unit
    : response.data;

  const transformedUnits: RentalPropertyCardProps[] = unitData.data.map(
    (u) => {
      return {
        unitId: u.id.toString(),
        description: u.property.description,
        unit_title: u.property.title,
        unit_preference: u.unit_preference,
        bedroom: u.bedroom,
        unit_type: u.unit_type,
        unit_sub_type: u.unit_sub_type,        
        total_area_sqm: u.total_area_sqm,
        number_of: u.number_of,
        tenant_name: "No Tenant", //TODO
        expiry_date: "No Expiry", //TODO
        rent: u.fee_amount,
        caution_deposit: u.caution_fee,
        service_charge: u.service_charge,
        images: u.images.map((image) => image.path),
        unit_name: u.unit_name,
        caution_fee: u.caution_fee,
        status: u.status,
        property_id: u.property.id,
        propertyType: u.property.property_type as "rental" | "facility",
        address: `${u.property.full_address}, ${u.property.local_government}, ${u.property.state}`,
      };
    }
  );

  // console.log("Transformed unit data", transformedUnits)
  if (isUnitApiResponse(response)) {
    console.log("isUnitApiResponse", response)
    return {
      current_page: response.data.unit.current_page,
      last_page: response.data.unit.last_page,
      total_vacant: response.data.total_vacant,
      month_vacant: response.data.month_vacant,
      published_vacant: response.data.published_vacant,
      month_published_vacant: response.data.month_published_vacant,
      unpublished_vacant: response.data.unpublished_vacant,
      month_unpublished_vacant: response.data.month_unpublished_vacant,
      unit: transformedUnits,
    };
  } else {
    return {
      unit: transformedUnits,
    };
  }
};