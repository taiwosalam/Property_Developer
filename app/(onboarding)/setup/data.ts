// import moment from "moment";
import dayjs from "dayjs";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { cleanPhoneNumber } from "@/utils/checkFormDataForImageOrAvatar";

export const transformFormData = (formData: FormData) => {
  const data: Record<string, any> = {};

  cleanPhoneNumber(formData, [
    "phone_number_1",
    "phone_number_2",
    "phone_number_3",
    "phone_number_4",
    "director_phone_number",
  ]);

  // Extract and organize data into the required structure
  data.company_name = formData.get("company_name");
  data.company_logo = formData.get("company_logo");

  const dateOfRegistration = formData.get("date_of_registration") as string;
  data.details = {
    date_of_registration: dayjs(dateOfRegistration).format("YYYY-MM-DD"),
    cac_registration_number: formData.get("cac_registration_number"),
    cac_certificate: formData.get("cac_certificate"),
    industry: formData.get("industry"),
    membership_number: formData.get("membership_number"),
    membership_certificate: formData.get("membership_certificate"),
    company_type_id: parseInt(formData.get("company_type_id") as string, 10),
  };

  data.addresses = {
    head_office_address: formData.get("head_office_address"),
    state: formData.get("state"),
    local_government: formData.get("local_government"),
    city: formData.get("city"),
    utility_document: formData.get("utility_document"),
  };

  data.contact_details = [
    {
      phone_number: [
        formData.get("phone_number_1"),
        formData.get("phone_number_2"),
        formData.get("phone_number_3"),
        formData.get("phone_number_4"),
      ].filter(Boolean),
    },
  ];

  data.directors = [
    {
      full_name: formData.get("director_full_name"),
      email: formData.get("director_email"),
      personal_title: formData.get("director_personal_title"),
      years_in_business: formData.get("director_experience"),
      phone_number: formData.get("director_phone_number"),
      about_director: formData.get("about_director"),
      profile_picture: formData.get("director_profile_picture"),
    },
  ];
  return data;
};

export const createCompany = async (
  formData: Record<string, any>
): Promise<boolean> => {
  //   console.log(formData);
  try {
    const { data } = await api.post("companies", formData);
    toast.success(data?.message || "Company created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create company");
    return false;
  }
};
