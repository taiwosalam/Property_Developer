import type { Field } from "@/components/Table/types";
import { formatDate } from "../../management/agent-community/property-request/data";
import { initialPageState, VehicleRecordAPIRes, VehicleRecordData } from "./type";

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
    id: number;
    user_id: string;
    property_id: number;
    plate_number: string;
    created_at: string;
    updated_at: string;
    brand?: string;
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
    registrationDate: string;
    last_update: string;
    latest_check_in: LatestCheckInData;
}

export interface LatestCheckInData {
  id: number;
  vehicle_record_id: number;
  in_by: string;
  out_by: string;
  passengers_in: string;
  passengers_out: string;
  inventory_in: string;
  inventory_out: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
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
    last_page: number;
    total: number;
  };
}

export interface CheckIn {
  id: number;
  vehicle_record_id: number;
  in_by: string;
  out_by: string;
  passengers_in: string;
  passengers_out: string;
  inventory_in: string;
  inventory_out: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface VehicleRecord {
  id: number;
  user_id: string;
  property_id: number;
  name: string;
  state: string;
  lga: string;
  city: string;
  address: string;
  phone: string;
  avatar: string;
  color: string;
  plate_number: string;
  vehicle_state: string;
  vehicle_type: string;
  vehicle_brand: string;
  manufacture_year: string;
  model: string;
  visitor_category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: any;
  check_ins: CheckIn[];
  latest_check_in: LatestCheckInData;
}

export interface CheckIns {
  current_page: number;
  data: CheckIn[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string; label: string; active: boolean }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface Stats {
  check_ins: { total: number; this_month: number };
  check_outs: { total: number; this_month: number };
  pending: { total: number; this_month: number };
}

export interface VehicleRecordApiResponse {
  data: {
    vehicle_records: { vehicle_record: VehicleRecord; check_ins: CheckIns }[];
    stats: Stats;
  };
}

export const transformVehicleRecordApiResponse = (
  response: VehicleRecordApiResponse
): VehicleRecordPageData => {
  console.log("response", response);
  const vehicle_records = response.data.vehicle_records;
  return {
    check_ins: response.data.stats.check_ins.total,
    check_ins_pending: response.data.stats.pending.total,
    check_ins_this_month: response.data.stats.check_ins.this_month,
    check_outs: response.data.stats.check_outs.total,
    check_outs_pending: response.data.stats.pending.total,
    check_outs_this_month: response.data.stats.check_outs.this_month,
    vehicle_records: {
      last_page: 0,
      data: vehicle_records.map((record) => ({
        // vehicle_records: {
          id: record.vehicle_record.id,
          vehicle_brand: record.vehicle_record.vehicle_brand,
          user_id: record.vehicle_record.user_id,
          property_id: record.vehicle_record.property_id,
          plate_number: record.vehicle_record.plate_number,
          created_at: record.vehicle_record.created_at,
          updated_at: record.vehicle_record.updated_at,
          pictureSrc: record.vehicle_record.avatar || "",
          city: record.vehicle_record.city,
          address: record.vehicle_record.address,
          phone: record.vehicle_record.phone,
          lga: record.vehicle_record.lga,
          state: record.vehicle_record.state,
          name: record.vehicle_record.name,
          model: record.vehicle_record.model,
          status: !record.vehicle_record.latest_check_in
            ? "no_record"
            : Object.keys(record.vehicle_record.latest_check_in).length === 0
              ? "completed"
              : "pending",
          category: record.vehicle_record.visitor_category,
          registrationDate: formatDate(record.vehicle_record.created_at),
          visitor_category: record.vehicle_record.visitor_category,
          vehicle_state: record.vehicle_record.vehicle_state,
          vehicle_type: record.vehicle_record.vehicle_type,
          manufacture_year: record.vehicle_record.manufacture_year,
          last_update: formatDate(record.vehicle_record.updated_at),
          latest_check_in: {
            ...record.vehicle_record.check_ins[0],
          },
        // },
      })),
      current_page: 0,
      total: 0,
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

export const format_date_time = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const initialData: initialPageState = {
  data: [],
  stats: {
    total_properties: 0,
    properties_this_month: 0,
    total_vehicle_records: 0,
    vehicle_records_this_month: 0,
    current_page: 0,
    last_page: 0
  }
}

export const initialRecord: VehicleRecordData = {
  data: {
    id: "12133",
    images: [""],
    property_name: 'Property Names',
    units_count: 20,
    address: '12, kola sanusi street, mabolaje oyo',
    total_unit_pictures: 10,
    hasVideo: true,
    property_type: 'rental',
    total_returns: 20000,
    total_income: 40000,
    branch: 'Branch Name',
    accountOfficer: "Officer muba",
    last_updated: '27/11/2023',
    mobile_tenants: 2,
    web_tenants: 2,
    owing_units: 3,
    available_units: 34,
    currency: 'naira',
    isClickable: 0,
    viewOnly: 0,
  }
}
 
export const transformVehicleRecords = (res: VehicleRecordAPIRes) => {
  return {
    stats: {
      total_properties: res.stats.total_properties,
      properties_this_month: res.stats.properties_this_month,
      total_vehicle_records: res.stats.total_vehicle_records,
      vehicle_records_this_month: res.stats.vehicle_records_this_month,
      current_page: res.stats.current_page,
      last_page: res.stats.last_page,
    },
    data: res.properties.data.map((item: any) => ({
      id: item.id,
      images: item.images, 
      property_name: item.title,
      units_count: item.units_count,
      address: `${item.full_address}, ${item.city_area}, ${item.local_government}, ${item.state}`,
      total_unit_pictures: item.images.length,
      hasVideo: item.has_video,
      property_type: item.property_type,
      total_returns: item.total_returns,
      total_income: item.total_income,
      branch: item.branch,
      accountOfficer: item.account_officer,
      last_updated: item.updated_at,
      mobile_tenants: item.mobile_tenants,
      web_tenants: item.web_tenants,
      owing_units: item.owing_units,
      available_units: item.available_units,
      currency: item.currency,
      isClickable: item.isClickable,
      viewOnly: item.viewOnly,
    })),
  }
}