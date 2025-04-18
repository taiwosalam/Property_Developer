import dayjs from "dayjs";

export type ActivityApiResponse = {
  data: {
    activities: [
      {
        action: string;
        user_id: number;
        date: string;
        ip_address: string;
        location: {
          city: string;
          country: string;
          latitude: string;
          longitude: string;
        };
        page_visited: string;
        time: string;
        user_name: string;
      }
    ];
  };
  message: string;
  status: string;
};

export type ActivityTable = {
  id: number;
  username: string;
  page_visited: string;
  action_taken: string;
  ip_address: string;
  location: string;
  date: string;
  time: string;
  longitude: string;
  latitude: string;
};

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Activity {
  user_id: number;
  user_name: string;
  page_visited: string;
  ip_address: string;
  location: Location;
  date: string;
  time: string;
}

interface ActivitiesData {
  activities: Activity[];
}

export interface UserActivityResponse {
  status: string;
  message: string;
  data: ActivitiesData;
}

export function getLastSegment(url: string): string | null {
  if (!url) return null;

  const segments = url.replace(/\/$/, "").split("/");

  const last = segments.pop();
  const secondLast = segments.pop();

  return last && !isNaN(Number(last)) ? secondLast ?? null : last ?? null;
}

export interface UserActivityTable {
  name: string;
  activities: {
    id: number;
    page_visited: string;
    location: string;
    time: string;
    ip_address: string;
    username: string;
    date: string;
  }[];
}
export const transformUserActivityData = (
  data: UserActivityResponse
): UserActivityTable => {
  return {
    name: data?.data?.activities[0]?.user_name,
    activities: data?.data?.activities?.map((activity) => {
      return {
        id: activity?.user_id ?? "____ ____",
        page_visited: getLastSegment(activity?.page_visited) || "___ ___",
        location: activity?.location
          ? `${activity.location.city}, ${activity.location.country}`
          : "____ ____",
        time: activity?.time ?? "____ ____",
        ip_address: activity?.ip_address ?? "____ ____",
        username: activity?.user_name ?? "____ ____",
        date: activity?.date ?? "____ ____",
      };
    }),
  };
};

export const transformActivityAData = (
  data: ActivityApiResponse
): ActivityTable[] => {
  const { data: apiData } = data;
  return apiData.activities.map((activity, index) => {
    return {
      id: activity?.user_id,
      username: activity.user_name,
      page_visited: getLastSegment(activity.page_visited) || "",
      action_taken: activity.action,
      ip_address: activity.ip_address,
      location:  activity.location.city,
      date: activity.date,
      time: activity.time ? dayjs(activity.time, "HH:mm").format("hh:mm A") : "___ ___",
      longitude: activity.location.longitude,
      latitude: activity.location.latitude,
    };
  });
};
