import type { Field } from "@/components/Table/types";
import type { VehicleRecord } from "@/components/tasks/vehicles-record/types";
import { formatDate } from "../agent-community/property-request/data";

export const vehicleRecordFIltersOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export interface VehicleData {
  id: string;
  user_id: string;
  property_id: string;
  plate_number: string;
  created_at: string;
  updated_at: string;
  brand: string;
  // avatar: string;
  city: string;
  address: string;
  phone: string;
  lga: string;
  state: string;
  model: string;
  visitor_category: string;
  vehicle_state: string;
  vehicle_type: string;
  vehicle_brand: string;
  manufacture_year: string;
  name: string;
  pictureSrc: string;
  status: string;
  avatar?: string;
  category: string;
  last_update: string;
  checkIn: {
    name: string;
    passenger: string;
    date: string;
  };
  // check_in: string;
  // check_out: string;
}

export interface VehicleRecordApiResponse {
  check_ins: number;
  check_ins_pending: number;
  check_ins_this_month: number;
  check_outs: number;
  check_outs_pending: number;
  check_outs_this_month: number;
  vehicle_records: {
    data: VehicleData[];
    current_page: number;
    total: number;
  };
}

export interface VehicleRecordPageData {
  check_ins: number;
  check_ins_pending: number;
  check_ins_this_month: number;
  check_outs: number;
  check_outs_pending: number;
  check_outs_this_month: number;
  vehicle_records: {
    data: VehicleData[];
    current_page: number;
    total: number;
  };
}

export const transformVehicleRecordApiResponse = (
  response: VehicleRecordApiResponse
): VehicleRecordPageData => {
  console.log("response", response);
  return {
    check_ins: response.check_ins,
    check_ins_pending: response.check_ins_pending,
    check_ins_this_month: response.check_ins_this_month,
    check_outs: response.check_outs,
    check_outs_pending: response.check_outs_pending,
    check_outs_this_month: response.check_outs_this_month,
    vehicle_records: {
      data: response.vehicle_records.data.map((record) => ({
        id: record.id,
        brand: record.brand,
        user_id: record.user_id,
        property_id: record.property_id,
        plate_number: record.plate_number,
        created_at: record.created_at,
        updated_at: record.updated_at,
        pictureSrc: record.avatar || "",
        city: record.city,
        address: record.address,
        phone: record.phone,
        lga: record.lga,
        state: record.state,
        name: record.name,
        model: record.model,
        status: record.status || "pending", //TODO: remove this & add the actual status
        category: record.visitor_category,
        visitor_category: record.visitor_category,
        vehicle_state: record.vehicle_state,
        vehicle_type: record.vehicle_type,
        vehicle_brand: record.vehicle_brand,
        manufacture_year: record.manufacture_year,
        last_update: formatDate(record.updated_at),
        checkIn: {
          name: record.name,
          passenger: "3",
          date: formatDate(record.created_at),
        },
      })),
      current_page: response.vehicle_records.current_page,
      total: response.vehicle_records.total,
    },
  };
};

export const veicleRecordTablefields: Field[] = [
  { id: "1", accessor: "pictureSrc", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "Plate Number", accessor: "plate_number" },
  { id: "4", label: "Guest / Visitor", accessor: "category" },
  { id: "5", label: "Last Update", accessor: "last_update" },
  { id: "6", label: "Status", accessor: "status" },
  { id: "7", accessor: "action" },
];
