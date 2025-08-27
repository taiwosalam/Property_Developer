import { type PropertyPreviewProps } from "@/components/Management/Properties/previews/property-preview";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";
import type { PropertyDataObject } from "../data";
import moment from "moment";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import { transformUnitDetails } from "@/app/(nav)/listing/data";

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
  const manager = data?.staff?.find((staff) => staff.staff_role === "manager");
  const accountOfficer = data?.staff?.find(
    (staff) => staff.staff_role === "account officer"
  );

  return {
    id: data.id,
    video_link: data.video_link,
    property_name: data.title,
    address: `${data.full_address}, ${data.city_area}, ${data.local_government}, ${data.state}`,
    propertyType: data.property_type as "rental" | "facility",
    total_units: data.units_count,
    images: data.images.map((img) => img.path),
    isRental: data.property_type.toLocaleLowerCase() === "rental",
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
    rent_penalty: mapNumericToYesNo(data.rent_penalty),
    fee_period: data.fee_period,
    description: data?.description ?? "",
    account_officer: `${accountOfficer?.title || "--"} ${
      accountOfficer?.user?.name || "--"
    }`, // to do
    // landlord_name: data.landlord || "--- ---", //to do
    branch_manager: `${manager?.professional_title ?? "--- ---"} ${
      manager?.user?.name ?? "--- ---"
    }`,
    mobile_tenants: 0, // backend shit
    web_tenants: 0, // backend shit
    last_updated: moment(data.updated_at).format("Do MMM, YYYY"),
    available_units: data.units.filter(
      (unit) => unit.is_active === "vacant" || unit.is_active === "relocate"
    ).length,
    // available_units: 1,
    total_returns: totalReturns,
    total_income: (totalReturns * feePercentage) / 100,
    landlord_info: data.landlord_info,
    landlord_id: data.landlord_id ?? 0,
    landlordData: data.landlord,
    units: data.units.map((unit) => ({
      unitId: unit.id,
      unitType: unit.unit_type,
      propertyType: data.property_type as "rental" | "facility",
      vatAmount: unit.vat_amount
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.vat_amount)
          )}`
        : undefined,
      renewVatAmount: unit.renew_vat_amount
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.renew_vat_amount)
          )}`
        : undefined,
      renewOtherCharge: unit.renew_other_charge
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.renew_other_charge)
          )}`
        : undefined,
      otherCharge: unit.other_charge
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.other_charge)
          )}`
        : undefined,
      legalFee: unit.legal_fee
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.legal_fee)
          )}`
        : undefined,
      agencyFee: unit.agency_fee
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.agency_fee)
          )}`
        : undefined,
      inspectionFee: unit.inspection_fee
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.inspection_fee)
          )}`
        : undefined,
      rent: `${currencySymbols[data?.currency || "naira"]}${formatNumber(
        parseFloat(unit.fee_amount)
      )}`,
      serviceCharge: unit.service_charge
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.service_charge)
          )}`
        : undefined,
      totalPackage: unit.total_package
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.total_package)
          )}`
        : undefined,
      unitImages: unit.images.map((img) => img.path),
      unitDetails: transformUnitDetails(unit),
      unitStatus: unit.is_active,
      unitName: unit.unit_name,
      cautionDeposit: unit.caution_fee
        ? `${currencySymbols[data?.currency || "naira"]}${formatNumber(
            parseFloat(unit.caution_fee)
          )}`
        : undefined,
    })),
  };
};
