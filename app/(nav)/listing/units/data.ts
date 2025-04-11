import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import {
  RentalPropertyCardProps,
  UnitDataObject,
} from "../../management/rent-unit/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import api, { handleAxiosError } from "@/services/api";

export const listingUnitFilter: FilterOptionMenu[] = [
  {
    radio: true,
    label: "Status",
    value: [
      { label: "Published", value: "true" },
      { label: "Unpublished", value: "false" },
      { label: "Under Moderation", value: "pending" },
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
  month_pending_unit: 0,
  pending_unit: 0,
  unit: [],
  current_page: 1,
  last_page: 1,
};

export interface UnitPageState {
  total_vacant: number;
  month_vacant: number;
  published_vacant: number;
  month_published_vacant: number;
  unpublished_vacant: number;
  month_unpublished_vacant: number;
  month_pending_unit: number;
  pending_unit: number;
  unit: RentalPropertyCardProps[];
  current_page: number;
  last_page: number;
}

export const unit_listing_status = {
  published: "#01BA4C",
  // approved: "#01BA4C",
  unpublished: "#FFBB53",
  "under moderation": "#702AC8",
  rejected: "#FB1818",
} as const;

export interface UnitApiResponse {
  data: {
    total_vacant: number;
    month_vacant: number;
    published_vacant: number;
    month_published_vacant: number;
    unpublished_vacant: number;
    month_unpublished_vacant: number;
    month_pending_unit: number;
    pending_unit: number;
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
    unit: {
      last_page: number;
      current_page: number;
    };
  };
}

export const transformRentUnitApiResponse = (
  response: UnitApiResponse | UnitFilterResponse
): Partial<UnitPageState> => {
  const isUnitApiResponse = (response: any): response is UnitApiResponse => {
    return "total_vacant" in response.data;
  };

  // console.log("response", response);

  const unitData = isUnitApiResponse(response)
    ? response.data.unit
    : response.data;

  const transformedUnits: RentalPropertyCardProps[] = unitData?.data?.map(
    (u) => {
      const currency = u?.property?.currency;
      return {
        unitId: u.id.toString(),
        description: u?.property?.description || "--- ---",
        rejection_reason: u.reject_reason || "--- ---",
        unit_title: u?.property?.title || "--- ---",
        unit_preference: u?.unit_preference || "--- ---",
        bedroom: u?.bedroom || "--- ---",
        unit_type: u?.unit_type || "--- ---",
        unit_sub_type: u?.unit_sub_type || "--- ---",
        total_area_sqm: u?.total_area_sqm || 0,
        number_of: u?.number_of || 0,
        tenant_name: "No Tenant", //TODO
        expiry_date: "No Expiry", //TODO
        rent: u?.fee_amount || "0",
        caution_deposit: u?.caution_fee || "0",
        service_charge: u?.service_charge || "0",
        images: u.images.map((image) => image.path),
        unit_name: u?.unit_name || "--- ---",
        caution_fee: u.caution_fee || "0",
        published: u.published,
        status: u.status as keyof typeof unit_listing_status,
        property_id: u?.property?.id || "--- ---",
        property_title: u?.property?.title || "--- ---",
        propertyType:
          (u?.property?.property_type as "rental" | "facility") || "rental",
        address: `${u?.property?.full_address || "--- ---"}, ${
          u?.property?.local_government || "--- ---"
        }, ${u?.property?.state || "--- ---"}`,
        total_package: u.total_package
          ? `${
              currencySymbols[
                u?.property?.currency as keyof typeof currencySymbols
              ] || "₦"
            }${formatNumber(parseFloat(u?.total_package))}`
          : undefined,
        currency: currency,
      };
    }
  );

  // console.log("Transformed unit data", transformedUnits)
  if (isUnitApiResponse(response)) {
    return {
      current_page: response.data.unit.current_page,
      last_page: response.data.unit.last_page,
      pending_unit: response.data.pending_unit,
      month_pending_unit: response.data.month_pending_unit,
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

// /unit/46/publish
export const ToggleUnitPublish = async (unitId: number, status: FormData) => {
  try {
    const res = await api.post(`/unit/${unitId}/publish`, status);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
