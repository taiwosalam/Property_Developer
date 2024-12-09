import type { AddUnitStore } from "@/store/add-unit-store";
import type { Categories } from "@/data";
import type { SinglePropertyResponse } from "../../../[id]/data";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import type { AddUnitPayload } from "@/components/Management/Properties/types";

type AddUnitStoreWithoutFunctions = Omit<
  AddUnitStore,
  "addUnit" | "editUnit" | "removeUnit" | "setAddUnitStore"
>;

export const transformPropertyData = (
  response: SinglePropertyResponse
): AddUnitStoreWithoutFunctions | null => {
  const { data } = response;
  if (!data) return null;
  const settings = data.settings[0];
  return {
    property_id: data.id,
    propertyType: data.property_type === "rental" ? "rental" : "facility",
    propertyDetails: {
      property_title: data.title,
      video_link: data.video_link,
      state: data.state,
      city: data.city_area,
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
      caution_deposit: settings.caution_deposit ?? undefined,
      group_chat: mapNumericToYesNo(settings.group_chat),
      rent_penalty: mapNumericToYesNo(settings.rent_penalty),
      request_callback: mapNumericToYesNo(settings.request_call_back),
      vehicle_record: mapNumericToYesNo(settings.vehicle_record),
      currency: settings.currency || undefined,
    },
    addedUnits: data.units,
  };
};

export const createUnit = async (
  propertyId: string,
  formData: Record<string, any>
) => {
  try {
    const { data } = await api.post<AddUnitPayload & { message: string }>(
      `unit/${propertyId}/create`,
      formData
    );
    toast.success(data?.message || "Unit Added Succesfully");
    return data;
  } catch (error) {
    handleAxiosError(error, "Failed to add unit");
    return false;
  }
};
