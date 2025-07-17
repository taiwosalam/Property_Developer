export type TApplicationDetailsResponse = {
  status: "success";
  data: {
    rent_history: {
      current: RentHistoryItem[];
      previous: RentHistoryItem[];
    };
    application_id: number;
    application_date: string;
    application_duration: string;
    application_status: "pending" | "evaluated" | "approved" | "rejected";

    property_details: {
      property_title: string;
      full_address: string;
      address: string;
      landlord: string;
      unit_name: string;
      description: string;
      unit_id: number;
      state: string;
      branch: string;
      categories: string;
      total_package: string;
      renew_total_package: string;
      rent: string;
      local_government: string;
      account_officer: string;
    };
    user: {
      user_id: number;
      name: string;
      type: "web" | "mobile";
      phone: {
        profile_phone: string;
        user_phone: string;
      };
      email: string;
      encodedId: string;
      tier_id: number;
      profile: string;
      is_flagged: null | boolean;
      status: null | string;
    };
    profile_details: {
      gender: "male" | "female";
      birthday: string;
      religion: string;
      phone: string;
      marital_status: string;
      address: string;
      city: string;
      state: string;
      lga: string;
      occupation: string;
      employment_type: string;
      family_type: string;
      prior_experience: string;
      rent_justification: string;
    };
    bank_details: {
      wallet_id: string | null;
      account_name: string;
      account_number: string;
      bank_name: string;
    };
    next_of_kin: {
      name: string;
      email: string;
      address: string;
      phone: string;
      relationship: string;
    };
    business_Profile: {
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
    guarantors:
      | {
          name: string;
          email: string;
          phone: string;
          relationship: string;
          address: string;
          occupation: string;
        }[]
      | null;

    flags: {
      is_flagged: boolean;
      reason: string;
      appeal_reason: string;
      status: "cancelled" | "pending" | "evaluated" | "approved";
      created_at: string;
      flagger: {
        user_id: number;
        name: string;
        email: string;
        phone: string;
        picture: string | null;
        company: string;
      };
    }[];
  };
};

export type RentHistoryItem = {
  id: number;
  property_address: string;
  property_name: string;
  payment_date: string;
  tenantName: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  measurement: string;
  total_area_sqm: string;
  bedroom: string;
  amount_paid: string;
  total_amount: string;
  balance_due: string;
  rent_amount: string;
  details: string;
  invoice_status: string;
  start_date: string;
  due_date: string;
  move_out: string;
  managedBy: string | null;
  cautionDeposit: string | null;
  propertyType: string;
  period: string;
  unit_id: number;
  unit_name: string;
  serviceCharge: null;
  currency: string;
  unitImages: {
    path: string;
  }[];
};
