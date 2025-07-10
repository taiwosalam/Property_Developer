import dayjs from "dayjs";

export type ApplicationResponse = {
  stats: {
    total_applications: number;
    this_month_applications: number;
  };
  data: {
    id: number;
    application_date: string;
    created_at: string;
    application_status: "cancelled" | "pending" | "evaluated" | "approved";
    user: {
      name: string;
      encodedId: string;
      tier_id: number;
      profile: string;
      email: string;
      user_type: string;
      phone: string;
      is_flagged: boolean;
    };
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
        tier_id: number;
        phone: string;
        picture: string | null;
        company: string;
      };
    }[];
    unit: {
      name: string;
      property_title: string;
      period: string;
      currency: string;
      property_images: {
        id: number;
        path: string;
      }[];
      total_package: string;
      renew_total_package: string;
      renew_fee_period: string;
      renew_fee_amount: string;
      property_address: string;
      property_state: string;
      property_city_area: string;
      property_local_government: string;
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
    application_status: "rejected" | "pending" | "evaluated" | "approved";
    id: number;
    images: string[];
    full_name: string;
    tier_id: number;
    user_id: string;
    user_type: string;
    photo: string;
    email: string;
    property_name: string;
    address: string;
    phone_number: string | null;
    date: string;
    total_package: string;
    yearly_amount: string;
    renew_fee_period: string;
    period_type: string;
    currency: string;
    flagged: "flagged" | "unflagged";
    flag_details?: {
      flagger_name: string;
      flagger_id: number;
      email: string;
      phone: string;
      tier_id: number;
      picture: string | null;
      company_name: string;
      is_flagged: boolean;
      reason: string | null;
      appeal_reason: string | null;
      status: "rejected" | "pending" | "evaluated" | "approved";
    }[];
  }[];
}

const currencies: { [key: string]: string } = {
  naira: "₦",
  dollar: "$",
  pound: "£",
};

export const transformApplicationData = (
  data: ApplicationResponse
): IApplicationPageData => {
  const { data: res, stats } = data;

  return {
    total_application: stats?.total_applications,
    month_application: stats?.this_month_applications,
    mobile_application: 0,
    month_mobile_application: 0,
    web_application: 0,
    month_web_application: 0,
    applications: res?.map((item) => ({
      id: item?.id,
      application_status:
        item?.application_status === "cancelled"
          ? "rejected"
          : (item?.application_status as
              | "pending"
              | "evaluated"
              | "approved"
              | "rejected"),
      images: item?.unit?.property_images?.map((image) => image.path) || [],
      full_name: item?.user?.name?.toLowerCase(),
      tier_id: item?.user?.tier_id,
      user_id: item?.user?.encodedId,

      photo: item?.user?.profile,
      flagged: item?.flags.some((flag) => flag.is_flagged)
        ? "flagged"
        : "unflagged",
      user_type: item?.user?.user_type || "mobile",
      email: item?.user?.email,
      property_name: `${item?.unit.name} - ${item?.unit?.property_title}`,
      renew_fee_period: item?.unit?.renew_fee_period,
      address: item?.unit?.property_address,
      phone_number: item?.user?.phone,
      date: item?.application_date,
      total_package: item?.unit?.renew_total_package
        ? Math.round(Number(item?.unit?.renew_total_package))?.toLocaleString()
        : "--- ---",
      yearly_amount: item?.unit?.renew_total_package
        ? Math.round(Number(item?.unit?.renew_total_package))?.toLocaleString()
        : "--- ---", //item?.unit?.fee_amount,
      period_type: item?.unit?.period, //item?.unit?.fee_period,
      currency: currencies[item?.unit?.currency],
      flag_details: item?.flags.map((flag) => ({
        flagger_id: flag?.flagger?.user_id,
        flagger_name: flag.flagger.name?.toLowerCase(),
        email: flag.flagger.email,
        tier_id: flag.flagger?.tier_id,
        phone: flag.flagger.phone,
        company_name: flag.flagger.company,
        picture: flag.flagger?.picture,
        is_flagged: flag.is_flagged,
        reason: flag.reason || "",
        appeal_reason: flag.appeal_reason || "",
        status:
          flag.status === "cancelled"
            ? "rejected"
            : (flag.status as
                | "pending"
                | "evaluated"
                | "approved"
                | "rejected"),
      })),
    })),
  };
};
