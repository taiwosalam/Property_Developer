

export type TApplicationDetailsResponse = {
  status: "success";
  data: {
    application_id: number;
    application_date: string;

    property_details: {
      property_title: string;
      full_access: string;
      landlord: string;
      description: string;
      state: string;
      branch: string;
      categories: string;
      rent: string;
      local_government: string;
      account_officer: string;
    };
    user: {
      name: string;
      type: "web" | "mobile";
      phone: string;
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
    guarantors: {
      guarantor_1: {
        name: string;
        email: string;
        phone_number: string;
        address: string;
      } | null;
      guarantor_2: {
        name: string;
        email: string;
        phone_number: string;
        address: string;
      } | null;
    };
    flag: {
      is_flagged: boolean;
      reason: null;
      appeal_reason: null;
      status: null;
      flagger: {
        flaggedBy: null;
      };
    };
    rent_history: {
      current: RentHistoryItem[];
      previous: RentHistoryItem[];
    };
  };
};

export type RentHistoryItem = {
  id: number;
  payment_date: string;
  amount_paid: string;
  total_amount: string;
  balance_due: string;
  rent_amount: string;
  details: string;
  invoice_status: string;
  start_date: string;
  due_date: string;
};
