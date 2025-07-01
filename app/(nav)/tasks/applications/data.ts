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
      flagged: boolean;
    };
    unit: {
      name: string;
      period: string;
      currency: string;
      property_images: {
        id: number;
        path: string;
      }[];
      total_package: string;
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
    period_type: string;
    currency: string;
    flagged: "flagged" | "unflagged";
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
  const { data: res, stats, } = data;

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
          : (item?.application_status as "pending" | "evaluated" | "approved" | "rejected"),
      images: item?.unit?.property_images?.map((image) => image.path) || [],
      full_name: item?.user?.name?.toLowerCase(),
      tier_id: item?.user?.tier_id,
      user_id: item?.user?.encodedId,
      photo: item?.user?.profile,
      flagged: item?.user.flagged === true ? "flagged" : "unflagged",
      user_type: item?.user?.user_type || "mobile",
      email: item?.user?.email,
      property_name: item?.unit.name,
      address: item?.unit?.property_address,
      phone_number: item?.user?.phone,
      date: item?.application_date,
      total_package: item?.unit?.total_package
        ? Math.round(Number(item?.unit?.total_package)).toLocaleString()
        : "--- ---",
      yearly_amount: item?.unit?.renew_fee_amount
        ? Math.round(Number(item?.unit?.renew_fee_amount)).toLocaleString()
        : "--- ---", //item?.unit?.fee_amount,
      period_type: item?.unit?.period, //item?.unit?.fee_period,
      currency: currencies[item?.unit?.currency],
    })),
  };
};
