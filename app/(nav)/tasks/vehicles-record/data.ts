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
    inventory: string;
  };
  // check_in: string;
  // check_out: string;
}

export interface VehicleRecordApiResponse {
  total_records: number;
  newly_created: number;
  vehicle_records: {
    data: VehicleData[];
    current_page: number;
    total: number;
  };
}

export interface VehicleRecordPageData {
  total_records: number;
  newly_created: number;
  vehicle_records: {
    data: VehicleData[];
    current_page: number;
    total: number;
  };
}

export const transformVehicleRecordApiResponse = (
  response: VehicleRecordApiResponse
): VehicleRecordPageData => {
  return {
    total_records: response.total_records,
    newly_created: response.newly_created,
    vehicle_records: {
      data: response.vehicle_records.data.map((record) => ({
        id: record.id,
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
        status: "pending", //TODO: remove this & add the actual status
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
          inventory:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        },
        // check_in: record.check_in,
        // check_out: record.check_out,
      })),
      current_page: response.vehicle_records.current_page,
      total: response.vehicle_records.total,
    },
  };
};

export const VehicleRecordData: VehicleRecord[] = [
  {
    id: "12345",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    name: "John Doe",
    category: "guest",
    registrationDate: "01/01/2024",
    plate_number: "XD9400AA",
    last_update: "02/03/2024 3:30PM",
    checkIn: {
      name: "John Doe",
      passenger: "3",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
  },
  {
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    name: "John Doe",
    id: "123456",
    category: "visitor",
    registrationDate: "01/01/2024",
    plate_number: "KrD2000AA",
    last_update: "02/03/2024 3:30PM",
    checkIn: {
      name: "John Doe",
      passenger: "4",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
    checkOut: {
      name: "John Doe",
      passenger: "2",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
  },
];

export const veicleRecordTablefields: Field[] = [
  { id: "1", accessor: "pictureSrc", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "Plate Number", accessor: "plate_number" },
  { id: "4", label: "Guest / Visitor", accessor: "category" },
  { id: "5", label: "Last Update", accessor: "last_update" },
  { id: "6", label: "Status", accessor: "status" },
  { id: "7", accessor: "action" },
];
