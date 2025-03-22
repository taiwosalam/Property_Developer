import { UnitListingApiResponse } from "./type";

export interface ITransformUnitListing {
  total_unit: number;
  published_unit: number;
  unpublished_unit: number;
  under_moderation: number;
  units: {
    unitId: number;
    property_title: string;
    images: string[];
    property_id: number;
    caution_fee: string;
    unit_type: string;
    unit_preference: string;
    total_area_sqm: string;
    number_of: number;
    bedroom: string;
    unit_sub_type: string;
    service_charge: string;
    rent: string;
    description: string;
    status: string;
  }[];
}

export const transformUnitApiResponse = (
  data: UnitListingApiResponse
): ITransformUnitListing => {
  return {
    total_unit: data?.total_unit ?? 0,
    published_unit: data?.published_unit ?? 0,
    unpublished_unit: data?.unpublished_unit ?? 0,
    under_moderation: data?.under_moderation ?? 0,
    units: data?.units.map((unit) => {
      return {
        unitId: unit.id,
        property_title: unit?.property.title ?? "",
        images: unit?.images?.map((img) => img.path) ?? [],
        property_id: unit?.property_id ?? 0,
        caution_fee: unit?.caution_fee ?? "",
        unit_type: unit?.unit_type ?? "",
        unit_preference: unit?.unit_preference ?? "",
        total_area_sqm: unit?.total_area_sqm || "",
        number_of: Number(unit?.number_of) ?? 0,
        bedroom: unit?.bedroom ?? "0",
        unit_sub_type: unit?.unit_sub_type ?? "",
        service_charge: unit?.service_charge ?? "",
        rent: unit?.fee_amount ?? "",
        description: unit?.property.description ?? "",
        status: unit?.status ?? "",
      };
    }),
  };
};
