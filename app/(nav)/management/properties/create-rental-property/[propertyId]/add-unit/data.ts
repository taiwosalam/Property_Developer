import type { AddUnitStore } from "@/store/add-unit-store";
import type { Categories } from "@/data";
import type { SinglePropertyResponse } from "../../../[id]/data";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";

type AddUnitStoreWithoutFunctions = Omit<
  AddUnitStore,
  "addUnit" | "editUnit" | "removeUnit" | "setAddUnitStore"
>;

export const transformPropertyData = (
  response: SinglePropertyResponse
): AddUnitStoreWithoutFunctions => {
  const { data } = response;
  const settings = data.settings[0];
  return {
    property_id: data.id,
    propertyType: data.property_type === "rental" ? "rental" : "facility",
    propertyDetails: {
      property_title: data.title,
      state: data.state,
      local_govt: data.local_government,
      full_address: data.full_address,
      category: data.category as Categories,
      desciption: data.description,
      images: data.images.map((img) => img.image_path),
    },
    propertySettings: {
      agency_fee: settings.agency_fee || undefined,
      management_fee: settings.management_fee || undefined,
      who_to_charge_new_tenant: settings.who_to_charge_new_tenant || undefined,
      who_to_charge_renew_tenant:
        settings.who_to_charge_renew_tenant || undefined,
      book_visitors: mapNumericToYesNo(settings.book_visitors),
      VAT: mapNumericToYesNo(settings.active_vat),
      caution_deposit: settings.caution_deposit || undefined,
      group_chat: mapNumericToYesNo(settings.group_chat),
      rent_penalty: mapNumericToYesNo(settings.rent_penalty),
      request_callback: mapNumericToYesNo(settings.request_call_back),
      vehicle_record: mapNumericToYesNo(settings.vehicle_record),
      currency: settings.currency || undefined,
    },
    addedUnits: data.units,
  };
};
