import { property } from "lodash";
import { RentHistoryItem, TApplicationDetailsResponse } from "./type";
import api, { handleAxiosError } from "@/services/api";
import { getBadgeColor } from "@/lib/utils";

export interface IRentHistory {
  unitId: number;
  unitName: string;
  address: string;
  propertyName: string;
  rentAmount: string;
  period: string;
  moveOutDate: string;
  propertyImages: Array<string>;
  propertyType: string;
  managedBy: string;
}
export interface IApplicationDetails {
  property_details: {
    application_date: string;
    property_title: string;
    address: string;
    landlord: string;
    description: string;
    state: string;
    branch: string;
    categories: string;
    rent: string;
    total_package?: string;
    unit_name?: string;
    renewal_amount?: string;
    local_government: string;
    account_officer: string;
  };
  profile_details: {
    fullName: string;
    tier_id: number;
    email: string;
    user_tag: "mobile" | "web";
    encodedId: string;
    photo: string;
    notes: string;
    applied_duration: string;
    gender: "male" | "female";
    birthday: string;
    religion: string;
    phone: string;
    application_duration?: string;
    marital_status: string;
  };
  bank_details: {
    bankName: string;
    account_name: string;
    bank_account_no: string;
    wallet_id: string | null;
  };
  contact_details: {
    address: string;
    city: string;
    state: string;
    lga: string;
  };
  next_of_kin: {
    name: string;
    address: string;
    phone_number: string;
    relationship: string;
  };
  others: {
    occupation: string;
    employment_type: string;
    family_type: string;
  };
  guarantor1: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
  } | null;
  guarantor2: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
  } | null;
  experience: string;
  justification: string;
  current_rent: IRentHistory[];
  previous_rent: IRentHistory[];
}
export const transformApplicationDetailsPageData = (
  res: TApplicationDetailsResponse
): IApplicationDetails => {
  const {
    data: {
      application_date,
      application_id,
      user,
      profile_details,
      bank_details,
      next_of_kin,
      guarantors,
      flag,
      rent_history,
      property_details,
    },
  } = res;
  return {
    property_details: {
      application_date,
      property_title: property_details?.property_title || "--- ---",
      address: property_details?.address || "--- ---",
      landlord: property_details?.landlord || "--- ---",
      description: property_details?.description || "--- ---",
      state: property_details?.state || "--- ---",
      branch: property_details?.branch || "--- ---",
      categories: property_details?.categories || "--- ---",
      rent: property_details?.rent || "--- ---",
      local_government: property_details?.local_government || "--- ---",
      account_officer: property_details?.account_officer || "--- ---",
    },
    profile_details: {
      fullName: user?.name.toLowerCase() || "--- ---",
      tier_id: user?.tier_id,
      email: user?.email || "--- ---",
      user_tag: user?.type || "mobile",
      encodedId: user?.encodedId,
      notes: "Here's a note",
      applied_duration: "7 years",
      photo: user?.profile,
      gender: profile_details?.gender,
      birthday: profile_details?.birthday || "--- ---",
      religion: profile_details?.religion || "--- ---",
      phone: profile_details?.phone || "--- ---",
      marital_status: profile_details?.marital_status || "--- ---",
    },
    contact_details: {
      address: profile_details?.address || "--- ---",
      city: profile_details?.city || "--- ---",
      state: profile_details?.state || "--- ---",
      lga: profile_details?.lga || "--- ---",
    },
    bank_details: {
      bankName: bank_details?.bank_name || "--- ---",
      account_name: bank_details?.account_name || "--- ---",
      bank_account_no: bank_details?.account_number || "--- ---",
      wallet_id: bank_details?.wallet_id || "--- ---",
    },
    next_of_kin: {
      name: next_of_kin?.name || "--- ---",
      address: next_of_kin?.address || "--- ---",
      phone_number: next_of_kin?.phone || "--- ---",
      relationship: next_of_kin?.relationship || "--- ----",
    },
    others: {
      occupation: profile_details?.occupation || "--- ---",
      employment_type: profile_details?.employment_type || "--- ---",
      family_type: profile_details?.family_type || "--- ---",
    },
    guarantor1: {
      name: guarantors?.guarantor_1?.name || "--- ---",
      email: guarantors?.guarantor_1?.email || "--- ---",
      phone_number: guarantors?.guarantor_1?.phone_number || "--- ---",
      address: guarantors?.guarantor_1?.address || "--- ---",
    },
    guarantor2: {
      name: guarantors?.guarantor_2?.name || "--- ---",
      email: guarantors?.guarantor_2?.email || "--- ---",
      phone_number: guarantors?.guarantor_2?.phone_number || "--- ---",
      address: guarantors?.guarantor_2?.address || "--- ---",
    },
    current_rent:
      rent_history?.previous?.map((current) => ({
        unitId: current?.unit_id,
        unitName: current?.unit_name || "--- ---",
        address: "Property address",
        propertyName: "Property Name",
        rentAmount: current?.rent_amount || "--- ---",
        period: "Period (yearly)",
        moveOutDate: current?.due_date || "--- ---",
        propertyImages:
          current?.unitImages?.length > 0
            ? current?.unitImages?.map((image) => image.path)
            : [],
        propertyType: current?.propertyType,
        managedBy: "Taiwo Salam & Co. (Managed by)",
      })) || [],
    previous_rent:
      rent_history?.previous?.map((current) => ({
        unitId: current?.unit_id,
        unitName: current?.unit_name || "--- ---",
        address: "Property address",
        propertyName: "Property Name",
        rentAmount: current?.rent_amount || "--- ---",
        period: "Period (yearly)",
        moveOutDate: current?.due_date || "--- ---",
        propertyImages:
          current?.unitImages?.length > 0
            ? current?.unitImages?.map((image) => image.path)
            : [],
        propertyType: current?.propertyType || "--- ---",
        managedBy: "Taiwo Salam & Co. (Managed by)",
      })) || [],
    experience: profile_details?.prior_experience || "--- ---",
    justification: profile_details?.rent_justification || "--- ---",
  };
};

export const rejectApplication = async (id: string) => {
  try {
    const res = await api.post(`property-applications/${id}/reject`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchApplication"));
      return true;
    }
  } catch (error) {
    console.error(error);
    handleAxiosError(error);
    return false;
  }
};
