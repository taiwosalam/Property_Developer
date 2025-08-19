import api, { handleAxiosError } from "@/services/api";
import dayjs from "dayjs";

export interface SingleVehicleRecordApiResponse {
  data: {
    vehicle_record: {
      address: string;
      avatar: string;
      city: string;
      note: string;
      created_at: string;
      id: number;
      lga: string;
      manufacture_year: string;
      model: string;
      name: string;
      phone: string;
      plate_number: string;
      property_id: string;
      state: string;
      updated_at: string;
      user_id: string;
      vehicle_brand: string;
      vehicle_state: string;
      vehicle_type: string;
      visitor_category: string;
      deleted_at: string | "";
      color?: string;
      notes:
        | {
            last_updated: string;
            write_up: string;
          }
        | undefined;
      user_tag: "web" | "mobile";
    };
    check_ins: {
      data: Array<{
        check_in_time: string;
        check_out_time: string;
        created_at: string;
        deleted_at: string | "";
        id: number;
        in_by: string;
        inventory_in: string;
        inventory_out: string;
        out_by: string;
        passengers_in: string;
        passengers_out: string;
        status: string;
        inventory_id: number;
        updated_at: string;
        vehicle_record_id: number;
      }>;
      current_page: number;
      total: number;
      prev_page_url: string;
      next_page_url: string;
      first_page_url: string;
      last_page: number;
      last_page_url: string;
      per_page: number;
    };
  };
}

export interface VehicleDetails {
  id: number;
  brand: string;
  plate_number: string;
  category: string;
  model: string;
  state: string;
  color?: string;
  manufacture_year: string;
  vehicle_type: string;
}

export interface UserData {
  user_tag: "web" | "mobile";
  id: string | number;
  pictureSrc: string;
  full_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  phone_number: string;
  avatar: string;
  notes?: {
    last_updated: string;
    write_up?: string;
  };
  note?: string;
  registrationDate: string;
}

export interface WebContactInfo {
  info: {
    Address: string;
    City: string;
    State: string;
    "L.G": string;
  };
}

export interface checkInsOutData {
  check_ins: Array<{
    check_in_time: string;
    check_out_time: string;
    created_at: string;
    deleted_at: string | "";
    visitor_name: string;
    id: number;
    in_by: string;
    inventory_in: string;
    inventory_out: string;
    out_by: string;
    passengers_in: string;
    passengers_out: string;
    status: string;
    inventory_id: number;
    updated_at: string;
    vehicle_record_id: number;
  }>;
  current_page: number;
  total: number;
  prev_page_url: string;
  next_page_url: string;
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  per_page: number;
}

export const transformSingleVehicleRecordApiResponse = (
  response: SingleVehicleRecordApiResponse
): {
  userData: UserData;
  vehicleDetails: VehicleDetails;
  webContactInfo: WebContactInfo;
  checkInsOutData: checkInsOutData;
} => {
  const vehicleRecord = response.data.vehicle_record;
  console.log("response", response);

  // Check if vehicleRecord exists
  if (!vehicleRecord) {
    throw new Error("Vehicle record is missing in the response.");
  }

  return {
    userData: {
      user_tag: vehicleRecord.user_tag || "web",
      id: vehicleRecord.user_id || "", // Ensure we have a fallback if user_id is missing
      pictureSrc: vehicleRecord.avatar,
      full_name: vehicleRecord.name,
      state: vehicleRecord.state,
      local_government: vehicleRecord.lga,
      city: vehicleRecord.city,
      address: vehicleRecord.address,
      phone_number: vehicleRecord.phone,
      avatar: vehicleRecord.avatar,
      note: vehicleRecord.note,
      registrationDate: dayjs(vehicleRecord.created_at).format(
        "MM/DD/YYYY (hh:mm a)"
      ),
      notes: vehicleRecord.notes
        ? {
            last_updated: vehicleRecord.updated_at,
            write_up: vehicleRecord.notes.write_up,
          }
        : undefined,
    },
    vehicleDetails: {
      id: vehicleRecord.id,
      brand: vehicleRecord.vehicle_brand,
      plate_number: vehicleRecord.plate_number,
      category: vehicleRecord.visitor_category,
      model: vehicleRecord.model,
      state: vehicleRecord.vehicle_state,
      color: vehicleRecord.color,
      manufacture_year: vehicleRecord.manufacture_year,
      vehicle_type: vehicleRecord.vehicle_type,
    },
    webContactInfo: {
      info: {
        Address: vehicleRecord.address,
        City: vehicleRecord.city,
        State: vehicleRecord.state,
        "L.G": vehicleRecord.lga,
      },
    },
    checkInsOutData: {
      check_ins: [...response.data.check_ins.data].reverse().map((checkIn) => ({
        check_in_time: checkIn.check_in_time,
        check_out_time: checkIn.check_out_time,
        created_at: checkIn.created_at,
        deleted_at: checkIn?.deleted_at || "",
        id: checkIn.id,
        in_by: checkIn.in_by,
        visitor_name: vehicleRecord.name,
        inventory_in: checkIn.inventory_in,
        inventory_out: checkIn.inventory_out,
        out_by: checkIn.out_by,
        passengers_in: checkIn.passengers_in,
        passengers_out: checkIn.passengers_out,
        status: checkIn.status,
        inventory_id: checkIn.inventory_id,
        updated_at: checkIn.updated_at,
        vehicle_record_id: checkIn.vehicle_record_id,
      })),
      current_page: response.data.check_ins.current_page,
      total: response.data.check_ins.total,
      prev_page_url: response.data.check_ins.prev_page_url,
      next_page_url: response.data.check_ins.next_page_url,
      first_page_url: response.data.check_ins.first_page_url,
      last_page_url: response.data.check_ins.last_page_url,
      last_page: response.data.check_ins.last_page,
      per_page: response.data.check_ins.per_page,
    },
  };
};

// /vehicle-records/1/email?user_id
export const updateVehicle = async (recordId: string, payload: FormData) => {
  try {
    const res = await api.post(`/vehicle-records/${recordId}/email`, payload);
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
