import type { AddUnitStore } from "@/store/add-unit-store";
import type { Categories } from "@/data";
import type { SinglePropertyResponse } from "../../../[id]/data";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import type { UnitDataObject } from "@/app/(nav)/management/properties/data";

type AddUnitStoreWithoutFunctions = Omit<
  AddUnitStore,
  "addUnit" | "editUnit" | "removeUnit" | "setAddUnitStore" | "resetStore"
>;

export const transformPropertyData = (
  response: SinglePropertyResponse
): AddUnitStoreWithoutFunctions | null => {
  const { data } = response;
  if (!data) return null;

  console.log("res", response);

  return {
    property_id: data.id,
    propertyType: data.property_type === "rental" ? "rental" : "facility",
    propertyDetails: {
      property_title: data.title,
      video_link: data.video_link,
      state: data.state,
      city: data.city_area,
      local_govt: data.local_government,
      full_address: `${data.full_address}, ${data.city_area}, ${data.local_government}, ${data.state}`,
      category: data.category as Categories,
      description: data.description,
      inventory: data.inventory,
      // images: data.images.map((img) => ({ path: img.path, id: img.id })),
      images: data.images
        .sort((a, b) => (a.is_default === 1 ? -1 : b.is_default === 1 ? 1 : 0))
        .map((img) => ({ path: img.path, id: img.id })),
      branch_name: data.branch?.branch_name,
      branch_id: data.branch?.id,
      land_lord_id: data.landlord_id,
      staff_id: data.staff
        ?.filter((s) => s.staff_role === "staff" || s.staff_role === "manager")
        .map((s) => s.id),
      officer_id: data.staff
        ?.filter((s) => s.staff_role === "account officer")
        .map((s) => s.id),
      account_officer: data.staff
        ?.filter((s) => s.staff_role === "account officer")
        .map((s) => s.user.name)[0],
      manager: data.staff
        ?.filter((s) => s.staff_role === "manager")
        .map((s) => s.user.name)[0],
    },
    propertySettings: {
      agency_fee: data.agency_fee || undefined,
      management_fee: data.management_fee || undefined,
      who_to_charge_new_tenant: data.who_to_charge_new_tenant || undefined,
      who_to_charge_renew_tenant: data.who_to_charge_renew_tenant || undefined,
      book_visitors: mapNumericToYesNo(data.book_visitors),
      VAT: mapNumericToYesNo(data.active_vat),
      caution_deposit: data.caution_deposit ?? undefined,
      group_chat: mapNumericToYesNo(data.group_chat),
      rent_penalty: mapNumericToYesNo(data.rent_penalty),
      fee_penalty: mapNumericToYesNo(data.fee_penalty),
      request_callback: mapNumericToYesNo(data.request_call_back),
      vehicle_record: mapNumericToYesNo(data.vehicle_record),
      currency: data.currency || undefined,
      coordinate: data.coordinate || undefined,
      vat: data.vat || undefined,
      renew_vat: data.renew_vat || undefined,
    },
    addedUnits: data.units.map((unit) => ({
      ...unit,
      images: unit.images
        .sort((a, b) => (a.is_default === 1 ? -1 : b.is_default === 1 ? 1 : 0))
        .map((img) => ({ path: img.path, id: img.id })),
      default_image:
        unit.images && unit.images.length > 0
          ? unit.images.find((image) => image.is_default === 1)?.path ||
            unit.images[0].path
          : undefined,
    })),
    canDelete:
      !data.units.length ||
      data.units.every((unit) => unit.is_active === "vacant"),
  };
};

export const createUnit = async (propertyId: string, formData: any) => {
  try {
    const { data } = await api.post<{
      message: string;
      data: {
        id: string;
      };
    }>(`unit/${propertyId}/create`, formData);
    toast.success(data?.message || "Unit Added Succesfully");
    return data.data?.id;
  } catch (error) {
    // handleAxiosError(error, "Failed to add unit");
    toast.error("Something Went Wrong!");
    return null;
  }
};

export const getUnitById = async (unitId: string) => {
  try {
    const { data } = await api.get<{
      data: UnitDataObject;
    }>(`unit/${unitId}/view`);
    return data.data;
  } catch (error) {
    // handleAxiosError(error, "Failed to fetch unit data");
    toast.error("Something Went Wrong!");
    return null;
  }
};

export const editUnit = async (unitId: string, formData: any) => {
  try {
    const { data } = await api.post<{
      message: string;
      data: {
        id: string;
      };
    }>(`unit/${unitId}/update`, formData);
    toast.success(data?.message || "Unit Updated Succesfully");
    return data.data.id;
  } catch (error) {
    // handleAxiosError(error, "Failed to update unit");
    toast.error("Something Went Wrong!")
    return null;
  }
};

export const deleteUnit = async (unitId: string) => {
  try {
    const { data } = await api.delete(`unit/${unitId}/delete`);
    toast.success(data?.message || "Unit Deleted Succesfully");
    return true;
  } catch (error) {
    // handleAxiosError(error, "Failed to delete unit");
    toast.error("Something Went Wrong!")
    return false;
  }
};
