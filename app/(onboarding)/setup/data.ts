// import moment from "moment";
import dayjs from "dayjs";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { cleanPhoneNumber } from "@/utils/checkFormDataForImageOrAvatar";
import { ProgressCardStep } from "@/components/Loader/setup-card-loader";

export const SetupLoadsteps: ProgressCardStep[] = [
  {
    title: "Creating your account and preparing staging environment",
    type: "warning",
    desc: " We’re starting the setup process and building your safe test space",
  },
  {
    title: "Linking your domain to your staging site",
    type: "warning",
    desc: "Your chosen domain is being connected so you can preview your website live.",
  },
  {
    title: "Applying your website template",
    type: "warning",
    desc: "We’re installing the design layout for your site’s look and feel.",
  },
  {
    title: "Customizing your dashboard theme",
    type: "warning",
    desc: "Your control panel is getting styled with default theme.",
  },
  {
    title: "Configuring default brand colors",
    type: "success",
    desc: "Colors are being applied across your website and dashboard for a consistent brand identity.",
  },
  {
    title: "Syncing settings and data with our server",
    type: "success",
    desc: "All your setup information is being saved and updated securely.",
  },
  {
    title: "Loading resources and components for your site",
    type: "success",
    desc: "Images, scripts, and features are being prepared for quick loading.",
  },
  {
    title: "Finalizing website and dashboard setup",
    type: "success",
    desc: "We’re completing the last technical steps to make everything work smoothly.",
  },
  {
    title: "Securing your account and domain",
    type: "success",
    desc: "Security measures are being activated to protect your data and environment.",
  },
  {
    title: "All set! Your staging environment is ready to explore.",
    type: "success",
    desc: " You can now preview, test, and customize your website in staging.",
  },
];

interface Director {
  full_name: string;
  personal_title: string;
  years_in_business: string | number;
  phone_number: string;
  about_director: string;
  avatar?: string;
  profile_picture?: string | File;
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
  const director = {
    full_name: formData.get("director_full_name") as string,
    personal_title: formData.get("director_personal_title") as string,
    years_in_business: formData.get("director_experience") as string | number,
    phone_number: formData.get("director_phone_number") as string,
    about_director: formData.get("about_director") as string,
  };

  // Check for avatar or profile_picture and include only one
  const avatar = formData.get("avatar") as string;
  const profilePicture = formData.get("director_profile_picture") as File;

  console.log("profilePicture", profilePicture);

  if (avatar && avatar.trim() !== "") {
    (director as any).avatar = avatar;
    // Remove profile_picture if avatar is present
    formData.delete("director_profile_picture");
  } else if (profilePicture && profilePicture.size > 0) {
    (director as any).profile_picture = profilePicture;
    // Remove avatar if profile_picture is present
    formData.delete("avatar");
  }

  data.directors = [director];

  // // Organize directors data
  // data.directors = [
  //   {
  //     full_name: formData.get("director_full_name") as string,
  //     personal_title: formData.get("director_personal_title") as string,
  //     years_in_business: formData.get("director_experience") as string | number,
  //     phone_number: formData.get("director_phone_number") as string,
  //     about_director: formData.get("about_director") as string,
  //     avatar: formData.get("avatar") as string,
  //     profile_picture: formData.get("director_profile_picture") as
  //       | string
  //       | File,
  //   },
  // ];

  // Add certificates
  data.cac_certificate = formData.get("cac_certificate") as string | File;
  data.membership_certificate = formData.get("membership_certificate") as
    | string
    | File;
  data.status = "pending";

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
    toast.success(data?.message || "Company updated successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update company");
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
