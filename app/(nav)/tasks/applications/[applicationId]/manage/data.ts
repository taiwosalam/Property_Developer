import { property } from "lodash";
import { RentHistoryItem, TApplicationDetailsResponse } from "./type";
import api, { handleAxiosError } from "@/services/api";
import { formatToNaira, getBadgeColor } from "@/lib/utils";

export interface IRentHistory {
  unitId: number;
  unitName: string;
  address: string;
  propertyName: string;
  unitData?: {
    unit_name: string;
    total_squ_area: string;
    unit_preference: string;
    unit_type: string;
    unit_sub_type: string;
    measurement: string;
    bedroom: string;
  };
  rentAmount: string;
  period: string;
  moveOutDate?: string;
  moveInDate?: string;
  propertyImages: Array<string>;
  propertyType: string;
  managedBy: string;
}
export interface IApplicationDetails {
  application_status: "pending" | "evaluated" | "approved" | "rejected";
  property_details: {
    application_date: string;
    property_title: string;
    address: string;
    landlord: string;
    description: string;
    state: string;
    unit_id: number;
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
    user_id: number;
    fullName: string;
    is_flagged: boolean | null;
    tier_id: number;
    email: string;
    user_tag: "mobile" | "web";
    encodedId: string;
    photo: string;
    notes: string;
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
    phone1: string;
    phone2: string;
  };
  next_of_kin: {
    name: string;
    address: string;
    phone_number: string;
    relationship: string;
  };
  business_profile: {
    business_logo: string;
    business_description: string;
    business_name: string;
    business_email: string;
    business_address: string;
    business_phone: string;
    facebook: string;
    x: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    website: string;
  };
  others: {
    occupation: string;
    employment_type: string;
    family_type: string;
  };
  guarantors:
    | {
        name: string;
        email: string;
        phone: string;
        address: string;
      }[]
    | null;
  experience: string;
  justification: string;
  current_rent: IRentHistory[];
  previous_rent: IRentHistory[];
  hasFlag: boolean;
  flag_details?: {
    user_id: number;
    flagger_name: string;
    email: string;
    phone: string;
    picture: string | null;
    company_name: string;
    is_flagged: boolean;
    reason: string | null;
    appeal_reason: string | null;
    status: "rejected" | "pending" | "evaluated" | "approved";
  }[];
}
export const transformApplicationDetailsPageData = (
  res: TApplicationDetailsResponse
): IApplicationDetails => {
  console.log("res to transform", res);
  const {
    data: {
      application_date,
      application_id,
      application_status,
      rent_history,
      application_duration,
      user,
      profile_details,
      bank_details,
      next_of_kin,
      business_Profile,
      guarantors,
      flags,
      property_details,
    },
  } = res;
  return {
    application_status,
    property_details: {
      application_date,
      property_title: property_details?.property_title || "--- ---",
      address: property_details?.full_address || "--- ---",
      landlord: property_details?.landlord?.toLowerCase() || "--- ---",
      total_package: property_details?.total_package || "--- ---",
      renewal_amount: property_details?.renew_total_package || "--- ---",
      description: property_details?.description || "--- ---",
      state: property_details?.state || "--- ---",
      unit_name: property_details?.unit_name || "--- ---",
      unit_id: property_details?.unit_id || 0,
      branch: property_details?.branch || "--- ---",
      categories: property_details?.categories || "--- ---",
      rent: property_details?.rent || "--- ---",
      local_government: property_details?.local_government || "--- ---",
      account_officer: property_details?.account_officer || "--- ---",
    },
    business_profile: {
      business_address: business_Profile?.business_address || "--- ---",
      business_logo: business_Profile?.business_logo,
      business_description: business_Profile?.business_description || "--- ---",
      business_email: business_Profile?.business_email || "--- ---",
      business_name: business_Profile?.business_name || "--- ---",
      business_phone: business_Profile?.business_phone || "--- ---",
      facebook: business_Profile?.facebook || "--- ---",
      x: business_Profile?.x || "--- ---",
      instagram: business_Profile?.instagram || "--- ---",
      youtube: business_Profile?.youtube || "--- ---",
      tiktok: business_Profile?.tiktok || "--- ---",
      website: business_Profile?.website || "--- ---",
    },
    profile_details: {
      user_id: user?.user_id,
      is_flagged: user?.is_flagged,
      fullName: user?.name?.toLowerCase() || "--- ---",
      tier_id: user?.tier_id,
      application_duration: application_duration ?? "--- ---",
      email: user?.email || "--- ---",
      user_tag: user?.type || "mobile",
      encodedId: user?.encodedId,
      notes: "Here's a note",
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
      phone1: user?.phone?.profile_phone || "--- ---",
      phone2: user?.phone?.user_phone || "--- ---",
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
    guarantors:
      guarantors && guarantors?.length > 0
        ? guarantors?.map((guarantor) => {
            return {
              name: guarantor?.name || "--- ---",
              email: guarantor?.email || "--- ---",
              address: guarantor?.address || "--- ---",
              phone: guarantor?.phone || "--- ---",
            };
          })
        : [],
    others: {
      occupation: profile_details?.occupation || "--- ---",
      employment_type: profile_details?.employment_type || "--- ---",
      family_type: profile_details?.family_type || "--- ---",
    },

    current_rent:
      rent_history?.previous?.map((current) => ({
        unitId: current?.unit_id,
        unitData: {
          unit_name: current?.unit_name,
          unit_preference: current?.unit_preference,
          total_squ_area: current?.total_area_sqm,
          unit_sub_type: current?.unit_sub_type,
          unit_type: current?.unit_type,
          bedroom: current?.bedroom,
          measurement: current?.measurement,
        },
        unitName: current?.unit_name || "--- ---",
        address: current?.property_address || "--- ---",
        propertyName: current?.property_name || "--- ---",
        rentAmount: current?.rent_amount
          ? formatToNaira(current?.rent_amount)
          : "--- ---",
        period: current?.period || "--- ---",
        moveInDate: current?.start_date || "--- ---",
        propertyImages:
          current?.unitImages?.length > 0
            ? current?.unitImages?.map((image) => image.path)
            : [],
        propertyType: current?.propertyType?.toLowerCase(),
        managedBy: current?.managedBy || "--- ---",
      })) || [],
    previous_rent:
      rent_history?.previous?.map((current) => ({
        unitId: current?.unit_id,
        unitData: {
          unit_name: current?.unit_name,
          unit_preference: current?.unit_preference,
          total_squ_area: current?.total_area_sqm,
          unit_sub_type: current?.unit_sub_type,
          unit_type: current?.unit_type,
          bedroom: current?.bedroom,
          measurement: current?.measurement,
        },
        unitName: current?.unit_name || "--- ---",
        address: current?.property_address,
        propertyName: current?.property_name,
        rentAmount: current?.rent_amount
          ? formatToNaira(current?.rent_amount)
          : "--- ---",
        period: current?.period || "--- ---",
        moveOutDate: current?.move_out || "--- ---",
        propertyImages:
          current?.unitImages?.length > 0
            ? current?.unitImages?.map((image) => image.path)
            : [],
        propertyType: current?.propertyType || "--- ---",
        managedBy: current?.managedBy || "--- ---",
      })) || [],
    experience: profile_details?.prior_experience || "--- ---",
    justification: profile_details?.rent_justification || "--- ---",
    hasFlag: flags.some((flag) => flag.is_flagged),
    flag_details: flags
      .filter(
        (flag) =>
          flag?.status === "pending" ||
          flag?.status === "evaluated" ||
          flag?.status === "approved"
      )
      .map((flag) => ({
        flagger_name: flag.flagger?.name?.toLowerCase() || "",
        email: flag?.flagger?.email || "",
        phone: flag?.flagger?.phone || "",
        picture: flag?.flagger?.picture || "",
        company_name: flag?.flagger?.company || "",
        user_id: flag?.flagger?.user_id,
        is_flagged: flag.is_flagged,
        reason: flag?.reason || "--- ---",
        appeal_reason: flag?.appeal_reason ?? null,
        status: flag?.status as
          | "pending"
          | "evaluated"
          | "approved"
          | "rejected",
      })),
  };
};

export const rejectApplication = async (id: string, path: string) => {
  try {
    const res = await api.post(`property-applications/${id}/${path}`);
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

export const becomeTenant = async (formData: FormData) => {
  try {
    const res = await api.post(`/tenant-create/email`, formData);
    if (res.status === 201 || res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    handleAxiosError(error);
    return null;
  }
};
