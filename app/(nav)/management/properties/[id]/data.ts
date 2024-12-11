import { type PropertyPreviewProps } from "@/components/Management/Properties/property-preview";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";
import type { PropertyDataObject } from "../data";
import moment from "moment";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";

export interface SinglePropertyResponse {
  data: PropertyDataObject | null;
}

export const transformSinglePropertyData = (
  response: SinglePropertyResponse
): PropertyPreviewProps | null => {
  const { data } = response;
  if (!data) return null;
  const totalReturns = data.units.reduce((sum, unit) => {
    return sum + parseFloat(unit.fee_amount);
  }, 0);
  const feePercentage =
    data.property_type === "rental" ? data.agency_fee : data.management_fee;
  return {
    id: data.id,
    video_link: data.video_link,
    property_name: data.title,
    address: `${data.full_address}, ${data.city_area}, ${data.local_government}, ${data.state}`,
    propertyType: data.property_type as "rental" | "facility",
    total_units: data.units_count,
    images: data.images.map((img) => img.path),
    isRental: data.property_type === "rental",
    category: data.category,
    state: data.state,
    local_government: data.local_government,
    agency_fee: data.agency_fee,
    management_fee: data.management_fee,
    caution_deposit: data.caution_deposit,
    currency: data.currency,
    group_chat: mapNumericToYesNo(data.group_chat),
    who_to_charge_new_tenant: data.who_to_charge_new_tenant,
    who_to_charge_renew_tenant: data.who_to_charge_renew_tenant,
    book_visitors: mapNumericToYesNo(data.book_visitors),
    request_call_back: mapNumericToYesNo(data.request_call_back),
    vehicle_records: mapNumericToYesNo(data.vehicle_record),
    branch: data.branch?.branch_name,
    account_officer: "", // to do
    landlord_name: "", //to do
    branch_manager: "", //  later
    mobile_tenants: 0, // backend shit
    web_tenants: 0, // backend shit
    last_updated: moment(data.updated_at).format("Do MMM, YYYY"),
    owing_units: 0, // backend shit
    available_units: 0, // backend shit
    total_returns: totalReturns,
    total_income: (totalReturns * feePercentage) / 100,
    units: data.units.map((unit) => ({
      unitId: unit.id,
      propertyType: data.property_type as "rental" | "facility",
      rent: `${currencySymbols[data?.currency || "naira"]}${formatNumber(
        parseFloat(unit.fee_amount)
      )}`,
      serviceCharge: `${
        currencySymbols[data?.currency || "naira"]
      }${formatNumber(parseFloat(unit.service_charge))}`,
      unitImages: unit.images.map((img) => img.path),
      unitDetails: `${unit.unit_preference} - ${unit.unit_sub_type} - ${unit.unit_type}`,
      unitStatus: unit.is_active,
      unitName: unit.unit_name,
    })),
  };
};
