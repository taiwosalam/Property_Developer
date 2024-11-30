import { type PropertyPreviewProps } from "@/components/Management/Properties/property-preview";
import { currencySymbols } from "@/utils/number-formatter";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";

export interface SinglePropertyResponse {
  data: {
    id: string;
    video_link?: string;
    title: string;
    full_address: string;
    city_area: string;
    local_government: string;
    state: string;
    units: any[]; // TODO: Add type
    images: string[];
    landlord: string | null;
    category: string;
    settings: [
      {
        agency_fee?: number;
        maintenance_fee?: number;
        caution_deposit?: string;
        currency?: keyof typeof currencySymbols;
        fee_period: string;
        group_chat: 1 | 0;
        who_to_charge_new_tenant: string;
        who_to_charge_renew_tenant: string;
        book_visitors: 1 | 0;
        request_call_back: 1 | 0;
        vehicle_records: 1 | 0;
      }
    ];
  };
}

export const transformSinglePropertyData = (
  response: SinglePropertyResponse
): PropertyPreviewProps => {
  const { data } = response;
  const settings = data.settings[0];
  return {
    id: data.id,
    property_name: data.title,
    address: `${data.full_address}, ${data.city_area}, ${data.local_government}, ${data.state}`,
    propertyType: "rental", // backend shit
    total_units: data.units.length, // backend shit
    images: data.images,
    units: data.units,
    isRental: true, // backend shit
    landlord_name: data.landlord || "",
    category: data.category,
    state: data.state,
    local_government: data.local_government,
    account_officer: "", // backend shit
    agency_fee: settings.agency_fee,
    maintenance_fee: settings.maintenance_fee,
    caution_deposit: settings.caution_deposit,
    currency: settings.currency,
    fee_period: settings.fee_period,
    group_chat: mapNumericToYesNo(settings.group_chat),
    who_to_charge_new_tenant: settings.who_to_charge_new_tenant,
    who_to_charge_renew_tenant: settings.who_to_charge_renew_tenant,
    book_visitors: mapNumericToYesNo(settings.book_visitors),
    request_call_back: mapNumericToYesNo(settings.request_call_back),
    vehicle_records: mapNumericToYesNo(settings.vehicle_records),
    branch: "", // backend shit
    branch_manager: "", // backend shit
    mobile_tenants: 0, // backend shit
    web_tenants: 0, // backend shit
    last_updated: "", // backend shit
    owing_units: 0, // backend shit
    available_units: 0, // backend shit
    annual_returns: 0, // backend shit
    annual_income: 0, // backend shit
  };
};
