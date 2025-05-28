// Types
import type {
  StaffProfilePortfolioProps,
  StaffProfileProps,
} from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";
import type { Field } from "@/components/Table/types";
// Images
import SampleProperty from "@/public/empty/SampleProperty.jpeg";
import SampleProperty2 from "@/public/empty/SampleProperty2.jpeg";
import SampleProperty3 from "@/public/empty/SampleProperty3.jpeg";
import SampleProperty4 from "@/public/empty/SampleProperty4.png";

import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";
import { StaffAPIResponse, StaffChatTypes, StaffPageTypes } from "./type";
import api, { handleAxiosError } from "@/services/api";
import { properties } from "@/app/(nav)/user/management/landlord/data";
import { empty } from "@/app/config";
import { link } from "fs";
import {
  staffTierColorMap,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import dayjs from "dayjs";
import { groupMessagesByDay } from "@/app/(nav)/(messages-reviews)/messages/data";
import moment from "moment";

export const sendVerifyStaffOTP = async () => {
  try {
    const response = await api.post("/staff/restrict/get-otp");
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const lockStaffAccount = async (id: string, otp: string) => {
  try {
    const response = await api.post(`/staff/${id}/restrict`, { otp });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const staffData: StaffProfileProps = {
  branch_id: "",
  id: "",
  personal_title: "",
  real_estate_title: "",
  full_name: "",
  email: "",
  phone_number: "",
  gender: "",
  position: "",
  picture: "",
  about: "",
  status: "",
  experience: 0,
};

export const initialPageData: StaffPageTypes = {
  staff: {
    id: "",
    name: "",
    email: "",
    title: "",
    real_estate_title: "",
    phone: "",
    username: "",
    gender: "",
    position: "",
    state: "",
    local_government: "",
    address: "",
    picture: "",
    user_id: "0",
    branch_id: "0",
    company_id: "0",
    created_at: "",
    updated_at: "",
    about_staff: "",
    status: "",
    experience: "",
  },
  activities: [],
  chats: [],
  portfolio: {
    properties: [
      {
        property_name: "",
        image: [""],
        address: "",
      },
    ],
    landlords: [],
    tenants: [],
  },
  messageUserData: {
    id: 0,
    name: "",
    position: "",
    imageUrl: empty,
    branch_id: 0,
  },
  staffChats: [],
};

export const placeholder_portfolio_data: StaffProfilePortfolioProps[] = [
  {
    title: "Properties",
    items: [
      {
        image: SampleProperty,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty2,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty3,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty4,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty4,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty4,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty4,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
    ],
  },
  {
    title: "Landlords",
    items: [
      {
        image: Avatar1,
        user: {
          name: "Abimbola Azeez Wasiu",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar3,
        user: {
          name: "Wasiu Sodeeq",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar4,
        user: {
          name: "Ibironke Adebimpe",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar4,
        user: {
          name: "Ibironke Adebimpe",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar4,
        user: {
          name: "Ibironke Adebimpe",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar4,
        user: {
          name: "Ibironke Adebimpe",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
    ],
  },
  {
    title: "Occupants & Tenants",
    items: [
      {
        image: Avatar1,
        user: {
          name: "Abimbola Azeez Wasiu",
          email: "test@test.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "test@testt.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "test@testt.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "test@testt.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "test@testt.com",
          phone_number: "+2348123456789",
        },
      },
    ],
  },
];

export const getPortfolioData = (portfolio: any) => {
  if (!portfolio) return [];

  return [
    {
      title: "Properties",
      items:
        portfolio.properties?.map((p: any) => ({
          link: `/management/properties/${p.id}`,
          image: p.image,
          property: {
            name: p.property_name,
            location: p.address,
          },
        })) || [],
    },
    {
      title: "Landlords",
      items:
        portfolio.landlords?.map((l: any) => ({
          link: `/management/landlord/${l.id}/manage`,
          image: l.image || "",
          user: {
            name: l.name,
            email: l.email,
            phone_number: l.phone,
            badge_color: l.badge_color,
          },
        })) || [],
    },
    {
      title: "Occupants & Tenants",
      items:
        portfolio.tenants?.map((t: any) => ({
          link: `/management/tenants/${t.id}/manage`,
          image: t.image || "",
          user: {
            name: t.name,
            email: t.email,
            phone_number: t.phone,
            badge_color: t.badge_color,
          },
        })) || [],
    },
  ];
};

export const staffActivitiesTableFields: Field[] = [
  { id: "1", label: "S/N", accessor: "S/N" },
  // { id: "2", label: "Username", accessor: "username" },
  { id: "3", label: "Page Visits", accessor: "page_visits" },
  { id: "4", label: "Action Taken", accessor: "action_taken" },
  { id: "5", label: "IP Address", accessor: "ip_address" },
  { id: "6", label: "Location", accessor: "location" },
  { id: "7", label: "Date", accessor: "date" },
  { id: "8", label: "Time", accessor: "time" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    username: "ola@gail.com",
    page_visits: "Landlord Login Page",
    action_taken: "Login Success",
    ip_address: "105.113.18.186",
    location: "6.537216, 3.3488896",
    date: "12/12/12",
    time: "3:20pm",
  }));
};

export const activitiesTableData = generateTableData(5);

// function to change Yes/no to active/inactive
export const yesNoToActiveInactive = (yesNo: string): string => {
  return yesNo === "Yes" ? "active" : "inactive";
};

export const transformStaffAPIResponse = (
  res: StaffAPIResponse
): StaffPageTypes => {
  // console.log("our res", res);
  return {
    staff: {
      id: res.data.id.toString(),
      name: res.data.name,
      email: res.data.email,
      title: res.data.title,
      real_estate_title: res.data.professional_title,
      phone: res.data.phone,
      picture: res.data.picture,
      username: res.data.username,
      gender: res.data.gender,
      position: res.data.position,
      state: res.data.state,
      local_government: res.data.local_government,
      address: res.data.address,
      user_id: res.data.user_id,
      branch_id: res.data.branch_id,
      company_id: res.data.company_id,
      created_at: res.data.created_at,
      updated_at: res.data.updated_at,
      about_staff: res.data.about_staff,
      experience: res.data.years_experience,
      status: yesNoToActiveInactive(res.data.status),
      badge_color: res.data.tier_id === 2 ? "gray" : undefined,
      online: res.data.online_status === "online",
      // badge_color: res.data.tier_id
      //   ? staffTierColorMap[res.data.tier_id as keyof typeof staffTierColorMap]
      //   : undefined,
    },
    activities:
      res.activities?.map((a) => {
        // const actionTaken = JSON.parse(a.action_taken);
        // const message = actionTaken.message;
        const { latitude, longitude } = a.location;
        return {
          id: a["S/N"],
          username: a.username,
          page_visits: getLastPathSegment(a.page_visits),
          // page_visits: a.page_visits,
          // action_taken: message,
          action_taken: a.action_taken,
          ip_address: a.ip_address,
          location: a.location,
          date: a.date,
          time: dayjs(a.time, "HH:mm:ss").isValid()
            ? dayjs(a.time, "HH:mm:ss").format("hh:mm a")
            : "-- -- --",
        };
      }) || [],
    chats: [],
    portfolio: {
      properties:
        res?.data?.properties?.map((p) => {
          return {
            id: p.id.toString(),
            property_name: p.name,
            address: `${p.full_address}, ${p.city_area}, ${p.local_government}, ${p.state}`,
            image: p.images?.[0]?.path || empty,
          };
        }) || [],
      landlords:
        res?.data?.landlords?.map((l) => {
          return {
            id: l.id.toString(),
            name: l.name,
            email: l.email,
            phone: l.phone || "",
            image: l.picture || empty,
            badge_color: l.user_tier
              ? tierColorMap[l.user_tier as keyof typeof tierColorMap]
              : undefined,
          };
        }) || [],
      tenants:
        res?.data?.tenants?.map((t) => {
          return {
            id: t.id.toString(),
            name: t.name,
            email: t.email,
            phone: t.phone,
            image: t.picture || empty,
            badge_color: t.user_tier
              ? tierColorMap[t.user_tier as keyof typeof tierColorMap]
              : undefined,
          };
        }) || [],
    },
    messageUserData: {
      id: Number(res.data.user_id),
      name: res.data.name,
      position: "staff",
      imageUrl: res.data.picture ?? empty,
      branch_id: 1, //TEST 
    },
    staffChats: res.messages?.map((chat): any => ({
      pfp: chat.profile_picture || empty,
      desc: chat.latest_message,
      time: chat.latest_message_time,
      fullname: chat.participant_name,
      id: chat.participant_id.toString(),
      messages: chat.unread_count, 
      verified: chat.participant_type,
      content_type: chat.latest_message_type,
      unread_count: chat.unread_count,
      last_seen: chat.participant_onlineStatus,
      online: chat.participant_onlineStatus === "online",
      groupedMessages: groupMessagesByDay(
        chat.messages.map((msg:any) => ({
          id: msg.id.toString(),
          text: msg.content,
          senderId: msg.sender_id.toString(),
          timestamp: moment(msg.created_at).format("YYYY-MM-DD hh:mm A"),
          content_type: msg.content_type,
        }))
      ),
    })) || [],
  };
};

const getLastPathSegment = (url: string): string => {
  try {
    if (!url || typeof url !== "string") return "";
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const segments = pathname.split("/").filter((segment) => segment);

    // Return the last segment or an empty string if there are no segments
    return segments.length > 0 ? segments[segments.length - 1] : "";
  } catch (error) {
    console.error(`Failed to parse URL: ${url}`, error);
    return "";
  }
};
