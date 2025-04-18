// import moment from "moment";
import dayjs from "dayjs";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { cleanPhoneNumber } from "@/utils/checkFormDataForImageOrAvatar";

interface Director {
  full_name: string;
  personal_title: string;
  years_in_business: string | number;
  phone_number: string;
  about_director: string;
  profile_picture: string | File;
}

interface CompanyPayload {
  referrer: string;
  company_name: string;
  domain: string;
  company_logo: string | File;
  date_of_registration: string; // Format: YYYY-MM-DD
  cac_registration_number: string;
  industry: string;
  membership_number: string;
  company_type_id: number;
  head_office_address: string;
  state: string;
  local_government: string;
  city: string;
  utility_document: string | File;
  phone_number: string[];
  directors: Director[];
  cac_certificate: string | File;
  membership_certificate: string | File;
  status?: string;
}

export const transformFormData = (formData: FormData): CompanyPayload => {
  const data = {} as CompanyPayload;

  cleanPhoneNumber(formData, [
    "phone_number_1",
    "phone_number_2",
    "phone_number_3",
    "phone_number_4",
    "director_phone_number",
  ]);

  // Extract and organize data into the required structure
  data.domain = formData.get("custom_domain") as string;
  data.company_name = formData.get("company_name") as string;
  data.referrer = formData.get("referral_id") as string;
  data.company_logo = formData.get("company_logo") as string | File;
  data.date_of_registration = dayjs(
    formData.get("date_of_registration") as string
  ).format("YYYY-MM-DD");
  data.cac_registration_number = formData.get(
    "cac_registration_number"
  ) as string;
  data.industry = formData.get("industry") as string;
  data.membership_number = formData.get("membership_number") as string;
  data.company_type_id = parseInt(
    formData.get("company_type_id") as string,
    10
  );

  data.head_office_address = formData.get("head_office_address") as string;
  data.state = formData.get("state") as string;
  data.local_government = formData.get("local_government") as string;
  data.city = formData.get("city") as string;
  data.utility_document = formData.get("utility_document") as string | File;

  // Collect phone numbers into an array
  data.phone_number = [
    formData.get("phone_number_1"),
    formData.get("phone_number_2"),
    formData.get("phone_number_3"),
    formData.get("phone_number_4"),
  ].filter(Boolean) as string[];

  // Organize directors data
  data.directors = [
    {
      full_name: formData.get("director_full_name") as string,
      personal_title: formData.get("director_personal_title") as string,
      years_in_business: formData.get("director_experience") as string | number,
      phone_number: formData.get("director_phone_number") as string,
      about_director: formData.get("about_director") as string,
      profile_picture: formData.get("director_profile_picture") as
        | string
        | File,
    },
  ];

  // Add certificates
  data.cac_certificate = formData.get("cac_certificate") as string | File;
  data.membership_certificate = formData.get("membership_certificate") as
    | string
    | File;
  data.status = 'pending'

  return data;
};

export const createCompany = async (
  formData: Record<string, any>
): Promise<boolean> => {
  try {
    const { data } = await api.post("companies", formData);
    toast.success(data?.message || "Company created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create company");
    return false;
  }
};

export const updateCompany = async (
  id: number,
  formData: Record<string, any>
): Promise<boolean> => {
  try {
    const { data } = await api.post(`/company/${id}/update`, formData);
    toast.success(data?.message || "Company created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create company");
    return false;
  }
};

export const checkDomainAvailability = async (
  domain: string
): Promise<boolean> => {
  try {
    const response = await api.post("/check-domain", { domain });
    const availability = response.data.message;
    return availability === "available";
  } catch (error) {
    handleAxiosError(error, "Failed to check domain availability");
    return false;
  }
};
