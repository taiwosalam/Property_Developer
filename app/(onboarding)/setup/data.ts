// import moment from "moment";
import dayjs from "dayjs";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const transformFormData = (formData: FormData) => {
  const data: Record<string, any> = {};

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
      ].filter((number) => typeof number === "string" && number.length > 4),
    },
  ];

  data.directors = [
    {
      full_name: formData.get("director_full_name"),
      email: formData.get("director_email"),
      personal_title: formData.get("director_personal_title"),
      years_in_business: formData.get("director_experience"),
      phone_number:
        (formData.get("director_phone_number") as string)?.length > 4
          ? formData.get("director_phone_number")
          : null,
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
    // console.log(data);
    // console.log(data.status);
    // console.log(data.message);
    const message = data?.message || "Company created successfully";
    toast.success(message);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create company");
    return false;
  }
};
