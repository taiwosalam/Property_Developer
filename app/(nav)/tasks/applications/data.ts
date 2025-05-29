export type ApplicationResponse = {
  status: "success";
  data: {
    main_image: any[]; // Update this if images have a specific structure
    application_id: number;
    application_form: {
      full_name: string;
      address: string | null;
      application_status: "pending" | "approved" | "rejected"; // Update if more statuses exist
      application_period: string | null;
      application_date: string;
      user_details: {
        id: number;
        encodedId: string;
        name: string;
        email: string;
        phone: string | null;
        username: string;
        referrer_code: string;
        email_verified_at: string;
        phone_verified_at: string | null;
        username_updated_at: string | null;
        is_active: number;
        is_company_owner: number;
        tier_id: number;
        deleted_at: string | null;
        created_at: string;
        updated_at: string;
        provider_id: string | null;
        provider_name: string | null;
        is_verified: boolean;
        profile: {
          id: number;
          user_id: number;
          type: "user" | string;
          name: string | null;
          email: string | null;
          phone: string | null;
          nin: string | null;
          bvn: string | null;
          picture: string;
          background_image: string;
          title: string | null;
          gender: string | null;
          address: string | null;
          state: string | null;
          lga: string | null;
          city: string | null;
          bio: string | null;
          dob: string | null;
          religion: string | null;
          marital_status: string | null;
          occupation: string | null;
          job_type: string | null;
          family_type: string | null;
          note: string | null;
          facebook: string | null;
          x: string | null;
          instagram: string | null;
          linkedin: string | null;
          youtube: string | null;
          tiktok: string | null;
          website: string | null;
          bvn_link_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          bvn_linked: boolean;
        };
      };
      flag_info: {
        flagged: boolean;
        flagged_by_others: any[]; // Specify structure if needed
      };
      next_of_kin_details: {
        full_name: string | null;
        address: string | null;
        relationship: string | null;
        phone_number: string | null;
      };
      guarantor_1: {
        name: string | null;
        email: string | null;
        phone_number: string | null;
        address: string | null;
      };
      guarantor_2: {
        name: string | null;
        email: string | null;
        phone_number: string | null;
        address: string | null;
      };
      others: {
        occupation: string | null;
        employment_type: string | null;
        family_type: string | null;
      };
      prior_experience_in_real_estate: string | null;
      justification_for_clearing_next_rent: string | null;
      application_process: {
        submission: {
          status: string | null;
          date: string | null;
        };
        evaluation: {
          status: string | null;
          date: string | null;
        };
        approval: {
          status: string | null;
          date: string | null;
        };
      };
      invoice: any[]; // Specify structure if invoices exist
    };
    property_details: {
      property_name: string | null;
      categories: string;
      preferences: string | null;
      unit_type: string;
      unit_sub_type: string | null;
      bedroom: number | null;
      bathroom: number | null;
      toilet: number | null;
      unit_name_number: string | null;
      total_unit: number | null;
      available_unit: number | null;
      total_land_area: string | null;
      added_on: string;
      last_updated: string;
      total_views: number | null;
      bookmark: any | null;
      facilities: any[]; // Specify if structure exists
      marketed_by: {
        name: string | null;
        logo: string | null;
        years_in_industry: string | null;
        joined_our_property_platform: string;
      };
      property_agent: {
        name: string;
        title: string;
        image: string | null;
        phone: string | null;
        chat_link: string | null;
      };
      price_condition: string | null;
    };
    fees: {
      new_tenant: {
        inspection_fee: number | null;
        rent: number | null;
        service_charge: number | null;
        refundable_caution_fee: number | null;
        non_refundable_legal_fee: number | null;
        other_fees: number | null;
        total_package: number | null;
      };
      renewal_tenant: {
        inspection_fee: number | null;
        rent: number | null;
        service_charge: number | null;
        refundable_caution_fee: number | null;
        non_refundable_legal_fee: number | null;
        other_fees: number | null;
        total_package: number | null;
      };
    };
  }[];
};

export interface IApplicationPageData {
  total_application: number;
  month_application: number;
  mobile_application: number;
  month_mobile_application: number;
  web_application: number;
  month_web_application: number;
  applications: {
    id: number;
    images: string[];
    full_name: string;
    tier_id: number;
    user_id: string;
    user_type: string;
    email: string;
    property_name: string;
    address: string;
    phone_number: string | null;
    date: string;
    total_package: string;
    yearly_amount: string;
    period_type: string;
    currency: string;
  }[];
}

export const transformApplicationData = (
  data: ApplicationResponse
): IApplicationPageData => {
  const { data: res } = data;

  return {
    total_application: 0,
    month_application: 0,
    mobile_application: 0,
    month_mobile_application: 0,
    web_application: 0,
    month_web_application: 0,
    applications: res.map((item) => ({
      id: item?.application_id,
      images: item?.main_image?.map(String) || [],
      full_name: item?.application_form.user_details?.name,
      tier_id: item?.application_form?.user_details?.tier_id,
      user_id: item?.application_form?.user_details?.encodedId,
      user_type: "staff",
      email: item?.application_form?.user_details?.email,
      property_name: "2 Bedroom Detached",
      address: "24 Mount Everest",
      phone_number: item?.application_form?.user_details?.phone,
      date: item?.application_form?.application_date,
      total_package: String(item?.fees?.new_tenant?.total_package || ''),
      yearly_amount: "1,222,332", //item?.unit?.fee_amount,
      period_type: "203,323,232", //item?.unit?.fee_period,
      currency: "NGN",
    })),
  };
};
