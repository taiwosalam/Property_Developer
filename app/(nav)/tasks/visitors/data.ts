import api, { handleAxiosError } from "@/services/api";

export const VisitorRequestFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export interface VisitorRequestDataDataType {
  userName: string;
  requestDate: string;
  requestId: string;
  status: "completed" | "pending" | "in-progress" | "decline";
  pictureSrc: string;
  visitorName: string;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  branch: string;
} //check with API

export const VisitorRequestData: VisitorRequestDataDataType[] = [
  {
    userName: "Salam AIshat",
    requestDate: "01/01/2024",
    requestId: "56566346467",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the primary school?",
    secretAnswer: "Obalende secondary school.",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
  {
    userName: "Jonah Jakpa",
    requestDate: "04/02/2024",
    requestId: "56566346467",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the name of the first school?",
    secretAnswer: "Oke-Afa",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
  {
    userName: "Ramsey Oke",
    requestDate: "05/03/2024",
    requestId: "56566346467",
    status: "in-progress",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the name of the first school?",
    secretAnswer: "Oke-Afa",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
  {
    userName: "Samuel Emmauel",
    requestDate: "05/03/2024",
    requestId: "56566346467",
    status: "decline",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the name of the first school?",
    secretAnswer: "Oke-Afa",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
];

export interface Visitor {
  userName: string;
  requestDate: string;
  tier_id: number;
  requestId: string;
  status: "completed" | "pending" | "in-progress" | "decline";
  pictureSrc: string;
  visitorName: string;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  branch: string;
  checked_status: string;
  checked_in_by: string | null;
  checked_out_by: string | null;
  check_out_companion: string;
  check_in_companion: string;
  check_in_inventory: string;
  check_out_inventory: string;
  check_in_date: string | null;
  check_out_date: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
}
export interface VisitorPageData {
  total: number;
  month_total: number;
  total_pending: number;
  month_pending: number;
  total_completed: number;
  month_completed: number;
  visitors: Visitor[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export const transformVisitorRequestData = (
  data: VisitorRequestsResponse
): VisitorPageData => {
  return {
    total: data?.total || 0,
    month_total: data?.month_total || 0,
    total_pending: data?.total_pending || 0,
    month_pending: data?.month_pending || 0,
    total_completed: data?.total_completed || 0,
    month_completed: data?.month_completed || 0,
    visitors: data?.data?.map((visitor) => {
      return {
        id: visitor.id,
        checked_status: visitor.status,
        checked_in_by: visitor.check_in_by,
        checked_out_by: visitor.check_out_by,
        check_out_companion: visitor.check_out_companion,
        check_in_companion: visitor.check_in_companion,
        check_in_inventory: visitor.check_in_inventory,
        check_out_inventory: visitor.check_out_inventory,
        check_in_date: visitor.check_in_date,
        check_out_date: visitor.check_out_date,
        check_in_time: visitor.check_in_time,
        check_out_time: visitor.check_out_time,
        tier_id: visitor.user?.tier,
        userName: visitor.user?.name,
        requestDate: visitor.request_date,
        requestId: visitor.request_id,
        status: visitor.status,
        pictureSrc: visitor.user?.picture,
        visitorName: visitor.visitor_name,
        visitorPhoneNumber: visitor.visitor_number,
        secretQuestion: visitor.secret_question,
        secretAnswer: visitor.secret_answer,
        purpose: visitor.purpose,
        propertyName: visitor.user?.tenant?.units
          ?.map((property) => property.property.title)
          .join(""),
        branch: visitor.user?.tenant?.units
          ?.map((property) => property.property.branch_name)
          .join(""),
      };
    }),
    pagination: {
      current_page: data?.pagination?.current_page || 1,
      per_page: data?.pagination?.per_page || 10,
      total: data?.pagination?.total,
      total_pages: data?.pagination?.total_pages,
    },
  };
};

export interface ICheckInPayload {
  inventory: string;
  companion: string;
  check_in_date?: string;
  check_in_time?: string;
  check_out_date?: string;
  check_out_time?: string;
}

export const handleCheckIn = async (id: string, data: ICheckInPayload) => {
  const payload = {
    check_in_inventory: data.inventory,
    check_in_companion: data.companion,
    check_in_date: data.check_in_date,
    check_in_time: data.check_in_time,
  };

  try {
    const response = await api.put(`visitor-requests/${id}/check-in`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
       window.dispatchEvent(new Event("refetchVisitors"));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Check-in failed:", error);
    handleAxiosError(error);
    throw error; // Re-throw to handle in component
  }
};

export const handleCheckOut = async (id: string, data: ICheckInPayload) => {
  const payload = {
    check_out_inventory: data.inventory,
    check_out_companion: data.companion,
    check_out_date: data.check_out_date,
    check_out_time: data.check_out_time,
  };

  try {
    const response = await api.put(
      `visitor-requests/${id}/check-out`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
       window.dispatchEvent(new Event("refetchVisitors"));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Check-out failed:", error);
    handleAxiosError(error);
    throw error;
  }
};
